-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING_ACTIVATION');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DIRECTOR', 'SUPERVISOR', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'FAILED', 'STALE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PRE_CONTRACT', 'NEGATIVE', 'WITHDRAWN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InternetStatus" AS ENUM ('ACTIVE', 'DISABLED', 'AUTO_BLOCKED', 'MANUAL_BLOCKED', 'WAITING_SIGNATURE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'PAID', 'PARTIALLY_PAID', 'CANCELED', 'RENEGOTIATED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('NEW', 'ASSIGNED', 'IN_ANALYSIS', 'CONTACTING', 'CUSTOMER_REPLIED', 'WAITING_PAYMENT', 'PROMISE_ACTIVE', 'NEGOTIATING', 'PROMISE_BROKEN', 'NO_CONTACT', 'PICKUP_CANDIDATE', 'PICKUP_PENDING_APPROVAL', 'PICKUP_OPENED', 'REGULARIZED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PromiseStatus" AS ENUM ('ACTIVE', 'FULFILLED', 'PARTIALLY_FULFILLED', 'BROKEN', 'CANCELED');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WHATSAPP', 'PHONE', 'EMAIL', 'SMS', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactOutcome" AS ENUM ('NO_ANSWER', 'ANSWERED', 'CUSTOMER_WILL_PAY', 'PAYMENT_ALREADY_MADE', 'REQUESTED_NEGOTIATION', 'TECHNICAL_PROBLEM', 'WANTS_CANCEL', 'MOVED_ADDRESS', 'DOES_NOT_RECOGNIZE', 'WRONG_CONTACT', 'OTHER');

-- CreateEnum
CREATE TYPE "PickupStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'OPENED_IN_GC', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionWallet" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "tradeName" TEXT,
    "documentMasked" TEXT,
    "city" TEXT,
    "district" TEXT,
    "addressMasked" TEXT,
    "sourceUpdatedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "checksum" TEXT,
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerContact" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "valueCipher" TEXT NOT NULL,
    "valueHash" TEXT,
    "maskedValue" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyFee" DECIMAL(14,2),
    "speedMbps" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "branchId" TEXT,
    "planId" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'UNKNOWN',
    "internetStatus" "InternetStatus" NOT NULL DEFAULT 'UNKNOWN',
    "trustUnlockEnabled" BOOLEAN,
    "trustUnlockActive" BOOLEAN,
    "lastTrustUnlockAt" TIMESTAMP(3),
    "trustUnlockRestriction" TEXT,
    "sourceUpdatedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "checksum" TEXT,
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessAccount" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "usernameMasked" TEXT,
    "online" BOOLEAN,
    "connectedSeconds" INTEGER,
    "lastConnectionStartAt" TIMESTAMP(3),
    "lastConnectionEndAt" TIMESTAMP(3),
    "currentDownloadBytes" BIGINT,
    "sourceUpdatedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractId" TEXT,
    "walletId" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "originalAmount" DECIMAL(14,2) NOT NULL,
    "openAmount" DECIMAL(14,2) NOT NULL,
    "paidAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "canceledAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "interestAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fineAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "paymentMethod" TEXT,
    "receiptType" TEXT,
    "sourceUpdatedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3),
    "checksum" TEXT,
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "method" TEXT,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceEvent" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" TEXT,
    "walletId" TEXT,
    "overdueDays" INTEGER NOT NULL DEFAULT 7,
    "minimumOpenAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "activeContractsOnly" BOOLEAN NOT NULL DEFAULT true,
    "suspendOnActivePromise" BOOLEAN NOT NULL DEFAULT true,
    "autoAssign" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipCase" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractId" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'NEW',
    "priorityScore" INTEGER NOT NULL DEFAULT 0,
    "assignedUserId" TEXT,
    "assignedTeamId" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstContactAt" TIMESTAMP(3),
    "regularizedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelationshipCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseInvoice" (
    "caseId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseInvoice_pkey" PRIMARY KEY ("caseId","invoiceId")
);

-- CreateTable
CREATE TABLE "ContactAttempt" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL,
    "outcome" "ContactOutcome" NOT NULL,
    "externalThreadId" TEXT,
    "summary" TEXT,
    "contactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPromise" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "promisedAt" TIMESTAMP(3) NOT NULL,
    "status" "PromiseStatus" NOT NULL DEFAULT 'ACTIVE',
    "fulfilledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentPromise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromiseInvoice" (
    "promiseId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(14,2),

    CONSTRAINT "PromiseInvoice_pkey" PRIMARY KEY ("promiseId","invoiceId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "profileVersion" INTEGER NOT NULL DEFAULT 1,
    "totalInvoices" INTEGER NOT NULL DEFAULT 0,
    "onTimePaymentRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "averageDelayDays" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "maximumDelayDays" INTEGER NOT NULL DEFAULT 0,
    "lifetimePaidAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currentOverdueAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currentOverdueCount" INTEGER NOT NULL DEFAULT 0,
    "fulfilledPromises" INTEGER NOT NULL DEFAULT 0,
    "brokenPromises" INTEGER NOT NULL DEFAULT 0,
    "relationshipMonths" INTEGER NOT NULL DEFAULT 0,
    "lastPaymentAt" TIMESTAMP(3),
    "currentScore" INTEGER NOT NULL DEFAULT 0,
    "scoreClassification" TEXT NOT NULL DEFAULT 'UNCLASSIFIED',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreSnapshot" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "classification" TEXT NOT NULL,
    "ruleVersion" TEXT NOT NULL,
    "profileVersion" INTEGER NOT NULL,
    "factors" JSONB NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInsight" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "invoiceExternalId" TEXT,
    "profileVersion" INTEGER NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "modelPolicyVersion" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "inputSummary" JSONB NOT NULL,
    "output" JSONB,
    "requestedById" TEXT NOT NULL,
    "model" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "estimatedCost" DECIMAL(12,6),
    "generatedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "invalidationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInsightFeedback" (
    "id" TEXT NOT NULL,
    "insightId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "useful" BOOLEAN NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInsightFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupAssessment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "offlineSince" TIMESTAMP(3),
    "contactAttempts" INTEGER NOT NULL,
    "hasActivePromise" BOOLEAN NOT NULL,
    "hasBlockingTechnicalOrder" BOOLEAN NOT NULL,
    "equipmentConfirmedAtAddress" BOOLEAN,
    "recommendation" TEXT NOT NULL,
    "rationale" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PickupAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupRequest" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "status" "PickupStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedById" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "gcExternalId" TEXT,
    "openedInGcAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "branchScope" TEXT,
    "walletScope" TEXT,
    "result" TEXT NOT NULL,
    "correlationId" TEXT,
    "ipMasked" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalEventId" TEXT NOT NULL,
    "signatureValid" BOOLEAN NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_ACTIVATION',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "passwordChangedAt" TIMESTAMP(3),
    "maxApprovalAmount" INTEGER,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "sessionId" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedById" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBranch" (
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBranch_pkey" PRIMARY KEY ("userId","branchId")
);

-- CreateTable
CREATE TABLE "UserWallet" (
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWallet_pkey" PRIMARY KEY ("userId","walletId")
);

-- CreateTable
CREATE TABLE "RoleConfig" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "bypassIpWhitelist" BOOLEAN NOT NULL DEFAULT false,
    "bypassTimeRestriction" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleIpWhitelist" (
    "id" TEXT NOT NULL,
    "roleConfigId" TEXT NOT NULL,
    "ipOrCidr" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleIpWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAccessSchedule" (
    "id" TEXT NOT NULL,
    "roleConfigId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "RoleAccessSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccessSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccessSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccessScheduleEntry" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "UserAccessScheduleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branch_externalId_key" ON "Branch"("externalId");

-- CreateIndex
CREATE INDEX "Branch_active_idx" ON "Branch"("active");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionWallet_externalId_key" ON "CollectionWallet"("externalId");

-- CreateIndex
CREATE INDEX "CollectionWallet_active_idx" ON "CollectionWallet"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_externalId_key" ON "Customer"("externalId");

-- CreateIndex
CREATE INDEX "Customer_legalName_idx" ON "Customer"("legalName");

-- CreateIndex
CREATE INDEX "Customer_syncStatus_idx" ON "Customer"("syncStatus");

-- CreateIndex
CREATE INDEX "CustomerContact_customerId_isPrimary_idx" ON "CustomerContact"("customerId", "isPrimary");

-- CreateIndex
CREATE INDEX "CustomerContact_valueHash_idx" ON "CustomerContact"("valueHash");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_externalId_key" ON "Plan"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_externalId_key" ON "Contract"("externalId");

-- CreateIndex
CREATE INDEX "Contract_customerId_status_idx" ON "Contract"("customerId", "status");

-- CreateIndex
CREATE INDEX "Contract_branchId_internetStatus_idx" ON "Contract"("branchId", "internetStatus");

-- CreateIndex
CREATE UNIQUE INDEX "AccessAccount_externalId_key" ON "AccessAccount"("externalId");

-- CreateIndex
CREATE INDEX "AccessAccount_contractId_online_idx" ON "AccessAccount"("contractId", "online");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_externalId_key" ON "Invoice"("externalId");

-- CreateIndex
CREATE INDEX "Invoice_status_dueAt_idx" ON "Invoice"("status", "dueAt");

-- CreateIndex
CREATE INDEX "Invoice_customerId_dueAt_idx" ON "Invoice"("customerId", "dueAt");

-- CreateIndex
CREATE INDEX "Invoice_contractId_status_idx" ON "Invoice"("contractId", "status");

-- CreateIndex
CREATE INDEX "Invoice_walletId_status_idx" ON "Invoice"("walletId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "Payment"("externalId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_paidAt_idx" ON "Payment"("invoiceId", "paidAt");

-- CreateIndex
CREATE INDEX "InvoiceEvent_invoiceId_occurredAt_idx" ON "InvoiceEvent"("invoiceId", "occurredAt");

-- CreateIndex
CREATE INDEX "CollectionRule_active_priority_idx" ON "CollectionRule"("active", "priority");

-- CreateIndex
CREATE INDEX "RelationshipCase_status_priorityScore_idx" ON "RelationshipCase"("status", "priorityScore");

-- CreateIndex
CREATE INDEX "RelationshipCase_assignedUserId_status_idx" ON "RelationshipCase"("assignedUserId", "status");

-- CreateIndex
CREATE INDEX "RelationshipCase_customerId_status_idx" ON "RelationshipCase"("customerId", "status");

-- CreateIndex
CREATE INDEX "RelationshipCase_contractId_status_idx" ON "RelationshipCase"("contractId", "status");

-- CreateIndex
CREATE INDEX "ContactAttempt_caseId_contactedAt_idx" ON "ContactAttempt"("caseId", "contactedAt");

-- CreateIndex
CREATE INDEX "ContactAttempt_actorUserId_contactedAt_idx" ON "ContactAttempt"("actorUserId", "contactedAt");

-- CreateIndex
CREATE INDEX "PaymentPromise_status_promisedAt_idx" ON "PaymentPromise"("status", "promisedAt");

-- CreateIndex
CREATE INDEX "PaymentPromise_caseId_status_idx" ON "PaymentPromise"("caseId", "status");

-- CreateIndex
CREATE INDEX "Task_assignedToId_dueAt_completedAt_idx" ON "Task"("assignedToId", "dueAt", "completedAt");

-- CreateIndex
CREATE INDEX "Task_caseId_dueAt_idx" ON "Task"("caseId", "dueAt");

-- CreateIndex
CREATE INDEX "Note_caseId_createdAt_idx" ON "Note"("caseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_customerId_key" ON "FinancialProfile"("customerId");

-- CreateIndex
CREATE INDEX "FinancialProfile_currentScore_idx" ON "FinancialProfile"("currentScore");

-- CreateIndex
CREATE INDEX "FinancialProfile_calculatedAt_idx" ON "FinancialProfile"("calculatedAt");

-- CreateIndex
CREATE INDEX "ScoreSnapshot_customerId_calculatedAt_idx" ON "ScoreSnapshot"("customerId", "calculatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiInsight_cacheKey_key" ON "AiInsight"("cacheKey");

-- CreateIndex
CREATE INDEX "AiInsight_caseId_invalidatedAt_idx" ON "AiInsight"("caseId", "invalidatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiInsightFeedback_insightId_userId_key" ON "AiInsightFeedback"("insightId", "userId");

-- CreateIndex
CREATE INDEX "PickupAssessment_caseId_createdAt_idx" ON "PickupAssessment"("caseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PickupRequest_assessmentId_key" ON "PickupRequest"("assessmentId");

-- CreateIndex
CREATE INDEX "PickupRequest_status_createdAt_idx" ON "PickupRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_resourceType_resourceId_occurredAt_idx" ON "AuditEvent"("resourceType", "resourceId", "occurredAt");

-- CreateIndex
CREATE INDEX "AuditEvent_actorUserId_occurredAt_idx" ON "AuditEvent"("actorUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "AuditEvent_correlationId_idx" ON "AuditEvent"("correlationId");

-- CreateIndex
CREATE INDEX "WebhookEvent_provider_status_receivedAt_idx" ON "WebhookEvent"("provider", "status", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_externalEventId_key" ON "WebhookEvent"("provider", "externalEventId");

-- CreateIndex
CREATE INDEX "OutboxEvent_publishedAt_occurredAt_idx" ON "OutboxEvent"("publishedAt", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "Team_active_idx" ON "Team"("active");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "User"("teamId");

-- CreateIndex
CREATE INDEX "Session_userId_revokedAt_idx" ON "Session"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_replacedById_key" ON "RefreshToken"("replacedById");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_revokedAt_idx" ON "RefreshToken"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RoleConfig_role_key" ON "RoleConfig"("role");

-- CreateIndex
CREATE INDEX "RoleIpWhitelist_roleConfigId_idx" ON "RoleIpWhitelist"("roleConfigId");

-- CreateIndex
CREATE INDEX "RoleAccessSchedule_roleConfigId_idx" ON "RoleAccessSchedule"("roleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAccessSchedule_roleConfigId_dayOfWeek_key" ON "RoleAccessSchedule"("roleConfigId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccessSchedule_userId_key" ON "UserAccessSchedule"("userId");

-- CreateIndex
CREATE INDEX "UserAccessScheduleEntry_scheduleId_idx" ON "UserAccessScheduleEntry"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccessScheduleEntry_scheduleId_dayOfWeek_key" ON "UserAccessScheduleEntry"("scheduleId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "CustomerContact" ADD CONSTRAINT "CustomerContact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessAccount" ADD CONSTRAINT "AccessAccount_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CollectionWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceEvent" ADD CONSTRAINT "InvoiceEvent_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRule" ADD CONSTRAINT "CollectionRule_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionRule" ADD CONSTRAINT "CollectionRule_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CollectionWallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipCase" ADD CONSTRAINT "RelationshipCase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipCase" ADD CONSTRAINT "RelationshipCase_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseInvoice" ADD CONSTRAINT "CaseInvoice_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseInvoice" ADD CONSTRAINT "CaseInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAttempt" ADD CONSTRAINT "ContactAttempt_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentPromise" ADD CONSTRAINT "PaymentPromise_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromiseInvoice" ADD CONSTRAINT "PromiseInvoice_promiseId_fkey" FOREIGN KEY ("promiseId") REFERENCES "PaymentPromise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromiseInvoice" ADD CONSTRAINT "PromiseInvoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreSnapshot" ADD CONSTRAINT "ScoreSnapshot_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInsight" ADD CONSTRAINT "AiInsight_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInsightFeedback" ADD CONSTRAINT "AiInsightFeedback_insightId_fkey" FOREIGN KEY ("insightId") REFERENCES "AiInsight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupAssessment" ADD CONSTRAINT "PickupAssessment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "RelationshipCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupRequest" ADD CONSTRAINT "PickupRequest_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "PickupAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranch" ADD CONSTRAINT "UserBranch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranch" ADD CONSTRAINT "UserBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWallet" ADD CONSTRAINT "UserWallet_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CollectionWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleIpWhitelist" ADD CONSTRAINT "RoleIpWhitelist_roleConfigId_fkey" FOREIGN KEY ("roleConfigId") REFERENCES "RoleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAccessSchedule" ADD CONSTRAINT "RoleAccessSchedule_roleConfigId_fkey" FOREIGN KEY ("roleConfigId") REFERENCES "RoleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessSchedule" ADD CONSTRAINT "UserAccessSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessScheduleEntry" ADD CONSTRAINT "UserAccessScheduleEntry_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "UserAccessSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

