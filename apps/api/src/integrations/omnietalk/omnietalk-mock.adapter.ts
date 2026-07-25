import { Injectable } from '@nestjs/common'
import type { OmnieTalkPort, OmnieTalkContact, OmnieTalkMessage } from './omnietalk.port'
import { LoggerService } from '../../common/logger/logger.service'

@Injectable()
export class OmnieTalkMockAdapter implements OmnieTalkPort {
  private contactCounter = 1000
  private messageCounter = 5000

  constructor(private readonly logger: LoggerService) {}

  async findOrCreateContact(params: {
    name: string
    phone?: string
    email?: string
    whatsapp?: string
    externalId?: string
  }): Promise<OmnieTalkContact> {
    this.logger.debug(
      `OmnieTalk Mock: findOrCreateContact ${JSON.stringify(params)}`,
      'OmnieTalkMockAdapter'
    )

    this.contactCounter++

    return {
      id: `omnie-${this.contactCounter}`,
      name: params.name,
      phone: params.phone,
      email: params.email,
      whatsapp: params.whatsapp,
    }
  }

  async sendWhatsApp(params: {
    contactId: string
    message: string
    templateId?: string
  }): Promise<OmnieTalkMessage> {
    this.logger.debug(
      `OmnieTalk Mock: sendWhatsApp to ${params.contactId}`,
      'OmnieTalkMockAdapter'
    )

    this.messageCounter++

    return {
      id: `msg-${this.messageCounter}`,
      contactId: params.contactId,
      channel: 'whatsapp',
      content: params.message,
      status: 'sent',
      sentAt: new Date().toISOString(),
    }
  }

  async sendSms(params: { contactId: string; message: string }): Promise<OmnieTalkMessage> {
    this.logger.debug(`OmnieTalk Mock: sendSms to ${params.contactId}`, 'OmnieTalkMockAdapter')

    this.messageCounter++

    return {
      id: `msg-${this.messageCounter}`,
      contactId: params.contactId,
      channel: 'sms',
      content: params.message,
      status: 'sent',
      sentAt: new Date().toISOString(),
    }
  }

  async sendEmail(params: {
    contactId: string
    subject: string
    body: string
    templateId?: string
  }): Promise<OmnieTalkMessage> {
    this.logger.debug(`OmnieTalk Mock: sendEmail to ${params.contactId}`, 'OmnieTalkMockAdapter')

    this.messageCounter++

    return {
      id: `msg-${this.messageCounter}`,
      contactId: params.contactId,
      channel: 'email',
      content: params.body,
      status: 'sent',
      sentAt: new Date().toISOString(),
    }
  }

  async initiateCall(params: { contactId: string; agentId: string }): Promise<{ callId: string }> {
    this.logger.debug(
      `OmnieTalk Mock: initiateCall to ${params.contactId} by ${params.agentId}`,
      'OmnieTalkMockAdapter'
    )

    return {
      callId: `call-${Date.now()}`,
    }
  }

  async getMessageStatus(messageId: string): Promise<OmnieTalkMessage | null> {
    this.logger.debug(`OmnieTalk Mock: getMessageStatus ${messageId}`, 'OmnieTalkMockAdapter')

    // Simular mensagem entregue
    return {
      id: messageId,
      contactId: 'unknown',
      channel: 'whatsapp',
      content: 'Mock message',
      status: 'delivered',
      sentAt: new Date().toISOString(),
    }
  }
}
