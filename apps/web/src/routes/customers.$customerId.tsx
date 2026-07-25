import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/customers/$customerId')({
  component: CustomerDetailPage,
})

// Icons
const Icons = {
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
    </svg>
  ),
  wifiOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  trendUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
}

// Mock customer data
const mockCustomer = {
  id: 'c1',
  legalName: 'Maria Silva Santos',
  tradeName: 'Maria Modas',
  documentMasked: '***.***.***-01',
  documentType: 'CPF',
  city: 'São Paulo',
  state: 'SP',
  district: 'Centro',
  addressMasked: 'Rua *****, 123 - Apto **',
  contacts: [
    { id: 'ct1', type: 'PHONE', maskedValue: '(11) 9****-1234', isPrimary: true, verifiedAt: '2026-06-15' },
    { id: 'ct2', type: 'EMAIL', maskedValue: 'm***@email.com', isPrimary: false },
    { id: 'ct3', type: 'WHATSAPP', maskedValue: '(11) 9****-1234', isPrimary: false },
  ],
  contracts: [
    { id: 'cn1', externalId: '12345', status: 'ACTIVE', internetStatus: 'ACTIVE', plan: { name: '200 Mbps', monthlyFee: 9990 }, startedAt: '2024-01-15' },
    { id: 'cn2', externalId: '12346', status: 'ACTIVE', internetStatus: 'AUTO_BLOCKED', plan: { name: '100 Mbps', monthlyFee: 7990 }, startedAt: '2025-03-01' },
  ],
  financialProfile: {
    currentScore: 72,
    scoreClassification: 'BOM',
    totalInvoices: 24,
    onTimePaymentRate: 75,
    averageDelayDays: 5,
    currentOverdueAmount: 45000,
    currentOverdueCount: 2,
    lifetimePaidAmount: 239760,
    relationshipMonths: 18,
    fulfilledPromises: 3,
    brokenPromises: 1,
    lastPaymentAt: '2026-07-15',
  },
  invoices: [
    { id: 'i1', externalId: 'F2026-001', status: 'OPEN', dueAt: '2026-07-10', openAmount: 25000, daysOverdue: 15 },
    { id: 'i2', externalId: 'F2026-002', status: 'OPEN', dueAt: '2026-07-15', openAmount: 20000, daysOverdue: 10 },
    { id: 'i3', externalId: 'F2026-003', status: 'PAID', dueAt: '2026-06-10', openAmount: 0, paidAt: '2026-06-08' },
    { id: 'i4', externalId: 'F2026-004', status: 'PAID', dueAt: '2026-05-10', openAmount: 0, paidAt: '2026-05-15' },
  ],
  cases: [
    { id: 'case1', status: 'CONTACTING', openedAt: '2026-07-20', overdueAmount: 45000 },
  ],
  scoreHistory: [
    { date: '2026-07', score: 72 },
    { date: '2026-06', score: 78 },
    { date: '2026-05', score: 75 },
    { date: '2026-04', score: 82 },
    { date: '2026-03', score: 85 },
  ],
}

async function fetchCustomer(_id: string) {
  return mockCustomer
}

type TabType = 'overview' | 'invoices' | 'contracts' | 'cases' | 'timeline'

function CustomerDetailPage() {
  const { customerId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const customerQuery = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomer(customerId),
  })

  const customer = customerQuery.data

  if (customerQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="empty-state py-24">
        <div className="empty-state-title">Cliente não encontrado</div>
      </div>
    )
  }

  const fp = customer.financialProfile

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Link to="/customers" className="btn-ghost btn-icon mt-1">
          {Icons.back}
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="avatar-lg bg-gradient-to-br from-accent to-accent-600 text-surface text-xl font-display">
                {customer.legalName.charAt(0)}
              </div>
              <div>
                <h1 className="font-display text-display-sm text-text-primary">
                  {customer.legalName}
                </h1>
                {customer.tradeName && (
                  <p className="text-text-secondary">{customer.tradeName}</p>
                )}
                <p className="text-text-muted text-sm mt-1">
                  {customer.documentMasked} • {customer.city}/{customer.state} - {customer.district}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="btn-ghost gap-2">
                {Icons.phone}
                Ligar
              </button>
              <button className="btn-ghost gap-2">
                {Icons.whatsapp}
                WhatsApp
              </button>
              <button className="btn-primary gap-2">
                {Icons.sparkles}
                Abrir Caso
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score and Financial Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Score Card - Highlighted */}
        <div className="card p-4 col-span-2 bg-gradient-to-br from-surface-800 to-surface-700 border-accent/30">
          <div className="flex items-center gap-4">
            <ScoreRing score={fp.currentScore} classification={fp.scoreClassification} />
            <div className="flex-1">
              <div className="text-sm text-text-muted">WLinks Score</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-display text-2xl font-bold text-text-primary">{fp.currentScore}</span>
                <span className={`badge ${getScoreClassBadge(fp.scoreClassification)}`}>
                  {fp.scoreClassification}
                </span>
              </div>
              <ScoreTrend history={customer.scoreHistory} />
            </div>
          </div>
        </div>

        {/* Overdue Amount */}
        <div className="stat-card">
          <div className="text-sm text-text-muted">Em Atraso</div>
          <div className={`stat-value ${fp.currentOverdueAmount > 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(fp.currentOverdueAmount)}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {fp.currentOverdueCount} {fp.currentOverdueCount === 1 ? 'fatura' : 'faturas'}
          </div>
        </div>

        {/* Payment Rate */}
        <div className="stat-card">
          <div className="text-sm text-text-muted">Pgto em Dia</div>
          <div className="stat-value text-text-primary">{fp.onTimePaymentRate}%</div>
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-success"
              style={{ width: `${fp.onTimePaymentRate}%` }}
            />
          </div>
        </div>

        {/* Relationship */}
        <div className="stat-card">
          <div className="text-sm text-text-muted">Cliente há</div>
          <div className="stat-value text-text-primary">{fp.relationshipMonths} meses</div>
          <div className="text-xs text-text-muted mt-1">
            Desde {formatMonthsAgo(fp.relationshipMonths)}
          </div>
        </div>

        {/* Promises */}
        <div className="stat-card">
          <div className="text-sm text-text-muted">Promessas</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-1 text-success">
              {Icons.check}
              <span className="font-display font-bold">{fp.fulfilledPromises}</span>
            </span>
            <span className="text-text-muted">/</span>
            <span className="flex items-center gap-1 text-danger">
              {Icons.x}
              <span className="font-display font-bold">{fp.brokenPromises}</span>
            </span>
          </div>
          <div className="text-xs text-text-muted mt-1">
            {Math.round((fp.fulfilledPromises / (fp.fulfilledPromises + fp.brokenPromises)) * 100)}% cumpridas
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-700">
        <nav className="flex gap-1">
          {(['overview', 'invoices', 'contracts', 'cases', 'timeline'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'tab-active' : 'tab'}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'invoices' && `Faturas (${customer.invoices.length})`}
              {tab === 'contracts' && `Contratos (${customer.contracts.length})`}
              {tab === 'cases' && `Casos (${customer.cases.length})`}
              {tab === 'timeline' && 'Timeline'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && <OverviewTab customer={customer} />}
        {activeTab === 'invoices' && <InvoicesTab invoices={customer.invoices} />}
        {activeTab === 'contracts' && <ContractsTab contracts={customer.contracts} />}
        {activeTab === 'cases' && <CasesTab cases={customer.cases} />}
        {activeTab === 'timeline' && <TimelineTab />}
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab({ customer }: { customer: typeof mockCustomer }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Contacts */}
      <div className="card p-4">
        <h3 className="font-display font-semibold text-text-primary mb-4">Contatos</h3>
        <div className="space-y-3">
          {customer.contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-3 bg-surface-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`${contact.type === 'PHONE' ? 'text-accent' : contact.type === 'WHATSAPP' ? 'text-success' : 'text-warning'}`}>
                  {contact.type === 'PHONE' && Icons.phone}
                  {contact.type === 'WHATSAPP' && Icons.whatsapp}
                  {contact.type === 'EMAIL' && Icons.email}
                </span>
                <div>
                  <div className="text-sm text-text-primary">{contact.maskedValue}</div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    {contact.isPrimary && <span className="badge-accent">Principal</span>}
                    {contact.verifiedAt && <span>Verificado</span>}
                  </div>
                </div>
              </div>
              <button className="btn-ghost btn-icon" title="Revelar">
                {Icons.eye}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Open Invoices */}
      <div className="card p-4">
        <h3 className="font-display font-semibold text-text-primary mb-4">Faturas em Aberto</h3>
        <div className="space-y-3">
          {customer.invoices.filter(i => i.status === 'OPEN').map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 bg-surface-700/50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-text-primary">{invoice.externalId}</div>
                <div className="text-xs text-danger">
                  {invoice.daysOverdue} dias em atraso
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-medium text-danger">
                  {formatCurrency(invoice.openAmount)}
                </div>
                <button className="text-xs text-accent hover:underline flex items-center gap-1">
                  {Icons.send}
                  2ª via
                </button>
              </div>
            </div>
          ))}
          {customer.invoices.filter(i => i.status === 'OPEN').length === 0 && (
            <div className="text-center py-4 text-text-muted text-sm">
              Nenhuma fatura em aberto
            </div>
          )}
        </div>
      </div>

      {/* Active Contracts */}
      <div className="card p-4">
        <h3 className="font-display font-semibold text-text-primary mb-4">Contratos Ativos</h3>
        <div className="space-y-3">
          {customer.contracts.map((contract) => (
            <div key={contract.id} className="p-3 bg-surface-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-text-primary">#{contract.externalId}</div>
                <ConnectionStatus status={contract.internetStatus} />
              </div>
              <div className="text-sm text-text-secondary">{contract.plan.name}</div>
              <div className="text-xs text-text-muted mt-1">
                {formatCurrency(contract.plan.monthlyFee)}/mês
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Invoices Tab
function InvoicesTab({ invoices }: { invoices: typeof mockCustomer.invoices }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Fatura</th>
            <th>Vencimento</th>
            <th>Status</th>
            <th className="text-right">Valor</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="font-mono text-text-primary">{invoice.externalId}</td>
              <td className="text-text-secondary">{formatDate(invoice.dueAt)}</td>
              <td>
                <InvoiceStatusBadge status={invoice.status} daysOverdue={invoice.daysOverdue} />
              </td>
              <td className="text-right">
                <span className={`font-mono ${invoice.status === 'OPEN' ? 'text-danger' : 'text-text-muted'}`}>
                  {formatCurrency(invoice.openAmount)}
                </span>
              </td>
              <td className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <button className="btn-ghost btn-icon" title="Ver detalhes">
                    {Icons.eye}
                  </button>
                  {invoice.status === 'OPEN' && (
                    <button className="btn-ghost btn-icon text-accent" title="Enviar 2ª via">
                      {Icons.send}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Contracts Tab
function ContractsTab({ contracts }: { contracts: typeof mockCustomer.contracts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contracts.map((contract) => (
        <div key={contract.id} className="card p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-display font-semibold text-text-primary">
                Contrato #{contract.externalId}
              </div>
              <div className="text-sm text-text-muted">
                Desde {formatDate(contract.startedAt)}
              </div>
            </div>
            <ConnectionStatus status={contract.internetStatus} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Plano</span>
              <span className="text-text-primary font-medium">{contract.plan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Mensalidade</span>
              <span className="text-text-primary font-mono">{formatCurrency(contract.plan.monthlyFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Status</span>
              <span className={`badge ${contract.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                {contract.status === 'ACTIVE' ? 'Ativo' : contract.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Cases Tab
function CasesTab({ cases }: { cases: typeof mockCustomer.cases }) {
  if (cases.length === 0) {
    return (
      <div className="empty-state py-12">
        <div className="empty-state-title">Nenhum caso</div>
        <div className="empty-state-description">Este cliente não possui casos de relacionamento</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem) => (
        <Link
          key={caseItem.id}
          to="/cases/$caseId"
          params={{ caseId: caseItem.id }}
          className="card-interactive p-4 flex items-center justify-between"
        >
          <div>
            <div className="font-medium text-text-primary">Caso #{caseItem.id}</div>
            <div className="text-sm text-text-muted">Aberto em {formatDate(caseItem.openedAt)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-danger">{formatCurrency(caseItem.overdueAmount)}</div>
              <div className="text-xs text-text-muted">em atraso</div>
            </div>
            <span className="badge status-contacting">{caseItem.status}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

// Timeline Tab
function TimelineTab() {
  const events = [
    { date: '2026-07-25 10:30', type: 'contact', title: 'Contato via WhatsApp', description: 'Cliente solicitou prazo para pagamento' },
    { date: '2026-07-24 14:00', type: 'contact', title: 'Tentativa de contato', description: 'Telefone não atendeu' },
    { date: '2026-07-20 09:00', type: 'case', title: 'Caso aberto', description: 'Cliente entrou na fila de relacionamento' },
    { date: '2026-07-15 08:00', type: 'payment', title: 'Pagamento recebido', description: 'Fatura F2026-003 - R$ 99,90' },
    { date: '2026-07-10 00:00', type: 'invoice', title: 'Fatura vencida', description: 'F2026-001 entrou em atraso' },
  ]

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-700" />
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              event.type === 'payment' ? 'bg-success/20 text-success' :
              event.type === 'contact' ? 'bg-accent/20 text-accent' :
              event.type === 'case' ? 'bg-warning/20 text-warning' :
              'bg-surface-700 text-text-muted'
            }`}>
              {event.type === 'payment' && Icons.check}
              {event.type === 'contact' && Icons.phone}
              {event.type === 'case' && Icons.file}
              {event.type === 'invoice' && Icons.clock}
            </div>
            <div className="flex-1 pb-6">
              <div className="text-xs text-text-muted mb-1">{event.date}</div>
              <div className="font-medium text-text-primary">{event.title}</div>
              <div className="text-sm text-text-secondary">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper Components
function ScoreRing({ score, classification: _classification }: { score: number; classification: string }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  let strokeColor = 'stroke-score-critical'
  if (score >= 80) strokeColor = 'stroke-score-excellent'
  else if (score >= 60) strokeColor = 'stroke-score-good'
  else if (score >= 40) strokeColor = 'stroke-score-regular'
  else if (score >= 20) strokeColor = 'stroke-score-risk'

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-surface-200"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={strokeColor}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-xl font-bold text-text-primary">{score}</span>
      </div>
    </div>
  )
}

function ScoreTrend({ history }: { history: { date: string; score: number }[] }) {
  if (history.length < 2) return null
  const current = history[0].score
  const previous = history[1].score
  const diff = current - previous

  if (diff === 0) return null

  return (
    <div className={`flex items-center gap-1 text-xs ${diff > 0 ? 'text-success' : 'text-danger'}`}>
      {diff > 0 ? Icons.trendUp : Icons.trendDown}
      {diff > 0 ? '+' : ''}{diff} vs mês anterior
    </div>
  )
}

function ConnectionStatus({ status }: { status: string }) {
  const isOnline = status === 'ACTIVE'
  const isBlocked = status.includes('BLOCKED')

  return (
    <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
      isBlocked ? 'bg-danger/20 text-danger' : isOnline ? 'bg-success/20 text-success' : 'bg-surface-700 text-text-muted'
    }`}>
      {isBlocked ? Icons.wifiOff : Icons.wifi}
      {isBlocked ? 'Bloqueado' : isOnline ? 'Online' : 'Offline'}
    </span>
  )
}

function InvoiceStatusBadge({ status, daysOverdue }: { status: string; daysOverdue?: number }) {
  if (status === 'PAID') {
    return <span className="badge badge-success">Pago</span>
  }
  if (status === 'OPEN' && daysOverdue && daysOverdue > 0) {
    return <span className="badge badge-danger">{daysOverdue}d atraso</span>
  }
  if (status === 'OPEN') {
    return <span className="badge badge-warning">Em aberto</span>
  }
  return <span className="badge badge-neutral">{status}</span>
}

function getScoreClassBadge(classification: string): string {
  const map: Record<string, string> = {
    EXCELENTE: 'bg-score-excellent/20 text-score-excellent',
    BOM: 'bg-score-good/20 text-score-good',
    REGULAR: 'bg-score-regular/20 text-score-regular',
    RISCO: 'bg-score-risk/20 text-score-risk',
    CRITICO: 'bg-score-critical/20 text-score-critical',
  }
  return map[classification] ?? 'badge-neutral'
}

// Utility functions
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatMonthsAgo(months: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}
