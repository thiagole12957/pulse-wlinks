import { Injectable, Inject } from '@nestjs/common'
import type { OmnieTalkPort } from './omnietalk.port'

@Injectable()
export class OmnieTalkService {
  constructor(@Inject('OMNIETALK_ADAPTER') private readonly adapter: OmnieTalkPort) {}

  findOrCreateContact(params: Parameters<OmnieTalkPort['findOrCreateContact']>[0]) {
    return this.adapter.findOrCreateContact(params)
  }

  sendWhatsApp(params: Parameters<OmnieTalkPort['sendWhatsApp']>[0]) {
    return this.adapter.sendWhatsApp(params)
  }

  sendSms(params: Parameters<OmnieTalkPort['sendSms']>[0]) {
    return this.adapter.sendSms(params)
  }

  sendEmail(params: Parameters<OmnieTalkPort['sendEmail']>[0]) {
    return this.adapter.sendEmail(params)
  }

  initiateCall(params: Parameters<OmnieTalkPort['initiateCall']>[0]) {
    return this.adapter.initiateCall(params)
  }

  getMessageStatus(messageId: string) {
    return this.adapter.getMessageStatus(messageId)
  }
}
