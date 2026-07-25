import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma } from '@prisma/client'

export interface ScoreFactors {
  onTimePaymentRate: number
  averageDelayDays: number
  currentOverdueCount: number
  fulfilledPromises: number
  brokenPromises: number
  relationshipMonths: number
  components: {
    payment: number
    delay: number
    debt: number
    promises: number
    relationship: number
    contact: number
    service: number
  }
}

@Injectable()
export class ScoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerId(customerId: string, limit = 10) {
    return this.prisma.scoreSnapshot.findMany({
      where: { customerId },
      orderBy: { calculatedAt: 'desc' },
      take: limit,
    })
  }

  async findLatestByCustomerId(customerId: string) {
    return this.prisma.scoreSnapshot.findFirst({
      where: { customerId },
      orderBy: { calculatedAt: 'desc' },
    })
  }

  async create(data: {
    customerId: string
    score: number
    classification: string
    ruleVersion: string
    profileVersion: number
    factors: ScoreFactors
  }) {
    return this.prisma.scoreSnapshot.create({
      data: {
        customerId: data.customerId,
        score: data.score,
        classification: data.classification,
        ruleVersion: data.ruleVersion,
        profileVersion: data.profileVersion,
        factors: data.factors as unknown as Prisma.InputJsonValue,
        calculatedAt: new Date(),
      },
    })
  }

  async countByCustomerId(customerId: string) {
    return this.prisma.scoreSnapshot.count({
      where: { customerId },
    })
  }
}
