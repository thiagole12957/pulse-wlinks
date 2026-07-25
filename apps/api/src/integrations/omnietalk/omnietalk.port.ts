export interface OmnieTalkContact {
  id: string
  name: string
  phone?: string
  email?: string
  whatsapp?: string
}

export interface OmnieTalkMessage {
  id: string
  contactId: string
  channel: 'whatsapp' | 'sms' | 'email'
  content: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: string
}

export interface OmnieTalkPort {
  findOrCreateContact(params: {
    name: string
    phone?: string
    email?: string
    whatsapp?: string
    externalId?: string
  }): Promise<OmnieTalkContact>

  sendWhatsApp(params: {
    contactId: string
    message: string
    templateId?: string
  }): Promise<OmnieTalkMessage>

  sendSms(params: { contactId: string; message: string }): Promise<OmnieTalkMessage>

  sendEmail(params: {
    contactId: string
    subject: string
    body: string
    templateId?: string
  }): Promise<OmnieTalkMessage>

  initiateCall(params: { contactId: string; agentId: string }): Promise<{ callId: string }>

  getMessageStatus(messageId: string): Promise<OmnieTalkMessage | null>
}
