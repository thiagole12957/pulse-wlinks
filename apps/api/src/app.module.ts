import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CommonModule } from './common/common.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { IntegrationsModule } from './integrations/integrations.module'
import { CustomersModule } from './customers/customers.module'
import { ContractsModule } from './contracts/contracts.module'
import { InvoicesModule } from './invoices/invoices.module'
import { RelationshipCasesModule } from './relationship-cases/relationship-cases.module'
import { FinancialProfileModule } from './financial-profile/financial-profile.module'
import { ScoreModule } from './score/score.module'
import { PromisesModule } from './promises/promises.module'
import { ContactsModule } from './contacts/contacts.module'
import { AiInsightsModule } from './ai-insights/ai-insights.module'
import { PickupsModule } from './pickups/pickups.module'
import { AuditModule } from './audit/audit.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CommonModule,
    HealthModule,
    AuthModule,
    IntegrationsModule,
    CustomersModule,
    ContractsModule,
    InvoicesModule,
    RelationshipCasesModule,
    FinancialProfileModule,
    ScoreModule,
    PromisesModule,
    ContactsModule,
    AiInsightsModule,
    PickupsModule,
    AuditModule,
  ],
})
export class AppModule {}
