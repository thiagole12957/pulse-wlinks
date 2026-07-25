import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/')({
  component: QueuePage,
})

// Types
type ViewMode = 'list' | 'kanban'
type CaseStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTING'
  | 'CUSTOMER_REPLIED'
  | 'PROMISE_ACTIVE'
  | 'NEGOTIATING'
  | 'PROMISE_BROKEN'
  | 'NO_CONTACT'
  | 'PICKUP_CANDIDATE'
  | 'REGULARIZED'
  | 'CLOSED'

interface Case {
  id: string
  customer: {
    id: string
    legalName: string
    documentMasked: string
  }
  contract: {
    externalId: string
    internetStatus: string
    plan: { name: string }
  }
  status: CaseStatus
  priorityScore: number
  openedAt: string
  lastActivityAt: string
  overdueAmount: number
  overdueCount: number
  assignedUser?: { name: string; initials: string }
  hasActivePromise?: boolean
  contactAttempts?: number
}

// Status configuration
const statusConfig: Record<CaseStatus, { label: string; color: string; kanbanOrder: number }> = {
  NEW: { label: 'Novo', color: 'status-new', kanbanOrder: 1 },
  ASSIGNED: { label: 'Atribuído', color: 'badge-neutral', kanbanOrder: 2 },
  CONTACTING: { label: 'Contatando', color: 'status-contacting', kanbanOrder: 3 },
  CUSTOMER_REPLIED: { label: 'Respondeu', color: 'badge-accent', kanbanOrder: 4 },
  PROMISE_ACTIVE: { label: 'Promessa', color: 'status-promise', kanbanOrder: 5 },
  NEGOTIATING: { label: 'Negociando', color: 'status-negotiating', kanbanOrder: 6 },
  PROMISE_BROKEN: { label: 'Prom. Quebrada', color: 'badge-warning', kanbanOrder: 7 },
  NO_CONTACT: { label: 'Sem Contato', color: 'status-no-contact', kanbanOrder: 8 },
  PICKUP_CANDIDATE: { label: 'Recolhimento', color: 'status-pickup', kanbanOrder: 9 },
  REGULARIZED: { label: 'Regularizado', color: 'badge-success', kanbanOrder: 10 },
  CLOSED: { label: 'Fechado', color: 'status-closed', kanbanOrder: 11 },
}

// Kanban columns
const kanbanColumns: { status: CaseStatus; label: string }[] = [
  { status: 'NEW', label: 'Novos' },
  { status: 'CONTACTING', label: 'Contatando' },
  { status: 'PROMISE_ACTIVE', label: 'Promessa' },
  { status: 'NO_CONTACT', label: 'Sem Contato' },
  { status: 'PICKUP_CANDIDATE', label: 'Recolhimento' },
]

// Mock data
const mockCases: Case[] = [
  {
    id: '1',
    customer: { id: 'c1', legalName: 'Maria Silva Santos', documentMasked: '***.***.***-01' },
    contract: { externalId: '12345', internetStatus: 'AUTO_BLOCKED', plan: { name: '200 Mbps' } },
    status: 'NEW',
    priorityScore: 85,
    openedAt: '2026-07-20T10:00:00Z',
    lastActivityAt: '2026-07-25T08:30:00Z',
    overdueAmount: 45000,
    overdueCount: 2,
    contactAttempts: 0,
  },
  {
    id: '2',
    customer: { id: 'c2', legalName: 'João Pedro Oliveira', documentMasked: '***.***.***-15' },
    contract: { externalId: '12346', internetStatus: 'AUTO_BLOCKED', plan: { name: '100 Mbps' } },
    status: 'CONTACTING',
    priorityScore: 72,
    openedAt: '2026-07-18T14:00:00Z',
    lastActivityAt: '2026-07-24T16:45:00Z',
    overdueAmount: 32500,
    overdueCount: 1,
    assignedUser: { name: 'Ana Costa', initials: 'AC' },
    contactAttempts: 2,
  },
  {
    id: '3',
    customer: { id: 'c3', legalName: 'Ana Carolina Ferreira', documentMasked: '***.***.***-89' },
    contract: { externalId: '12347', internetStatus: 'ACTIVE', plan: { name: '300 Mbps' } },
    status: 'PROMISE_ACTIVE',
    priorityScore: 45,
    openedAt: '2026-07-15T09:00:00Z',
    lastActivityAt: '2026-07-23T11:20:00Z',
    overdueAmount: 18900,
    overdueCount: 1,
    assignedUser: { name: 'Maria Silva', initials: 'MS' },
    hasActivePromise: true,
    contactAttempts: 3,
  },
  {
    id: '4',
    customer: { id: 'c4', legalName: 'Carlos Eduardo Lima', documentMasked: '***.***.***-42' },
    contract: { externalId: '12348', internetStatus: 'MANUAL_BLOCKED', plan: { name: '500 Mbps' } },
    status: 'NEGOTIATING',
    priorityScore: 68,
    openedAt: '2026-07-22T08:00:00Z',
    lastActivityAt: '2026-07-25T10:00:00Z',
    overdueAmount: 67800,
    overdueCount: 3,
    assignedUser: { name: 'Pedro Lima', initials: 'PL' },
    contactAttempts: 4,
  },
  {
    id: '5',
    customer: { id: 'c5', legalName: 'Fernanda Costa Almeida', documentMasked: '***.***.***-33' },
    contract: { externalId: '12349', internetStatus: 'AUTO_BLOCKED', plan: { name: '100 Mbps' } },
    status: 'NO_CONTACT',
    priorityScore: 92,
    openedAt: '2026-07-10T11:00:00Z',
    lastActivityAt: '2026-07-20T09:00:00Z',
    overdueAmount: 125000,
    overdueCount: 5,
    assignedUser: { name: 'Ana Costa', initials: 'AC' },
    contactAttempts: 5,
  },
  {
    id: '6',
    customer: { id: 'c6', legalName: 'Roberto Mendes Junior', documentMasked: '***.***.***-77' },
    contract: { externalId: '12350', internetStatus: 'AUTO_BLOCKED', plan: { name: '200 Mbps' } },
    status: 'PICKUP_CANDIDATE',
    priorityScore: 95,
    openedAt: '2026-07-05T08:00:00Z',
    lastActivityAt: '2026-07-22T14:00:00Z',
    overdueAmount: 189000,
    overdueCount: 7,
    contactAttempts: 8,
  },
  {
    id: '7',
    customer: { id: 'c7', legalName: 'Patricia Souza Lima', documentMasked: '***.***.***-55' },
    contract: { externalId: '12351', internetStatus: 'AUTO_BLOCKED', plan: { name: '150 Mbps' } },
    status: 'NEW',
    priorityScore: 78,
    openedAt: '2026-07-24T09:00:00Z',
    lastActivityAt: '2026-07-24T09:00:00Z',
    overdueAmount: 28900,
    overdueCount: 1,
    contactAttempts: 0,
  },
  {
    id: '8',
    customer: { id: 'c8', legalName: 'Lucas Oliveira Santos', documentMasked: '***.***.***-88' },
    contract: { externalId: '12352', internetStatus: 'ACTIVE', plan: { name: '100 Mbps' } },
    status: 'CONTACTING',
    priorityScore: 55,
    openedAt: '2026-07-19T10:00:00Z',
    lastActivityAt: '2026-07-25T11:00:00Z',
    overdueAmount: 15000,
    overdueCount: 1,
    assignedUser: { name: 'Maria Silva', initials: 'MS' },
    contactAttempts: 1,
  },
]

async function fetchStats() {
  return {
    total: 47,
    new: 12,
    contacting: 15,
    promiseActive: 8,
    noContact: 7,
    pickupCandidate: 5,
    overdueTotal: 156780000,
  }
}

// Icons
const Icons = {
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  kanban: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="12" rx="1" /><rect x="17" y="3" width="5" height="8" rx="1" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  promise: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
    </svg>
  ),
  wifiOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
      <line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  sort: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
    </svg>
  ),
}

function QueuePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'priority' | 'amount' | 'date'>('priority')

  const statsQuery = useQuery({
    queryKey: ['queue-stats'],
    queryFn: fetchStats,
  })

  const stats = statsQuery.data

  const filteredCases = useMemo(() => {
    let cases = [...mockCases]
    if (statusFilter) {
      cases = cases.filter((c) => c.status === statusFilter)
    }
    cases.sort((a, b) => {
      if (sortBy === 'priority') return b.priorityScore - a.priorityScore
      if (sortBy === 'amount') return b.overdueAmount - a.overdueAmount
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    })
    return cases
  }, [statusFilter, sortBy])

  const casesByStatus = useMemo(() => {
    const grouped: Record<CaseStatus, Case[]> = {} as Record<CaseStatus, Case[]>
    kanbanColumns.forEach((col) => {
      grouped[col.status] = mockCases.filter((c) => c.status === col.status)
    })
    return grouped
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Fila de Relacionamento
          </h1>
          <p className="text-text-secondary mt-1">
            Gerencie os casos de cobrança e relacionamento com seus clientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-surface-800 text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {Icons.list}
              Lista
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-surface-800 text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {Icons.kanban}
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total em Fila"
          value={stats?.total ?? 0}
          color="text-text-primary"
        />
        <StatCard
          label="Novos"
          value={stats?.new ?? 0}
          color="text-accent"
          onClick={() => setStatusFilter('NEW')}
          active={statusFilter === 'NEW'}
        />
        <StatCard
          label="Contatando"
          value={stats?.contacting ?? 0}
          color="text-warning"
          onClick={() => setStatusFilter('CONTACTING')}
          active={statusFilter === 'CONTACTING'}
        />
        <StatCard
          label="Promessa"
          value={stats?.promiseActive ?? 0}
          color="text-success"
          onClick={() => setStatusFilter('PROMISE_ACTIVE')}
          active={statusFilter === 'PROMISE_ACTIVE'}
        />
        <StatCard
          label="Sem Contato"
          value={stats?.noContact ?? 0}
          color="text-danger"
          onClick={() => setStatusFilter('NO_CONTACT')}
          active={statusFilter === 'NO_CONTACT'}
        />
        <StatCard
          label="Valor Total"
          value={formatCurrency(stats?.overdueTotal ?? 0)}
          color="text-danger"
          isLarge
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-ghost gap-2">
          {Icons.filter}
          Filtros
        </button>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select min-w-[160px]"
        >
          <option value="">Todos os status</option>
          {Object.entries(statusConfig).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'priority' | 'amount' | 'date')}
          className="select min-w-[160px]"
        >
          <option value="priority">Maior prioridade</option>
          <option value="amount">Maior valor</option>
          <option value="date">Mais recente</option>
        </select>

        {statusFilter && (
          <button
            onClick={() => setStatusFilter('')}
            className="btn-ghost text-xs"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <ListView cases={filteredCases} />
      ) : (
        <KanbanView casesByStatus={casesByStatus} />
      )}
    </div>
  )
}

// Stats Card Component
function StatCard({
  label,
  value,
  color,
  onClick,
  active,
  isLarge,
}: {
  label: string
  value: string | number
  color: string
  onClick?: () => void
  active?: boolean
  isLarge?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`stat-card text-left transition-all ${
        onClick ? 'card-hover cursor-pointer' : ''
      } ${active ? 'ring-2 ring-accent border-accent' : ''}`}
    >
      <div className={`stat-value ${color} ${isLarge ? 'text-lg' : ''}`}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </button>
  )
}

// List View Component
function ListView({ cases }: { cases: Case[] }) {
  return (
    <div className="table-container bg-surface-800">
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Status</th>
            <th>Score</th>
            <th className="text-right">Valor em Atraso</th>
            <th>Conexão</th>
            <th>Última Atividade</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12">
                <div className="empty-state">
                  <div className="empty-state-title">Nenhum caso encontrado</div>
                  <div className="empty-state-description">
                    Ajuste os filtros para ver mais resultados
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            cases.map((caseItem, index) => (
              <tr
                key={caseItem.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td>
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: caseItem.id }}
                    className="group"
                  >
                    <div className="font-medium text-text-primary group-hover:text-accent transition-colors">
                      {caseItem.customer.legalName}
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-2">
                      {caseItem.customer.documentMasked}
                      <span className="text-surface-400">•</span>
                      #{caseItem.contract.externalId}
                    </div>
                  </Link>
                </td>
                <td>
                  <StatusBadge status={caseItem.status} />
                </td>
                <td>
                  <ScoreIndicator score={caseItem.priorityScore} />
                </td>
                <td className="text-right">
                  <div className="font-mono font-medium text-danger">
                    {formatCurrency(caseItem.overdueAmount)}
                  </div>
                  <div className="text-xs text-text-muted">
                    {caseItem.overdueCount} {caseItem.overdueCount === 1 ? 'fatura' : 'faturas'}
                  </div>
                </td>
                <td>
                  <ConnectionStatus status={caseItem.contract.internetStatus} />
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-text-muted text-sm">
                    {Icons.clock}
                    {formatRelativeDate(caseItem.lastActivityAt)}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      to="/cases/$caseId"
                      params={{ caseId: caseItem.id }}
                      className="btn-ghost btn-icon"
                      title="Ver detalhes"
                    >
                      {Icons.eye}
                    </Link>
                    <button className="btn-ghost btn-icon" title="Registrar contato">
                      {Icons.phone}
                    </button>
                    <button className="btn-ghost btn-icon" title="Criar promessa">
                      {Icons.promise}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Kanban View Component
function KanbanView({ casesByStatus }: { casesByStatus: Record<CaseStatus, Case[]> }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
      {kanbanColumns.map((column) => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          label={column.label}
          cases={casesByStatus[column.status] || []}
        />
      ))}
    </div>
  )
}

function KanbanColumn({
  status,
  label,
  cases,
}: {
  status: CaseStatus
  label: string
  cases: Case[]
}) {
  const totalAmount = cases.reduce((sum, c) => sum + c.overdueAmount, 0)

  return (
    <div className="kanban-column flex-shrink-0 w-80">
      <div className="kanban-column-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`badge ${statusConfig[status].color}`}>
              {cases.length}
            </span>
            <span className="font-medium text-text-primary">{label}</span>
          </div>
          <span className="text-xs text-text-muted font-mono">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {cases.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            Nenhum caso
          </div>
        ) : (
          cases.map((caseItem, index) => (
            <KanbanCard
              key={caseItem.id}
              caseItem={caseItem}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  )
}

function KanbanCard({ caseItem, index }: { caseItem: Case; index: number }) {
  return (
    <Link
      to="/cases/$caseId"
      params={{ caseId: caseItem.id }}
      className="kanban-card block animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-primary truncate">
            {caseItem.customer.legalName}
          </div>
          <div className="text-xs text-text-muted">
            {caseItem.customer.documentMasked}
          </div>
        </div>
        <ScoreIndicator score={caseItem.priorityScore} small />
      </div>

      {/* Amount */}
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-sm font-medium text-danger">
          {formatCurrency(caseItem.overdueAmount)}
        </div>
        <ConnectionStatus status={caseItem.contract.internetStatus} small />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1">
          {Icons.clock}
          {formatRelativeDate(caseItem.lastActivityAt)}
        </div>
        {caseItem.assignedUser && (
          <div className="avatar-sm text-[10px] bg-surface-700">
            {caseItem.assignedUser.initials}
          </div>
        )}
      </div>

      {/* Indicators */}
      {(caseItem.hasActivePromise || (caseItem.contactAttempts && caseItem.contactAttempts > 3)) && (
        <div className="flex gap-1 mt-2 pt-2 border-t border-surface-700">
          {caseItem.hasActivePromise && (
            <span className="badge-success text-[10px]">Promessa ativa</span>
          )}
          {caseItem.contactAttempts && caseItem.contactAttempts > 3 && (
            <span className="badge-warning text-[10px]">{caseItem.contactAttempts} tentativas</span>
          )}
        </div>
      )}
    </Link>
  )
}

// Helper Components
function StatusBadge({ status }: { status: CaseStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`badge ${config.color}`}>
      {config.label}
    </span>
  )
}

function ScoreIndicator({ score, small }: { score: number; small?: boolean }) {
  let className = 'score-critical'
  if (score >= 80) className = 'score-excellent'
  else if (score >= 60) className = 'score-good'
  else if (score >= 40) className = 'score-regular'
  else if (score >= 20) className = 'score-risk'

  if (small) {
    return (
      <span className={`${className} w-7 h-7 text-xs`}>
        {score}
      </span>
    )
  }

  return <span className={className}>{score}</span>
}

function ConnectionStatus({ status, small }: { status: string; small?: boolean }) {
  const isOnline = status === 'ACTIVE'
  const isBlocked = status.includes('BLOCKED')

  if (small) {
    return (
      <span className={`flex items-center gap-1 ${isBlocked ? 'text-danger' : isOnline ? 'text-success' : 'text-text-muted'}`}>
        {isBlocked ? Icons.wifiOff : Icons.wifi}
      </span>
    )
  }

  return (
    <span className={`flex items-center gap-1.5 text-xs ${isBlocked ? 'text-danger' : isOnline ? 'text-success' : 'text-text-muted'}`}>
      {isBlocked ? Icons.wifiOff : Icons.wifi}
      {isBlocked ? 'Bloqueado' : isOnline ? 'Online' : 'Offline'}
    </span>
  )
}

// Utility functions
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
