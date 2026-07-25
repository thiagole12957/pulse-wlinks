import { Injectable } from '@nestjs/common'
import { ScoreRepository, ScoreFactors } from './score.repository'
import { FinancialProfileService } from '../financial-profile/financial-profile.service'
import { LoggerService } from '../common/logger/logger.service'

const RULE_VERSION = '1.0.0'

@Injectable()
export class ScoreService {
  constructor(
    private readonly repository: ScoreRepository,
    private readonly financialProfileService: FinancialProfileService,
    private readonly logger: LoggerService
  ) {}

  async getLatestScore(customerId: string) {
    const snapshot = await this.repository.findLatestByCustomerId(customerId)
    if (!snapshot) {
      return this.calculateAndSave(customerId)
    }
    return snapshot
  }

  async getScoreHistory(customerId: string, limit = 10) {
    return this.repository.findByCustomerId(customerId, limit)
  }

  async calculateAndSave(customerId: string) {
    this.logger.log(`Calculando score para cliente ${customerId}`, 'ScoreService')

    const profile = await this.financialProfileService.getProfile(customerId)

    const factors = this.buildFactors(profile)
    const { score, classification } = this.calculateScore(factors)

    return this.repository.create({
      customerId,
      score,
      classification,
      ruleVersion: RULE_VERSION,
      profileVersion: profile.profileVersion,
      factors,
    })
  }

  private buildFactors(profile: {
    onTimePaymentRate: { toNumber: () => number }
    averageDelayDays: { toNumber: () => number }
    currentOverdueCount: number
    fulfilledPromises: number
    brokenPromises: number
    relationshipMonths: number
  }): ScoreFactors {
    const onTimeRate = profile.onTimePaymentRate.toNumber()
    const avgDelay = profile.averageDelayDays.toNumber()

    // Calculate individual component scores
    const paymentScore = (onTimeRate / 100) * 30

    let delayScore = 0
    if (avgDelay === 0) delayScore = 20
    else if (avgDelay <= 7) delayScore = 15
    else if (avgDelay <= 15) delayScore = 10
    else if (avgDelay <= 30) delayScore = 5

    let debtScore = 0
    if (profile.currentOverdueCount === 0) debtScore = 20
    else if (profile.currentOverdueCount === 1) debtScore = 10
    else if (profile.currentOverdueCount <= 3) debtScore = 5

    let promisesScore = 0
    const totalPromises = profile.fulfilledPromises + profile.brokenPromises
    if (totalPromises > 0) {
      promisesScore = (profile.fulfilledPromises / totalPromises) * 15
    } else {
      promisesScore = 15
    }

    let relationshipScore = 0
    if (profile.relationshipMonths >= 24) relationshipScore = 10
    else if (profile.relationshipMonths >= 12) relationshipScore = 7
    else if (profile.relationshipMonths >= 6) relationshipScore = 5
    else relationshipScore = 2

    // Placeholder scores for contact and service
    const contactScore = 5
    const serviceScore = 5

    return {
      onTimePaymentRate: onTimeRate,
      averageDelayDays: avgDelay,
      currentOverdueCount: profile.currentOverdueCount,
      fulfilledPromises: profile.fulfilledPromises,
      brokenPromises: profile.brokenPromises,
      relationshipMonths: profile.relationshipMonths,
      components: {
        payment: Math.round(paymentScore * 100) / 100,
        delay: delayScore,
        debt: debtScore,
        promises: Math.round(promisesScore * 100) / 100,
        relationship: relationshipScore,
        contact: contactScore,
        service: serviceScore,
      },
    }
  }

  private calculateScore(factors: ScoreFactors): { score: number; classification: string } {
    const { components } = factors
    const totalScore =
      components.payment +
      components.delay +
      components.debt +
      components.promises +
      components.relationship +
      components.contact +
      components.service

    const finalScore = Math.round(Math.min(totalScore, 100))

    let classification: string
    if (finalScore >= 80) classification = 'EXCELENTE'
    else if (finalScore >= 60) classification = 'BOM'
    else if (finalScore >= 40) classification = 'REGULAR'
    else if (finalScore >= 20) classification = 'RISCO'
    else classification = 'CRITICO'

    return { score: finalScore, classification }
  }

  getScoreExplanation(factors: ScoreFactors): string[] {
    const explanations: string[] = []
    const { components } = factors

    if (components.payment >= 25) {
      explanations.push('Excelente histórico de pagamentos em dia')
    } else if (components.payment >= 15) {
      explanations.push('Bom histórico de pagamentos')
    } else {
      explanations.push('Histórico de pagamentos precisa melhorar')
    }

    if (components.delay >= 15) {
      explanations.push('Baixo tempo de atraso nos pagamentos')
    } else if (components.delay >= 10) {
      explanations.push('Tempo de atraso moderado')
    } else {
      explanations.push('Alto tempo de atraso nos pagamentos')
    }

    if (components.debt >= 15) {
      explanations.push('Sem débitos em aberto ou débito mínimo')
    } else if (components.debt >= 5) {
      explanations.push('Alguns débitos em aberto')
    } else {
      explanations.push('Múltiplos débitos em aberto')
    }

    if (components.promises >= 12) {
      explanations.push('Bom histórico de cumprimento de promessas')
    } else if (components.promises >= 5) {
      explanations.push('Histórico de promessas parcialmente cumpridas')
    } else if (factors.fulfilledPromises + factors.brokenPromises > 0) {
      explanations.push('Histórico de promessas não cumpridas')
    }

    if (components.relationship >= 8) {
      explanations.push('Cliente de longo relacionamento')
    } else if (components.relationship >= 5) {
      explanations.push('Cliente com relacionamento moderado')
    } else {
      explanations.push('Cliente recente')
    }

    return explanations
  }
}
