import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.prisma.isHealthy()

    const result = this.getStatus(key, isHealthy, {
      message: isHealthy ? 'Database connected' : 'Database unreachable',
    })

    if (isHealthy) {
      return result
    }

    throw new HealthCheckError('Database check failed', result)
  }
}
