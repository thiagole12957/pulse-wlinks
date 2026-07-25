import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface CreateAiInsightDto {
  caseId: string
  invoiceExternalId?: string
  profileVersion: number
  promptVersion: string
  modelPolicyVersion: string
  cacheKey: string
  inputSummary: Record<string, unknown>
  requestedById: string
}

export interface UpdateAiInsightOutputDto {
  output: Record<string, unknown>
  model: string
  inputTokens: number
  outputTokens: number
  estimatedCost: number
}

@Injectable()
export class AiInsightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.aiInsight.findUnique({
      where: { id },
      include: {
        feedback: true,
        case: {
          include: { customer: true },
        },
      },
    })
  }

  async findByCacheKey(cacheKey: string) {
    return this.prisma.aiInsight.findUnique({
      where: { cacheKey },
      include: { feedback: true },
    })
  }

  async findByCaseId(caseId: string) {
    return this.prisma.aiInsight.findMany({
      where: { caseId, invalidatedAt: null },
      include: { feedback: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findValidByCacheKey(cacheKey: string) {
    return this.prisma.aiInsight.findFirst({
      where: { cacheKey, invalidatedAt: null },
      include: { feedback: true },
    })
  }

  async create(data: CreateAiInsightDto) {
    return this.prisma.aiInsight.create({
      data: {
        caseId: data.caseId,
        invoiceExternalId: data.invoiceExternalId,
        profileVersion: data.profileVersion,
        promptVersion: data.promptVersion,
        modelPolicyVersion: data.modelPolicyVersion,
        cacheKey: data.cacheKey,
        inputSummary: data.inputSummary as unknown as Prisma.InputJsonValue,
        requestedById: data.requestedById,
        status: 'PENDING',
      },
    })
  }

  async updateWithOutput(id: string, data: UpdateAiInsightOutputDto) {
    return this.prisma.aiInsight.update({
      where: { id },
      data: {
        output: data.output as unknown as Prisma.InputJsonValue,
        model: data.model,
        inputTokens: data.inputTokens,
        outputTokens: data.outputTokens,
        estimatedCost: new Decimal(data.estimatedCost),
        status: 'COMPLETED',
        generatedAt: new Date(),
      },
    })
  }

  async markAsFailed(id: string, error: string) {
    return this.prisma.aiInsight.update({
      where: { id },
      data: {
        status: 'FAILED',
        output: { error },
      },
    })
  }

  async invalidate(id: string, reason: string) {
    return this.prisma.aiInsight.update({
      where: { id },
      data: {
        invalidatedAt: new Date(),
        invalidationReason: reason,
      },
    })
  }

  async invalidateByCaseId(caseId: string, reason: string) {
    return this.prisma.aiInsight.updateMany({
      where: { caseId, invalidatedAt: null },
      data: {
        invalidatedAt: new Date(),
        invalidationReason: reason,
      },
    })
  }

  async addFeedback(insightId: string, userId: string, useful: boolean, comment?: string) {
    return this.prisma.aiInsightFeedback.upsert({
      where: {
        insightId_userId: {
          insightId,
          userId,
        },
      },
      create: {
        insightId,
        userId,
        useful,
        comment,
      },
      update: {
        useful,
        comment,
      },
    })
  }

  async getCostSummary(startDate: Date, endDate: Date) {
    const result = await this.prisma.aiInsight.aggregate({
      where: {
        generatedAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      _sum: {
        inputTokens: true,
        outputTokens: true,
        estimatedCost: true,
      },
      _count: true,
    })

    return {
      totalRequests: result._count,
      totalInputTokens: result._sum.inputTokens ?? 0,
      totalOutputTokens: result._sum.outputTokens ?? 0,
      totalCost: result._sum.estimatedCost?.toNumber() ?? 0,
    }
  }
}
