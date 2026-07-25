import { Injectable } from '@nestjs/common'
import { FinancialProfileRepository } from './financial-profile.repository'
import { LoggerService } from '../common/logger/logger.service'

@Injectable()
export class FinancialProfileService {
  constructor(
    private readonly repository: FinancialProfileRepository,
    private readonly logger: LoggerService
  ) {}

  async getProfile(customerId: string) {
    const profile = await this.repository.findByCustomerId(customerId)
    if (!profile) {
      // Calcular se não existir
      return this.recalculate(customerId)
    }
    return profile
  }

  async recalculate(customerId: string) {
    this.logger.log(`Recalculando perfil financeiro do cliente ${customerId}`, 'FinancialProfileService')

    const metrics = await this.repository.calculateProfile(customerId)

    // Calcular score baseado nas métricas
    const { score, classification } = this.calculateScore(metrics)

    return this.repository.upsert(customerId, {
      ...metrics,
      currentScore: score,
      scoreClassification: classification,
    })
  }

  private calculateScore(metrics: {
    onTimePaymentRate: { toNumber: () => number }
    averageDelayDays: { toNumber: () => number }
    currentOverdueCount: number
    fulfilledPromises: number
    brokenPromises: number
    relationshipMonths: number
  }): { score: number; classification: string } {
    let score = 0

    // Regularidade de pagamento (30%)
    const onTimeRate = metrics.onTimePaymentRate.toNumber()
    score += (onTimeRate / 100) * 30

    // Atrasos históricos (20%) - quanto menor, melhor
    const avgDelay = metrics.averageDelayDays.toNumber()
    if (avgDelay === 0) score += 20
    else if (avgDelay <= 7) score += 15
    else if (avgDelay <= 15) score += 10
    else if (avgDelay <= 30) score += 5

    // Dívida atual (20%) - quanto menor, melhor
    if (metrics.currentOverdueCount === 0) score += 20
    else if (metrics.currentOverdueCount === 1) score += 10
    else if (metrics.currentOverdueCount <= 3) score += 5

    // Promessas (15%)
    const totalPromises = metrics.fulfilledPromises + metrics.brokenPromises
    if (totalPromises > 0) {
      const promiseRate = metrics.fulfilledPromises / totalPromises
      score += promiseRate * 15
    } else {
      score += 15 // Sem promessas = neutro positivo
    }

    // Relacionamento (10%)
    if (metrics.relationshipMonths >= 24) score += 10
    else if (metrics.relationshipMonths >= 12) score += 7
    else if (metrics.relationshipMonths >= 6) score += 5
    else score += 2

    // Resposta a contatos e situação do serviço (5% cada) - placeholder
    score += 5 + 5

    const finalScore = Math.round(Math.min(score, 100))

    let classification: string
    if (finalScore >= 80) classification = 'EXCELENTE'
    else if (finalScore >= 60) classification = 'BOM'
    else if (finalScore >= 40) classification = 'REGULAR'
    else if (finalScore >= 20) classification = 'RISCO'
    else classification = 'CRITICO'

    return { score: finalScore, classification }
  }
}
