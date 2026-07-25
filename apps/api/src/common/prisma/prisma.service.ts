import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { LoggerService } from '../logger/logger.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Prisma conectado ao banco de dados', 'PrismaService')

    // @ts-expect-error Prisma event types
    this.$on('error', (event: { message: string }) => {
      this.logger.error(event.message, undefined, 'PrismaService')
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('Prisma desconectado do banco de dados', 'PrismaService')
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  }
}
