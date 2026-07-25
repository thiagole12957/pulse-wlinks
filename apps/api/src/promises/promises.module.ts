import { Module } from '@nestjs/common'
import { PromisesService } from './promises.service'
import { PromisesRepository } from './promises.repository'
import { PromisesController } from './promises.controller'

@Module({
  controllers: [PromisesController],
  providers: [PromisesService, PromisesRepository],
  exports: [PromisesService],
})
export class PromisesModule {}
