import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const Route = createFileRoute('/customers')({
  component: CustomersPage,
})

interface Customer {
  id: string
  legalName: string
  tradeName?: string
  documentMasked: string
  city?: string
  district?: string
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED' | 'STALE'
  score?: number
  scoreClassification?: string
  overdueAmount: number
  activeContracts: number
  lastPaymentAt?: string
}

// Mock data
const mockCustomers: Customer[] = [
  { id: 'c1', legalName: 'Maria Silva Santos', tradeName: 'Maria Modas', documentMasked: '***.***.***-01', city: 'São Paulo', district: 'Centro', syncStatus: 'SYNCED', score: 72, scoreClassification: 'BOM', overdueAmount: 45000, activeContracts: 2, lastPaymentAt: '2026-07-15' },
  { id: 'c2', legalName: 'João Pedro Oliveira', documentMasked: '***.***.***-15', city: 'São Paulo', district: 'Moema', syncStatus: 'SYNCED', score: 85, scoreClassification: 'EXCELENTE', overdueAmount: 0, activeContracts: 1, lastPaymentAt: '2026-07-20' },
  { id: 'c3', legalName: 'Ana Carolina Ferreira', documentMasked: '***.***.***-89', city: 'Campinas', district: 'Cambuí', syncStatus: 'SYNCED', score: 45, scoreClassification: 'REGULAR', overdueAmount: 18900, activeContracts: 1, lastPaymentAt: '2026-06-25' },
  { id: 'c4', legalName: 'Carlos Eduardo Lima', documentMasked: '***.***.***-42', city: 'São Paulo', district: 'Pinheiros', syncStatus: 'STALE', score: 28, scoreClassification: 'RISCO', overdueAmount: 67800, activeContracts: 3, lastPaymentAt: '2026-05-10' },
  { id: 'c5', legalName: 'Fernanda Costa Almeida', documentMasked: '***.***.***-33', city: 'Santos', district: 'Gonzaga', syncStatus: 'SYNCED', score: 15, scoreClassification: 'CRITICO', overdueAmount: 125000, activeContracts: 1, lastPaymentAt: '2026-04-01' },
  { id: 'c6', legalName: 'Ricardo Mendes Souza', tradeName: 'RM Informática', documentMasked: '***.***.***-77', city: 'São Paulo', district: 'Itaim', syncStatus: 'SYNCED', score: 92, scoreClassification: 'EXCELENTE', overdueAmount: 0, activeContracts: 2, lastPaymentAt: '2026-07-22' },
  { id: 'c7', legalName: 'Patricia Souza Lima', documentMasked: '***.***.***-55', city: 'Osasco', district: 'Centro', syncStatus: 'PENDING', score: 65, scoreClassification: 'BOM', overdueAmount: 28900, activeContracts: 1 },
  { id: 'c8', legalName: 'Lucas Oliveira Santos', documentMasked: '***.***.***-88', city: 'Guarulhos', district: 'Centro', syncStatus: 'SYNCED', score: 58, scoreClassification: 'REGULAR', overdueAmount: 15000, activeContracts: 1, lastPaymentAt: '2026-07-01' },
]

const Icons = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

async function fetchCustomers(search: string) {
  const filtered = search
    ? mockCustomers.filter(c =>
        c.legalName.toLowerCase().includes(search.toLowerCase()) ||
        c.documentMasked.includes(search)
      )
    : mockCustomers

  return { data: filtered, total: filtered.length }
}

function CustomersPage() {
  const [search, setSearch] = useState('')

  const customersQuery = useQuery({
    queryKey: ['customers', search],
    queryFn: () => fetchCustomers(search),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Clientes
          </h1>
          <p className="text-text-secondary mt-1">
            Visualize e gerencie a base de clientes sincronizada
          </p>
        </div>
        <button className="btn-secondary gap-2 self-start">
          {Icons.sync}
          Sincronizar IXC
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {Icons.search}
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, CPF ou CNPJ..."
            className="input pl-10"
          />
        </div>
        <div className="text-sm text-text-muted">
          {customersQuery.data?.total ?? 0} clientes encontrados
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {customersQuery.isLoading && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        )}

        {customersQuery.isSuccess && customersQuery.data.data.map((customer, index) => (
          <CustomerCard key={customer.id} customer={customer} index={index} />
        ))}

        {customersQuery.isSuccess && customersQuery.data.data.length === 0 && (
          <div className="col-span-full empty-state">
            <div className="empty-state-icon">{Icons.user}</div>
            <div className="empty-state-title">Nenhum cliente encontrado</div>
            <div className="empty-state-description">
              Tente ajustar os termos de busca
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CustomerCard({ customer, index }: { customer: Customer; index: number }) {
  return (
    <Link
      to="/customers/$customerId"
      params={{ customerId: customer.id }}
      className="card-interactive p-4 animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="avatar-lg bg-accent/10 text-accent flex-shrink-0">
          {customer.legalName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-text-primary truncate">
            {customer.legalName}
          </div>
          {customer.tradeName && (
            <div className="text-xs text-text-muted truncate">
              {customer.tradeName}
            </div>
          )}
          <div className="text-xs text-text-muted mt-0.5">
            {customer.documentMasked}
          </div>
        </div>
        {customer.score !== undefined && (
          <ScoreBadge score={customer.score} classification={customer.scoreClassification} />
        )}
      </div>

      {/* Location */}
      {customer.city && (
        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
          {Icons.map}
          {customer.city}{customer.district && ` - ${customer.district}`}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-700">
        <div>
          {customer.overdueAmount > 0 ? (
            <div className="font-mono text-sm font-medium text-danger">
              {formatCurrency(customer.overdueAmount)}
            </div>
          ) : (
            <div className="text-sm text-success">Em dia</div>
          )}
          <div className="text-xs text-text-muted">
            {customer.activeContracts} {customer.activeContracts === 1 ? 'contrato' : 'contratos'}
          </div>
        </div>
        <SyncStatusBadge status={customer.syncStatus} />
      </div>
    </Link>
  )
}

function ScoreBadge({ score, classification }: { score: number; classification?: string }) {
  let className = 'score-critical'
  if (score >= 80) className = 'score-excellent'
  else if (score >= 60) className = 'score-good'
  else if (score >= 40) className = 'score-regular'
  else if (score >= 20) className = 'score-risk'

  return (
    <div className={`${className} w-8 h-8 text-sm`} title={classification}>
      {score}
    </div>
  )
}

function SyncStatusBadge({ status }: { status: Customer['syncStatus'] }) {
  const config: Record<Customer['syncStatus'], { label: string; color: string; icon: React.ReactNode }> = {
    SYNCED: { label: 'Sincronizado', color: 'badge-success', icon: Icons.check },
    PENDING: { label: 'Pendente', color: 'badge-warning', icon: Icons.clock },
    FAILED: { label: 'Falhou', color: 'badge-danger', icon: Icons.alert },
    STALE: { label: 'Desatualizado', color: 'badge-warning', icon: Icons.clock },
  }

  const { label, color, icon } = config[status]

  return (
    <span className={`${color} gap-1`} title={label}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </span>
  )
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}
