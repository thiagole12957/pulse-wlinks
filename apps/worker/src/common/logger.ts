import pino from 'pino'

const level = process.env.LOG_LEVEL ?? 'info'
const nodeEnv = process.env.NODE_ENV ?? 'development'

export function createLogger(name: string) {
  return pino({
    name,
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
      service: 'wlinks-pulse-worker',
      env: nodeEnv,
    },
    redact: {
      paths: ['cpf', 'document', 'token', 'password'],
      censor: '[REDACTED]',
    },
  })
}

export const logger = createLogger('worker')
