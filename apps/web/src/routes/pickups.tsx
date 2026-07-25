import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/pickups')({
  component: PickupsPage,
})

// SVG Icons
const Icons = {
  truck: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 17h4V5H2v12h3M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  checkCircle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  xCircle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  externalLink: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  arrowLeft: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wifiOff: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 4.17-2.65M10.66 5c4.01-.36 8.14.9 11.34 3.76M16.85 11.25a10 10 0 0 1 2.22 1.68M5 13a10 10 0 0 1 5.24-2.76M12 20h.01"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  mapPin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  package: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  alertTriangle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
}

// Types
type PickupStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'OPENED_IN_GC' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'

interface PickupRequest {
  id: string
  status: PickupStatus
  customer: {
    id: string
    legalName: string
    documentMasked: string
    address?: string
  }
  contract: {
    externalId: string
    plan?: string
  }
  assessment: {
    offlineSince: string | null
    offlineDays: number
    contactAttempts: number
    lastContactAt: string | null
    recommendation: string
    notes?: string
  }
  equipment?: {
    type: string
    serialNumber?: string
  }[]
  gcExternalId?: string
  requestedBy: string
  createdAt: string
  updatedAt: string
}

// Mock data
const mockRequests: PickupRequest[] = [
  {
    id: '1',
    status: 'PENDING_APPROVAL',
    customer: { id: 'c1', legalName: 'Carlos Eduardo Lima', documentMasked: '***.***.***-42', address: 'Rua das Flores, 123 - Centro' },
    contract: { externalId: '12345', plan: '100 Mbps' },
    assessment: {
      offlineSince: '2026-07-15T00:00:00Z',
      offlineDays: 10,
      contactAttempts: 5,
      lastContactAt: '2026-07-23T14:00:00Z',
      recommendation: 'APTO_RECOLHIMENTO',
      notes: 'Cliente não atende há 5 tentativas. Equipamento ONU em comodato.',
    },
    equipment: [{ type: 'ONU', serialNumber: 'ONU-12345' }],
    requestedBy: 'Maria S.',
    createdAt: '2026-07-24T10:00:00Z',
    updatedAt: '2026-07-24T10:00:00Z',
  },
  {
    id: '2',
    status: 'APPROVED',
    customer: { id: 'c2', legalName: 'Fernanda Costa Almeida', documentMasked: '***.***.***-33', address: 'Av. Brasil, 500 - Jardim América' },
    contract: { externalId: '12346', plan: '200 Mbps' },
    assessment: {
      offlineSince: '2026-07-10T00:00:00Z',
      offlineDays: 15,
      contactAttempts: 7,
      lastContactAt: '2026-07-22T10:00:00Z',
      recommendation: 'APTO_RECOLHIMENTO',
    },
    equipment: [{ type: 'ONU', serialNumber: 'ONU-67890' }, { type: 'Roteador', serialNumber: 'RT-11111' }],
    requestedBy: 'João P.',
    createdAt: '2026-07-22T14:00:00Z',
    updatedAt: '2026-07-24T08:00:00Z',
  },
  {
    id: '3',
    status: 'OPENED_IN_GC',
    customer: { id: 'c3', legalName: 'Roberto Alves Santos', documentMasked: '***.***.***-55', address: 'Rua Minas Gerais, 789 - Boa Vista' },
    contract: { externalId: '12347', plan: '100 Mbps' },
    assessment: {
      offlineSince: '2026-07-05T00:00:00Z',
      offlineDays: 20,
      contactAttempts: 10,
      lastContactAt: '2026-07-20T09:00:00Z',
      recommendation: 'APTO_RECOLHIMENTO',
    },
    equipment: [{ type: 'ONU', serialNumber: 'ONU-22222' }],
    gcExternalId: 'OS-123456',
    requestedBy: 'Ana C.',
    createdAt: '2026-07-20T09:00:00Z',
    updatedAt: '2026-07-23T15:00:00Z',
  },
  {
    id: '4',
    status: 'COMPLETED',
    customer: { id: 'c4', legalName: 'Paula Mendes Silva', documentMasked: '***.***.***-77', address: 'Rua São Paulo, 321 - Centro' },
    contract: { externalId: '12348', plan: '50 Mbps' },
    assessment: {
      offlineSince: '2026-06-25T00:00:00Z',
      offlineDays: 30,
      contactAttempts: 12,
      lastContactAt: '2026-07-10T11:00:00Z',
      recommendation: 'APTO_RECOLHIMENTO',
    },
    equipment: [{ type: 'Conversor', serialNumber: 'CV-33333' }],
    gcExternalId: 'OS-123400',
    requestedBy: 'Maria S.',
    createdAt: '2026-07-10T11:00:00Z',
    updatedAt: '2026-07-22T16:00:00Z',
  },
]

async function fetchPickupStats() {
  return {
    pendingApproval: 3,
    approved: 2,
    openedInGc: 5,
    inProgress: 3,
    completed: 12,
  }
}

async function fetchRequests(status?: string) {
  const filtered = status
    ? mockRequests.filter(r => r.status === status)
    : mockRequests
  return filtered
}

function PickupsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null)

  const statsQuery = useQuery({
    queryKey: ['pickup-stats'],
    queryFn: fetchPickupStats,
  })

  const requestsQuery = useQuery({
    queryKey: ['pickup-requests', statusFilter],
    queryFn: () => fetchRequests(statusFilter),
  })

  const stats = statsQuery.data

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-100 flex items-center gap-3">
            {Icons.truck}
            <span>Recolhimento de Equipamentos</span>
          </h1>
          <p className="text-surface-400 mt-1">
            Gerencie as solicitações de recolhimento de equipamentos em comodato
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Aguardando"
          value={stats?.pendingApproval ?? 0}
          icon={Icons.clock}
          color="warning"
          onClick={() => setStatusFilter(statusFilter === 'PENDING_APPROVAL' ? '' : 'PENDING_APPROVAL')}
          active={statusFilter === 'PENDING_APPROVAL'}
        />
        <StatCard
          label="Aprovados"
          value={stats?.approved ?? 0}
          icon={Icons.checkCircle}
          color="success"
          onClick={() => setStatusFilter(statusFilter === 'APPROVED' ? '' : 'APPROVED')}
          active={statusFilter === 'APPROVED'}
        />
        <StatCard
          label="No GC"
          value={stats?.openedInGc ?? 0}
          icon={Icons.externalLink}
          color="info"
          onClick={() => setStatusFilter(statusFilter === 'OPENED_IN_GC' ? '' : 'OPENED_IN_GC')}
          active={statusFilter === 'OPENED_IN_GC'}
        />
        <StatCard
          label="Em Andamento"
          value={stats?.inProgress ?? 0}
          icon={Icons.truck}
          color="accent"
          onClick={() => setStatusFilter(statusFilter === 'IN_PROGRESS' ? '' : 'IN_PROGRESS')}
          active={statusFilter === 'IN_PROGRESS'}
        />
        <StatCard
          label="Concluídos"
          value={stats?.completed ?? 0}
          icon={Icons.package}
          color="muted"
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? '' : 'COMPLETED')}
          active={statusFilter === 'COMPLETED'}
        />
      </div>

      {/* Filter indicator */}
      {statusFilter && (
        <button
          onClick={() => setStatusFilter('')}
          className="text-sm text-accent hover:text-accent-400 flex items-center gap-2 transition-colors"
        >
          {Icons.arrowLeft}
          <span>Mostrar todos</span>
        </button>
      )}

      {/* Requests table */}
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contrato</th>
              <th>Status</th>
              <th>Offline</th>
              <th>Contatos</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {requestsQuery.isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <span className="text-surface-400 text-sm">Carregando...</span>
                  </div>
                </td>
              </tr>
            )}

            {requestsQuery.isSuccess && requestsQuery.data.map((request) => (
              <tr key={request.id} className="group">
                <td>
                  <div className="font-medium text-surface-200">{request.customer.legalName}</div>
                  <div className="text-sm text-surface-500">{request.customer.documentMasked}</div>
                </td>
                <td>
                  <div className="text-surface-300">#{request.contract.externalId}</div>
                  {request.contract.plan && (
                    <div className="text-sm text-surface-500">{request.contract.plan}</div>
                  )}
                </td>
                <td>
                  <PickupStatusBadge status={request.status} />
                </td>
                <td>
                  {request.assessment.offlineDays > 0 ? (
                    <div className="flex items-center gap-2 text-score-critical">
                      {Icons.wifiOff}
                      <span>{request.assessment.offlineDays} dias</span>
                    </div>
                  ) : (
                    <span className="text-surface-500">-</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2 text-surface-300">
                    {Icons.phone}
                    <span>{request.assessment.contactAttempts} tentativas</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    {request.status === 'PENDING_APPROVAL' && (
                      <>
                        <button className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1">
                          {Icons.checkCircle}
                          <span>Aprovar</span>
                        </button>
                        <button className="px-3 py-1.5 border border-score-critical/50 text-score-critical rounded-lg text-sm hover:bg-score-critical/10 transition-colors flex items-center gap-1">
                          {Icons.xCircle}
                          <span>Rejeitar</span>
                        </button>
                      </>
                    )}
                    {request.status === 'APPROVED' && (
                      <button className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
                        {Icons.externalLink}
                        <span>Abrir no GC</span>
                      </button>
                    )}
                    {request.status === 'OPENED_IN_GC' && request.gcExternalId && (
                      <span className="text-sm text-surface-400 font-mono">
                        {request.gcExternalId}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 text-surface-400 hover:text-surface-200 hover:bg-surface-700 rounded-lg transition-colors"
                    >
                      {Icons.eye}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {requestsQuery.isSuccess && requestsQuery.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-surface-400">
                    <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center">
                      {Icons.package}
                    </div>
                    <span>Nenhuma solicitação encontrada</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <PickupDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color, onClick, active }: {
  label: string
  value: number
  icon: React.ReactNode
  color: 'warning' | 'success' | 'info' | 'accent' | 'muted' | 'danger'
  onClick: () => void
  active: boolean
}) {
  const colorClasses = {
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    success: 'border-score-good/50 bg-score-good/10 text-score-good',
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    accent: 'border-accent/50 bg-accent/10 text-accent',
    muted: 'border-surface-600 bg-surface-800 text-surface-400',
    danger: 'border-score-critical/50 bg-score-critical/10 text-score-critical',
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        active
          ? colorClasses[color]
          : 'bg-surface-800 border-surface-700 hover:border-surface-600'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={active ? '' : 'text-surface-500'}>{icon}</span>
        <span className={`text-sm ${active ? '' : 'text-surface-400'}`}>{label}</span>
      </div>
      <div className={`text-2xl font-display font-bold ${active ? '' : 'text-surface-100'}`}>
        {value}
      </div>
    </button>
  )
}

function PickupStatusBadge({ status }: { status: PickupStatus }) {
  const config: Record<PickupStatus, { label: string; className: string }> = {
    PENDING_APPROVAL: { label: 'Aguardando', className: 'badge-warning' },
    APPROVED: { label: 'Aprovado', className: 'badge-success' },
    REJECTED: { label: 'Rejeitado', className: 'badge-danger' },
    OPENED_IN_GC: { label: 'No GC', className: 'badge-info' },
    IN_PROGRESS: { label: 'Em Andamento', className: 'status-contacting' },
    COMPLETED: { label: 'Concluído', className: 'badge-muted' },
    CANCELED: { label: 'Cancelado', className: 'badge-muted' },
  }
  const c = config[status] ?? { label: status, className: 'badge-muted' }
  return <span className={`badge ${c.className}`}>{c.label}</span>
}

function PickupDetailModal({ request, onClose }: { request: PickupRequest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-surface-800 rounded-xl w-full max-w-2xl border border-surface-700 shadow-elevated animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-surface-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-surface-100">
                  {request.customer.legalName}
                </h2>
                <PickupStatusBadge status={request.status} />
              </div>
              <p className="text-surface-400 text-sm mt-1">
                {request.customer.documentMasked}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-200 hover:bg-surface-700 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contract & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-700">
              <div className="text-sm text-surface-400 mb-1">Contrato</div>
              <div className="font-medium text-surface-200">#{request.contract.externalId}</div>
              {request.contract.plan && (
                <div className="text-sm text-surface-400">{request.contract.plan}</div>
              )}
            </div>
            {request.customer.address && (
              <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-700">
                <div className="text-sm text-surface-400 mb-1 flex items-center gap-1">
                  {Icons.mapPin}
                  <span>Endereço</span>
                </div>
                <div className="text-sm text-surface-300">{request.customer.address}</div>
              </div>
            )}
          </div>

          {/* Assessment Info */}
          <div>
            <h3 className="font-semibold text-surface-100 mb-3 flex items-center gap-2">
              {Icons.alertTriangle}
              <span>Avaliação</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-700 text-center">
                <div className="text-2xl font-bold text-score-critical">
                  {request.assessment.offlineDays}
                </div>
                <div className="text-sm text-surface-400">dias offline</div>
              </div>
              <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-700 text-center">
                <div className="text-2xl font-bold text-surface-100">
                  {request.assessment.contactAttempts}
                </div>
                <div className="text-sm text-surface-400">contatos</div>
              </div>
              <div className="p-4 bg-surface-700/30 rounded-lg border border-surface-700 text-center">
                <div className="text-sm font-medium text-score-critical">
                  {request.assessment.recommendation.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-surface-400">recomendação</div>
              </div>
            </div>
            {request.assessment.notes && (
              <div className="mt-3 p-3 bg-surface-700/30 rounded-lg border border-surface-700 text-sm text-surface-300">
                {request.assessment.notes}
              </div>
            )}
          </div>

          {/* Equipment */}
          {request.equipment && request.equipment.length > 0 && (
            <div>
              <h3 className="font-semibold text-surface-100 mb-3 flex items-center gap-2">
                {Icons.package}
                <span>Equipamentos</span>
              </h3>
              <div className="space-y-2">
                {request.equipment.map((eq, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-700/30 rounded-lg border border-surface-700">
                    <span className="text-surface-200">{eq.type}</span>
                    {eq.serialNumber && (
                      <span className="text-sm text-surface-400 font-mono">{eq.serialNumber}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GC Info */}
          {request.gcExternalId && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400">
                {Icons.externalLink}
                <span className="font-medium">Ordem de Serviço GC</span>
              </div>
              <div className="mt-2 text-surface-200 font-mono">{request.gcExternalId}</div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-surface-500 flex items-center justify-between pt-4 border-t border-surface-700">
            <div className="flex items-center gap-1">
              {Icons.user}
              <span>Solicitado por {request.requestedBy}</span>
            </div>
            <div className="flex items-center gap-1">
              {Icons.calendar}
              <span>{formatDateTime(request.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {request.status === 'PENDING_APPROVAL' && (
          <div className="p-6 border-t border-surface-700 flex gap-3 justify-end">
            <button className="px-4 py-2 border border-score-critical/50 text-score-critical rounded-lg hover:bg-score-critical/10 transition-colors flex items-center gap-2">
              {Icons.xCircle}
              <span>Rejeitar</span>
            </button>
            <button className="btn-primary flex items-center gap-2">
              {Icons.checkCircle}
              <span>Aprovar Recolhimento</span>
            </button>
          </div>
        )}

        {request.status === 'APPROVED' && (
          <div className="p-6 border-t border-surface-700 flex gap-3 justify-end">
            <button onClick={onClose} className="btn-ghost">
              Cancelar
            </button>
            <button className="btn-primary flex items-center gap-2">
              {Icons.externalLink}
              <span>Abrir no GC</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
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
