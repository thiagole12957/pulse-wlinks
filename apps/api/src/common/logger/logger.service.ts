import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import pino from 'pino'

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger

  constructor(private readonly configService: ConfigService) {
    const level = this.configService.get<string>('LOG_LEVEL', 'info')
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development')

    this.logger = pino({
      level,
      transport:
        nodeEnv === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      formatters: {
        level: (label) => ({ level: label }),
      },
      base: {
        service: 'wlinks-pulse-api',
        env: nodeEnv,
      },
      redact: {
        paths: ['req.headers.authorization', 'password', 'cpf', 'document', 'token'],
        censor: '[REDACTED]',
      },
    })
  }

  log(message: string, context?: string) {
    this.logger.info({ context }, message)
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message)
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message)
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message)
  }

  verbose(message: string, context?: string) {
    this.logger.trace({ context }, message)
  }

  child(bindings: Record<string, unknown>) {
    return this.logger.child(bindings)
  }
}
