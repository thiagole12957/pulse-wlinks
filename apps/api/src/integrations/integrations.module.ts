import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IxcService } from './ixc/ixc.service'
import { IxcMockAdapter } from './ixc/ixc-mock.adapter'
import { OmnieTalkService } from './omnietalk/omnietalk.service'
import { OmnieTalkMockAdapter } from './omnietalk/omnietalk-mock.adapter'
import { GcService } from './gc/gc.service'
import { GcMockAdapter } from './gc/gc-mock.adapter'

@Module({
  imports: [ConfigModule],
  providers: [
    IxcService,
    {
      provide: 'IXC_ADAPTER',
      useClass: IxcMockAdapter,
    },
    OmnieTalkService,
    {
      provide: 'OMNIETALK_ADAPTER',
      useClass: OmnieTalkMockAdapter,
    },
    GcService,
    {
      provide: 'GC_ADAPTER',
      useClass: GcMockAdapter,
    },
  ],
  exports: [IxcService, OmnieTalkService, GcService],
})
export class IntegrationsModule {}
