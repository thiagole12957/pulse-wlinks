import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { PrismaHealthIndicator } from './indicators/prisma.health'
import { RedisHealthIndicator } from './indicators/redis.health'

@ApiTags('Health')
@Controller({ path: 'health', version: '' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private redisHealth: RedisHealthIndicator
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check básico' })
  @ApiResponse({ status: 200, description: 'Serviço operacional' })
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ])
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe para Kubernetes' })
  @ApiResponse({ status: 200, description: 'Processo vivo' })
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe para Kubernetes' })
  @ApiResponse({ status: 200, description: 'Serviço pronto para receber tráfego' })
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.prismaHealth.isHealthy('database'),
      () => this.redisHealth.isHealthy('redis'),
    ])
  }
}
