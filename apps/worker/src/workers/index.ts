import { Worker } from 'bullmq'
import type Redis from 'ioredis'
import { createLogger } from '../common/logger'
import { healthCheckWorker } from './health-check.worker'

const logger = createLogger('workers')

export async function registerWorkers(connection: Redis): Promise<Worker[]> {
  const workers: Worker[] = []

  // Health check worker (exemplo básico)
  const healthWorker = healthCheckWorker(connection)
  workers.push(healthWorker)

  logger.info('Workers registrados: health-check')

  return workers
}

export async function gracefulShutdown(workers: Worker[]): Promise<void> {
  logger.info('Iniciando graceful shutdown dos workers...')

  await Promise.all(
    workers.map(async (worker) => {
      try {
        await worker.close()
        logger.info({ worker: worker.name }, 'Worker encerrado')
      } catch (err) {
        logger.error({ err, worker: worker.name }, 'Erro ao encerrar worker')
      }
    })
  )
}
