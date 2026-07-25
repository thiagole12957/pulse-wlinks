import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AiInsightsRepository } from './ai-insights.repository'
import { FinancialProfileService } from '../financial-profile/financial-profile.service'
import { LoggerService } from '../common/logger/logger.service'
import { PrismaService } from '../common/prisma/prisma.service'
import * as crypto from 'crypto'

const PROMPT_VERSION = '1.0.0'
const MODEL_POLICY_VERSION = '1.0.0'

interface InsightInput {
  customerName: string
  relationshipMonths: number
  currentScore: number
  scoreClassification: string
  overdueCount: number
  overdueAmount: number
  onTimePaymentRate: number
  fulfilledPromises: number
  brokenPromises: number
  recentContactOutcome?: string
  caseStatus: string
}

interface InsightOutput {
  recommendation: string
  suggestedActions: string[]
  riskAssessment: string
  negotiationTips: string[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

@Injectable()
export class AiInsightsService {
  private readonly apiKey: string
  private readonly model: string

  constructor(
    private readonly repository: AiInsightsRepository,
    private readonly financialProfileService: FinancialProfileService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.apiKey = this.config.get<string>('OPENAI_API_KEY') ?? ''
    this.model = this.config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini'
  }

  async getById(id: string) {
    const insight = await this.repository.findById(id)
    if (!insight) {
      throw new NotFoundException(`Insight ${id} não encontrado`)
    }
    return insight
  }

  async getByCaseId(caseId: string) {
    return this.repository.findByCaseId(caseId)
  }

  async generateInsight(caseId: string, requestedById: string) {
    // Get case with customer data
    const relationshipCase = await this.prisma.relationshipCase.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        contacts: {
          orderBy: { contactedAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!relationshipCase) {
      throw new NotFoundException(`Caso ${caseId} não encontrado`)
    }

    // Get financial profile
    const profile = await this.financialProfileService.getProfile(
      relationshipCase.customerId
    )

    // Build input summary (redacted - no PII)
    const inputSummary: InsightInput = {
      customerName: this.maskName(relationshipCase.customer.legalName),
      relationshipMonths: profile.relationshipMonths,
      currentScore: profile.currentScore,
      scoreClassification: profile.scoreClassification,
      overdueCount: profile.currentOverdueCount,
      overdueAmount: profile.currentOverdueAmount.toNumber(),
      onTimePaymentRate: profile.onTimePaymentRate.toNumber(),
      fulfilledPromises: profile.fulfilledPromises,
      brokenPromises: profile.brokenPromises,
      recentContactOutcome: relationshipCase.contacts[0]?.outcome ?? undefined,
      caseStatus: relationshipCase.status,
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(
      caseId,
      profile.profileVersion,
      PROMPT_VERSION
    )

    // Check cache
    const cached = await this.repository.findValidByCacheKey(cacheKey)
    if (cached && cached.status === 'COMPLETED') {
      this.logger.log(
        `Retornando insight em cache para caso ${caseId}`,
        'AiInsightsService'
      )
      return cached
    }

    // Create pending insight
    const insight = await this.repository.create({
      caseId,
      profileVersion: profile.profileVersion,
      promptVersion: PROMPT_VERSION,
      modelPolicyVersion: MODEL_POLICY_VERSION,
      cacheKey,
      inputSummary: inputSummary as unknown as Record<string, unknown>,
      requestedById,
    })

    // Generate insight (mock or real)
    try {
      const output = await this.callAi(inputSummary)

      const updated = await this.repository.updateWithOutput(insight.id, {
        output: output as unknown as Record<string, unknown>,
        model: this.model,
        inputTokens: 500, // Mock values
        outputTokens: 200,
        estimatedCost: 0.001,
      })

      this.logger.log(
        `Insight gerado para caso ${caseId}`,
        'AiInsightsService'
      )

      return updated
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await this.repository.markAsFailed(insight.id, errorMessage)
      throw error
    }
  }

  private async callAi(input: InsightInput): Promise<InsightOutput> {
    // Mock implementation - in production, call OpenAI API
    if (!this.apiKey || this.apiKey === 'replace_me') {
      return this.generateMockInsight(input)
    }

    // Real OpenAI call would go here
    // For now, return mock
    return this.generateMockInsight(input)
  }

  private generateMockInsight(input: InsightInput): InsightOutput {
    const isHighRisk =
      input.scoreClassification === 'CRITICO' ||
      input.scoreClassification === 'RISCO'
    const hasHistory = input.relationshipMonths > 12
    const hasPromiseIssues = input.brokenPromises > input.fulfilledPromises

    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
    if (input.overdueCount > 3 || input.overdueAmount > 50000) {
      priority = 'URGENT'
    } else if (isHighRisk) {
      priority = 'HIGH'
    } else if (input.scoreClassification === 'EXCELENTE') {
      priority = 'LOW'
    }

    const suggestedActions: string[] = []
    const negotiationTips: string[] = []

    if (hasHistory && input.onTimePaymentRate > 70) {
      suggestedActions.push('Oferecer parcelamento flexível - cliente com bom histórico')
      negotiationTips.push('Mencionar o bom relacionamento e histórico de pagamentos')
    }

    if (hasPromiseIssues) {
      suggestedActions.push('Solicitar garantia adicional ou pagamento parcial à vista')
      negotiationTips.push('Evitar aceitar promessas de longo prazo')
    }

    if (input.recentContactOutcome === 'REQUESTED_NEGOTIATION') {
      suggestedActions.push('Preparar proposta de renegociação')
      negotiationTips.push('Cliente demonstrou interesse em resolver a situação')
    }

    if (input.overdueCount === 1) {
      suggestedActions.push('Enviar lembrete amigável antes de ações mais formais')
    }

    if (suggestedActions.length === 0) {
      suggestedActions.push('Realizar contato inicial para entender situação')
    }

    if (negotiationTips.length === 0) {
      negotiationTips.push('Manter tom profissional e empático')
    }

    return {
      recommendation: this.generateRecommendation(input, isHighRisk, hasHistory),
      suggestedActions,
      riskAssessment: this.generateRiskAssessment(input),
      negotiationTips,
      priority,
    }
  }

  private generateRecommendation(
    input: InsightInput,
    isHighRisk: boolean,
    hasHistory: boolean
  ): string {
    if (isHighRisk && !hasHistory) {
      return 'Cliente de alto risco e pouco histórico. Priorizar cobrança e avaliar possibilidade de recolhimento.'
    }

    if (isHighRisk && hasHistory) {
      return 'Cliente de longo relacionamento em situação de risco. Oferecer condições de negociação antes de medidas mais severas.'
    }

    if (input.scoreClassification === 'EXCELENTE') {
      return 'Cliente com excelente histórico. Provavelmente situação pontual. Contato cordial para entender e resolver.'
    }

    return 'Realizar contato para entender situação e oferecer soluções adequadas ao perfil do cliente.'
  }

  private generateRiskAssessment(input: InsightInput): string {
    if (input.scoreClassification === 'CRITICO') {
      return 'ALTO RISCO: Score crítico, alta probabilidade de inadimplência prolongada.'
    }

    if (input.scoreClassification === 'RISCO') {
      return 'RISCO MODERADO-ALTO: Requer atenção especial e acompanhamento próximo.'
    }

    if (input.overdueCount > 2) {
      return 'RISCO MODERADO: Múltiplas faturas em atraso indicam possíveis dificuldades financeiras.'
    }

    return 'BAIXO RISCO: Situação provavelmente pontual, boas chances de regularização.'
  }

  private maskName(name: string): string {
    const parts = name.split(' ')
    if (parts.length === 1) {
      return parts[0].charAt(0) + '***'
    }
    return parts[0].charAt(0) + '*** ' + parts[parts.length - 1].charAt(0) + '***'
  }

  private generateCacheKey(
    caseId: string,
    profileVersion: number,
    promptVersion: string
  ): string {
    const data = `${caseId}:${profileVersion}:${promptVersion}`
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  async addFeedback(insightId: string, userId: string, useful: boolean, comment?: string) {
    return this.repository.addFeedback(insightId, userId, useful, comment)
  }

  async invalidateByCaseId(caseId: string, reason: string) {
    return this.repository.invalidateByCaseId(caseId, reason)
  }

  async getCostSummary(startDate: Date, endDate: Date) {
    return this.repository.getCostSummary(startDate, endDate)
  }
}
