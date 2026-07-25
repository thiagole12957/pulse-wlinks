import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { LoggerService } from '../logger/logger.service'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379')

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error(`Redis: falha após ${times} tentativas`, undefined, 'RedisService')
          return null
        }
        return Math.min(times * 200, 2000)
      },
    })

    this.client.on('connect', () => {
      this.logger.log('Redis conectado', 'RedisService')
    })

    this.client.on('error', (err) => {
      this.logger.error(`Redis erro: ${err.message}`, undefined, 'RedisService')
    })
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit()
      this.logger.log('Redis desconectado', 'RedisService')
    }
  }

  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client não inicializado')
    }
    return this.client
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.client) return false
      const result = await this.client.ping()
      return result === 'PONG'
    } catch {
      return false
    }
  }
}
