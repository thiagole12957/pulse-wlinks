import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerService } from './logger/logger.service'
import { PrismaService } from './prisma/prisma.service'
import { RedisService } from './redis/redis.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerService, PrismaService, RedisService],
  exports: [LoggerService, PrismaService, RedisService],
})
export class CommonModule {}
