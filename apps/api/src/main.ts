import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { LoggerService } from './common/logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const logger = app.get(LoggerService)
  app.useLogger(logger)

  app.use(helmet())

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  })

  app.setGlobalPrefix('api')

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  const config = new DocumentBuilder()
    .setTitle('WLinks Pulse API')
    .setDescription('API de relacionamento financeiro e recuperação de clientes')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT ?? 3000
  await app.listen(port)

  logger.log(`API rodando em http://localhost:${port}`, 'Bootstrap')
  logger.log(`Documentação em http://localhost:${port}/api/docs`, 'Bootstrap')
}

bootstrap().catch((err) => {
  console.error('Falha ao iniciar a aplicação:', err)
  process.exit(1)
})
