import { Worker, Job } from 'bullmq'
import type Redis from 'ioredis'
import { createLogger } from '../common/logger'

const logger = createLogger('health-check-worker')

interface HealthCheckJobData {
  timestamp: string
}

export function healthCheckWorker(connection: Redis): Worker {
  const worker = new Worker<HealthCheckJobData>(
    'health-check',
    async (job: Job<HealthCheckJobData>) => {
      logger.info({ jobId: job.id, data: job.data }, 'Processando health check job')

      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 100))

      return {
        status: 'ok',
        processedAt: new Date().toISOString(),
      }
    },
    {
      connection,
      concurrency: 1,
    }
  )

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Job completado')
  })

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Job falhou')
  })

  return worker
}
