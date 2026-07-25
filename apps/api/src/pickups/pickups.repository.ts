import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { PickupStatus } from '@prisma/client'

export interface CreateAssessmentDto {
  caseId: string
  createdById: string
  offlineSince?: Date
  contactAttempts: number
  hasActivePromise: boolean
  hasBlockingTechnicalOrder: boolean
  equipmentConfirmedAtAddress?: boolean
  recommendation: string
  rationale: Record<string, unknown>
}

export interface CreateRequestDto {
  assessmentId: string
  requestedById: string
}

@Injectable()
export class PickupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Assessments
  async findAssessmentById(id: string) {
    return this.prisma.pickupAssessment.findUnique({
      where: { id },
      include: {
        case: {
          include: { customer: true, contract: true },
        },
        request: true,
      },
    })
  }

  async findAssessmentsByCaseId(caseId: string) {
    return this.prisma.pickupAssessment.findMany({
      where: { caseId },
      include: { request: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createAssessment(data: CreateAssessmentDto) {
    return this.prisma.pickupAssessment.create({
      data: {
        caseId: data.caseId,
        createdById: data.createdById,
        offlineSince: data.offlineSince,
        contactAttempts: data.contactAttempts,
        hasActivePromise: data.hasActivePromise,
        hasBlockingTechnicalOrder: data.hasBlockingTechnicalOrder,
        equipmentConfirmedAtAddress: data.equipmentConfirmedAtAddress,
        recommendation: data.recommendation,
        rationale: data.rationale as unknown as Prisma.InputJsonValue,
      },
    })
  }

  // Requests
  async findRequestById(id: string) {
    return this.prisma.pickupRequest.findUnique({
      where: { id },
      include: {
        assessment: {
          include: {
            case: {
              include: { customer: true, contract: true },
            },
          },
        },
      },
    })
  }

  async findRequestsByStatus(status: PickupStatus) {
    return this.prisma.pickupRequest.findMany({
      where: { status },
      include: {
        assessment: {
          include: {
            case: {
              include: { customer: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findPendingApproval() {
    return this.findRequestsByStatus(PickupStatus.PENDING_APPROVAL)
  }

  async createRequest(data: CreateRequestDto) {
    return this.prisma.pickupRequest.create({
      data: {
        assessmentId: data.assessmentId,
        requestedById: data.requestedById,
        status: PickupStatus.PENDING_APPROVAL,
      },
    })
  }

  async approveRequest(id: string, approvedById: string) {
    return this.prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
    })
  }

  async rejectRequest(id: string, approvedById: string, rejectionReason: string) {
    return this.prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.REJECTED,
        approvedById,
        approvedAt: new Date(),
        rejectionReason,
      },
    })
  }

  async markAsOpenedInGc(id: string, gcExternalId: string) {
    return this.prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.OPENED_IN_GC,
        gcExternalId,
        openedInGcAt: new Date(),
      },
    })
  }

  async markAsCompleted(id: string) {
    return this.prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.COMPLETED,
        completedAt: new Date(),
      },
    })
  }

  async cancel(id: string) {
    return this.prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.CANCELED,
      },
    })
  }

  async countByStatus() {
    const result = await this.prisma.pickupRequest.groupBy({
      by: ['status'],
      _count: true,
    })

    return result.reduce(
      (acc, item) => {
        acc[item.status] = item._count
        return acc
      },
      {} as Record<PickupStatus, number>
    )
  }
}
