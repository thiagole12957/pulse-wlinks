import { Module } from '@nestjs/common'
import { PickupsService } from './pickups.service'
import { PickupsRepository } from './pickups.repository'
import { PickupsController } from './pickups.controller'
import { ContactsModule } from '../contacts/contacts.module'
import { PromisesModule } from '../promises/promises.module'

@Module({
  imports: [ContactsModule, PromisesModule],
  controllers: [PickupsController],
  providers: [PickupsService, PickupsRepository],
  exports: [PickupsService],
})
export class PickupsModule {}
