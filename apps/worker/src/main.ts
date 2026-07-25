import { createLogger } from './common/logger'
import { createRedisConnection } from './common/redis'
import { registerWorkers, gracefulShutdown } from './workers'

const logger = createLogger('main')

async function bootstrap() {
  logger.info('Iniciando WLinks Pulse Worker...')

  const redisConnection = createRedisConnection()

  // Verificar conexão com Redis
  try {
    await redisConnection.ping()
    logger.info('Conexao com Redis estabelecida')
  } catch (err) {
    logger.error({ err }, 'Falha ao conectar ao Redis')
    process.exit(1)
  }

  // Registrar workers
  const workers = await registerWorkers(redisConnection)
  logger.info(`${workers.length} workers registrados`)

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Recebido sinal de shutdown')
    await gracefulShutdown(workers)
    await redisConnection.quit()
    logger.info('Worker encerrado com sucesso')
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  logger.info('Workers prontos para processar jobs')
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Falha ao iniciar worker')
  process.exit(1)
})
