import { Module } from '@nestjs/common'
import { ContactsService } from './contacts.service'
import { ContactsRepository } from './contacts.repository'
import { ContactsController } from './contacts.controller'

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, ContactsRepository],
  exports: [ContactsService],
})
export class ContactsModule {}
