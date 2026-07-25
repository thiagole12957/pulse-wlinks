import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/cases/$caseId')({
  component: CaseDetailPage,
})

// SVG Icons
const Icons = {
  arrowLeft: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  handshake: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
    </svg>
  ),
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4"/>
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  thumbsUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
    </svg>
  ),
  thumbsDown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  wifi: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
    </svg>
  ),
  wifiOff: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 13a10 10 0 0 1 5.24-2.76M12 20h.01"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  fileText: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  alertCircle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

// Mock data
const mockCase = {
  id: '1',
  status: 'CONTACTING',
  priorityScore: 72,
  openedAt: '2026-07-18T14:00:00Z',
  lastActivityAt: '2026-07-25T10:00:00Z',
  customer: {
    id: 'c1',
    legalName: 'Maria Silva Santos',
    documentMasked: '***.***.***-01',
    city: 'São Paulo',
    state: 'SP',
  },
  contract: {
    externalId: '12345',
    status: 'ACTIVE',
    internetStatus: 'AUTO_BLOCKED',
    plan: { name: '200 Mbps' },
  },
  invoices: [
    { id: 'i1', externalId: 'F001', status: 'OPEN', dueAt: '2026-07-10', openAmount: 25000, daysOverdue: 15 },
    { id: 'i2', externalId: 'F002', status: 'OPEN', dueAt: '2026-07-15', openAmount: 20000, daysOverdue: 10 },
  ],
  contacts: [
    { id: 'ct1', channel: 'WHATSAPP', outcome: 'ANSWERED', contactedAt: '2026-07-24T16:00:00Z', summary: 'Cliente solicitou prazo até fim do mês', agent: 'Maria S.' },
    { id: 'ct2', channel: 'PHONE', outcome: 'NO_ANSWER', contactedAt: '2026-07-23T14:00:00Z', summary: null, agent: 'João P.' },
    { id: 'ct3', channel: 'PHONE', outcome: 'NO_ANSWER', contactedAt: '2026-07-22T10:00:00Z', summary: null, agent: 'Maria S.' },
  ],
  promises: [
    { id: 'p1', amount: 45000, promisedAt: '2026-07-30', status: 'ACTIVE', createdAt: '2026-07-24T16:30:00Z' },
  ],
  aiInsight: {
    recommendation: 'Cliente com bom histórico de pagamento nos últimos 18 meses. A situação atual parece pontual, possivelmente relacionada a problema temporário de fluxo de caixa. Recomendo manter o diálogo e oferecer parcelamento flexível.',
    suggestedActions: ['Confirmar promessa de pagamento', 'Enviar 2ª via com PIX', 'Agendar lembrete 2 dias antes'],
    priority: 'MEDIUM',
    riskAssessment: 'BAIXO RISCO: Score histórico bom (72), relacionamento de 18 meses, primeira inadimplência significativa.',
    generatedAt: '2026-07-25T09:00:00Z',
  },
}

async function fetchCase(_id: string) {
  return mockCase
}

function CaseDetailPage() {
  const { caseId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'promises' | 'ai'>('overview')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showPromiseModal, setShowPromiseModal] = useState(false)

  const caseQuery = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => fetchCase(caseId),
  })

  const caseData = caseQuery.data

  if (caseQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-surface-400 text-sm">Carregando caso...</span>
        </div>
      </div>
    )
  }

  if (!caseData) return null

  const totalOverdue = caseData.invoices.reduce((sum, i) => sum + i.openAmount, 0)
  const activePromise = caseData.promises.find(p => p.status === 'ACTIVE')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            to="/"
            className="mt-1 p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-700 transition-colors"
          >
            {Icons.arrowLeft}
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-surface-100">
                {caseData.customer.legalName}
              </h1>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="text-surface-400 mt-1">
              {caseData.customer.documentMasked} • {caseData.customer.city}, {caseData.customer.state}
            </p>
            <p className="text-sm text-surface-500 mt-1 flex items-center gap-1">
              {Icons.calendar}
              <span>Caso aberto em {formatDate(caseData.openedAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            {Icons.phone}
            <span>Registrar Contato</span>
          </button>
          <button
            onClick={() => setShowPromiseModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            {Icons.handshake}
            <span>Nova Promessa</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            {Icons.sparkles}
            <span>Insight IA</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-surface-400 mb-1">Valor em Atraso</div>
          <div className="text-2xl font-display font-bold text-score-critical">
            {formatCurrency(totalOverdue)}
          </div>
          <div className="text-sm text-surface-500 mt-1">
            {caseData.invoices.length} {caseData.invoices.length === 1 ? 'fatura' : 'faturas'}
          </div>
        </div>

        <div className="card p-4">
          <div className="text-sm text-surface-400 mb-1">Score</div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={caseData.priorityScore} size="lg" />
            <div>
              <div className="text-sm text-surface-400">
                {getScoreClassification(caseData.priorityScore)}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="text-sm text-surface-400 mb-1">Contatos</div>
          <div className="text-2xl font-display font-bold text-surface-100">
            {caseData.contacts.length}
          </div>
          <div className="text-sm text-surface-500 mt-1">
            {caseData.contacts.filter(c => c.outcome === 'ANSWERED').length} respondidos
          </div>
        </div>

        <div className="card p-4">
          <div className="text-sm text-surface-400 mb-1">Promessa Ativa</div>
          {activePromise ? (
            <>
              <div className="text-2xl font-display font-bold text-score-good">
                {formatCurrency(activePromise.amount)}
              </div>
              <div className="text-sm text-surface-500 mt-1">
                para {formatDate(activePromise.promisedAt)}
              </div>
            </>
          ) : (
            <div className="text-lg text-surface-500 mt-1">Nenhuma</div>
          )}
        </div>
      </div>

      {/* AI Insight banner */}
      {caseData.aiInsight && (
        <div className="ai-insight-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
              {Icons.sparkles}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-surface-100">Insight IA</h3>
                <span className={`badge ${
                  caseData.aiInsight.priority === 'HIGH' ? 'badge-danger' :
                  caseData.aiInsight.priority === 'MEDIUM' ? 'badge-warning' :
                  'badge-success'
                }`}>
                  {caseData.aiInsight.priority === 'HIGH' ? 'Alta Prioridade' :
                   caseData.aiInsight.priority === 'MEDIUM' ? 'Média' : 'Baixa'}
                </span>
              </div>
              <p className="text-surface-300 text-sm leading-relaxed">
                {caseData.aiInsight.recommendation}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {caseData.aiInsight.suggestedActions.map((action, i) => (
                  <button
                    key={i}
                    className="px-3 py-1.5 bg-surface-700/50 hover:bg-surface-600/50 rounded-lg text-sm text-surface-200 border border-surface-600 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-surface-700">
        <nav className="flex gap-1">
          {(['overview', 'contacts', 'promises', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === tab
                  ? 'text-accent'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'contacts' && `Contatos (${caseData.contacts.length})`}
              {tab === 'promises' && `Promessas (${caseData.promises.length})`}
              {tab === 'ai' && 'IA'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <OverviewTab caseData={caseData} />
        )}

        {activeTab === 'contacts' && (
          <ContactsTab contacts={caseData.contacts} />
        )}

        {activeTab === 'promises' && (
          <PromisesTab promises={caseData.promises} />
        )}

        {activeTab === 'ai' && caseData.aiInsight && (
          <AITab insight={caseData.aiInsight} />
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <Modal title="Registrar Contato" onClose={() => setShowContactModal(false)}>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Canal</label>
              <select className="select w-full">
                <option value="PHONE">Telefone</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">E-mail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Resultado</label>
              <select className="select w-full">
                <option value="NO_ANSWER">Não atendeu</option>
                <option value="ANSWERED">Atendeu</option>
                <option value="CUSTOMER_WILL_PAY">Vai pagar</option>
                <option value="REQUESTED_NEGOTIATION">Quer negociar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Resumo</label>
              <textarea
                className="input w-full min-h-[100px] resize-none"
                placeholder="Descreva o contato..."
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Contato
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Promise Modal */}
      {showPromiseModal && (
        <Modal title="Nova Promessa de Pagamento" onClose={() => setShowPromiseModal(false)}>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">R$</span>
                <input
                  type="number"
                  className="input w-full pl-10"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Data Prometida</label>
              <input type="date" className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Observações</label>
              <textarea
                className="input w-full min-h-[80px] resize-none"
                placeholder="Observações adicionais..."
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={() => setShowPromiseModal(false)}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Registrar Promessa
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// Tab Components
function OverviewTab({ caseData }: { caseData: typeof mockCase }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Invoices */}
      <div className="card p-5">
        <h3 className="font-semibold text-surface-100 mb-4 flex items-center gap-2">
          {Icons.fileText}
          <span>Faturas em Atraso</span>
        </h3>
        <div className="space-y-3">
          {caseData.invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-surface-800/50 rounded-lg border border-surface-700">
              <div>
                <div className="font-medium text-surface-200">Fatura {invoice.externalId}</div>
                <div className="text-sm text-score-critical flex items-center gap-1 mt-1">
                  {Icons.alertCircle}
                  <span>{invoice.daysOverdue} dias em atraso</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-surface-100">{formatCurrency(invoice.openAmount)}</div>
                <button className="text-sm text-accent hover:text-accent-400 flex items-center gap-1 mt-1">
                  {Icons.send}
                  <span>Enviar 2ª via</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract */}
      <div className="card p-5">
        <h3 className="font-semibold text-surface-100 mb-4">Contrato</h3>
        <div className="p-4 bg-surface-800/50 rounded-lg border border-surface-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-surface-200">#{caseData.contract.externalId}</div>
              <div className="text-sm text-surface-400 mt-1">{caseData.contract.plan.name}</div>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-2 text-sm font-medium ${
                caseData.contract.internetStatus === 'ACTIVE' ? 'text-score-good' : 'text-score-critical'
              }`}>
                {caseData.contract.internetStatus === 'ACTIVE' ? Icons.wifi : Icons.wifiOff}
                <span>
                  {caseData.contract.internetStatus === 'ACTIVE' ? 'Online' : 'Bloqueado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent contacts */}
      <div className="card p-5 lg:col-span-2">
        <h3 className="font-semibold text-surface-100 mb-4">Últimos Contatos</h3>
        <div className="space-y-3">
          {caseData.contacts.slice(0, 3).map((contact) => (
            <div key={contact.id} className="flex items-start gap-4 p-4 bg-surface-800/50 rounded-lg border border-surface-700">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                contact.channel === 'WHATSAPP' ? 'bg-green-500/20 text-green-400' :
                contact.channel === 'PHONE' ? 'bg-accent/20 text-accent' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {contact.channel === 'WHATSAPP' && Icons.whatsapp}
                {contact.channel === 'PHONE' && Icons.phone}
                {contact.channel === 'EMAIL' && Icons.mail}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-surface-200">
                    {contact.channel === 'WHATSAPP' ? 'WhatsApp' :
                     contact.channel === 'PHONE' ? 'Telefone' : 'E-mail'}
                  </span>
                  <OutcomeBadge outcome={contact.outcome} />
                </div>
                <div className="text-sm text-surface-500 mt-1 flex items-center gap-1">
                  {Icons.clock}
                  <span>{formatDateTime(contact.contactedAt)}</span>
                  <span className="mx-2">•</span>
                  <span>{contact.agent}</span>
                </div>
                {contact.summary && (
                  <div className="text-sm text-surface-300 mt-2 p-2 bg-surface-700/30 rounded">
                    {contact.summary}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContactsTab({ contacts }: { contacts: typeof mockCase.contacts }) {
  return (
    <div className="card p-5">
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-start gap-4 p-4 border border-surface-700 rounded-lg">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              contact.channel === 'WHATSAPP' ? 'bg-green-500/20 text-green-400' :
              contact.channel === 'PHONE' ? 'bg-accent/20 text-accent' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {contact.channel === 'WHATSAPP' && Icons.whatsapp}
              {contact.channel === 'PHONE' && Icons.phone}
              {contact.channel === 'EMAIL' && Icons.mail}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-medium text-surface-200">
                  {contact.channel === 'WHATSAPP' ? 'WhatsApp' :
                   contact.channel === 'PHONE' ? 'Telefone' : 'E-mail'}
                </span>
                <OutcomeBadge outcome={contact.outcome} />
              </div>
              <div className="text-sm text-surface-500 mt-1">
                {formatDateTime(contact.contactedAt)} • {contact.agent}
              </div>
              {contact.summary && (
                <div className="text-surface-300 mt-3 p-3 bg-surface-800/50 rounded-lg border border-surface-700">
                  {contact.summary}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PromisesTab({ promises }: { promises: typeof mockCase.promises }) {
  return (
    <div className="card p-5">
      <div className="space-y-4">
        {promises.map((promise) => (
          <div key={promise.id} className="p-5 border border-surface-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-display font-bold text-surface-100">
                    {formatCurrency(promise.amount)}
                  </span>
                  <PromiseStatusBadge status={promise.status} />
                </div>
                <div className="text-sm text-surface-400 mt-2 flex items-center gap-1">
                  {Icons.calendar}
                  <span>Prometido para {formatDate(promise.promisedAt)}</span>
                </div>
                <div className="text-sm text-surface-500 mt-1">
                  Registrado em {formatDateTime(promise.createdAt)}
                </div>
              </div>
              {promise.status === 'ACTIVE' && (
                <div className="flex gap-2">
                  <button className="btn-primary flex items-center gap-2 text-sm py-2">
                    {Icons.check}
                    <span>Cumprida</span>
                  </button>
                  <button className="px-4 py-2 border border-score-critical/50 text-score-critical rounded-lg text-sm hover:bg-score-critical/10 transition-colors flex items-center gap-2">
                    {Icons.x}
                    <span>Quebrada</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {promises.length === 0 && (
          <div className="text-center py-12 text-surface-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-800 flex items-center justify-center">
              {Icons.handshake}
            </div>
            <p>Nenhuma promessa registrada</p>
          </div>
        )}
      </div>
    </div>
  )
}

function AITab({ insight }: { insight: typeof mockCase.aiInsight }) {
  return (
    <div className="card p-6">
      <div className="space-y-8">
        <div>
          <h3 className="font-semibold text-surface-100 mb-3 flex items-center gap-2">
            {Icons.sparkles}
            <span>Recomendação</span>
          </h3>
          <p className="text-surface-300 leading-relaxed">{insight.recommendation}</p>
        </div>

        <div>
          <h3 className="font-semibold text-surface-100 mb-3">Avaliação de Risco</h3>
          <div className="p-4 bg-surface-800/50 rounded-lg border border-surface-700">
            <p className="text-surface-300">{insight.riskAssessment}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-surface-100 mb-3">Ações Sugeridas</h3>
          <ul className="space-y-2">
            {insight.suggestedActions.map((action, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg border border-surface-700 text-surface-300">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-surface-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-surface-400">Este insight foi útil?</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-score-good/50 text-score-good rounded-lg text-sm hover:bg-score-good/10 transition-colors flex items-center gap-2">
                  {Icons.thumbsUp}
                  <span>Sim</span>
                </button>
                <button className="px-4 py-2 border border-score-critical/50 text-score-critical rounded-lg text-sm hover:bg-score-critical/10 transition-colors flex items-center gap-2">
                  {Icons.thumbsDown}
                  <span>Não</span>
                </button>
              </div>
            </div>
            <span className="text-sm text-surface-500">
              Gerado em {formatDateTime(insight.generatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface-800 rounded-xl p-6 w-full max-w-md border border-surface-700 shadow-elevated animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-surface-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-200 transition-colors"
          >
            {Icons.x}
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    NEW: { label: 'Novo', className: 'status-new' },
    CONTACTING: { label: 'Contatando', className: 'status-contacting' },
    PROMISE_ACTIVE: { label: 'Promessa', className: 'status-promise' },
    NEGOTIATING: { label: 'Negociando', className: 'status-negotiating' },
    NO_CONTACT: { label: 'Sem Contato', className: 'status-no-contact' },
    REGULARIZED: { label: 'Regularizado', className: 'status-regularized' },
    PICKUP: { label: 'Recolhimento', className: 'status-pickup' },
  }
  const c = config[status] ?? { label: status, className: 'badge-muted' }
  return <span className={`badge ${c.className}`}>{c.label}</span>
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const config: Record<string, { label: string; className: string }> = {
    ANSWERED: { label: 'Atendeu', className: 'badge-success' },
    NO_ANSWER: { label: 'Não atendeu', className: 'badge-muted' },
    CUSTOMER_WILL_PAY: { label: 'Vai pagar', className: 'badge-success' },
    REQUESTED_NEGOTIATION: { label: 'Quer negociar', className: 'badge-info' },
  }
  const c = config[outcome] ?? { label: outcome, className: 'badge-muted' }
  return <span className={`badge ${c.className}`}>{c.label}</span>
}

function PromiseStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'Ativa', className: 'badge-success' },
    FULFILLED: { label: 'Cumprida', className: 'badge-success' },
    BROKEN: { label: 'Quebrada', className: 'badge-danger' },
  }
  const c = config[status] ?? { label: status, className: 'badge-muted' }
  return <span className={`badge ${c.className}`}>{c.label}</span>
}

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const colorClass =
    score >= 80 ? 'score-excellent' :
    score >= 60 ? 'score-good' :
    score >= 40 ? 'score-regular' :
    score >= 20 ? 'score-risk' : 'score-critical'

  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size]

  return (
    <div className={`${sizeClass} ${colorClass} rounded-lg flex items-center justify-center font-bold`}>
      {score}
    </div>
  )
}

function getScoreClassification(score: number): string {
  if (score >= 80) return 'Excelente'
  if (score >= 60) return 'Bom'
  if (score >= 40) return 'Regular'
  if (score >= 20) return 'Risco'
  return 'Crítico'
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
