import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/reports')({
  component: ReportsPage,
})

// SVG Icons
const Icons = {
  barChart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  listChecks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>
    </svg>
  ),
  handshake: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
    </svg>
  ),
  truck: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 17h4V5H2v12h3M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
  trendingUp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
}

type ReportType = 'queue' | 'promises' | 'pickups' | 'performance'

interface ReportConfig {
  id: ReportType
  name: string
  description: string
  icon: React.ReactNode
}

const reportTypes: ReportConfig[] = [
  {
    id: 'queue',
    name: 'Fila de Casos',
    description: 'Análise da fila de relacionamento: casos por status, tempo médio, distribuição',
    icon: Icons.listChecks,
  },
  {
    id: 'promises',
    name: 'Promessas',
    description: 'Taxa de cumprimento, valores prometidos vs recebidos, aging',
    icon: Icons.handshake,
  },
  {
    id: 'pickups',
    name: 'Recolhimento',
    description: 'Equipamentos recolhidos, taxa de aprovação, tempo de ciclo',
    icon: Icons.truck,
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Produtividade por operador, casos resolvidos, tempo médio de atendimento',
    icon: Icons.trendingUp,
  },
]

// Mock data for reports
const mockQueueData = {
  totalCases: 1247,
  byStatus: [
    { status: 'Novo', count: 523, percentage: 42, color: 'bg-blue-500' },
    { status: 'Contatando', count: 312, percentage: 25, color: 'bg-amber-500' },
    { status: 'Promessa', count: 198, percentage: 16, color: 'bg-green-500' },
    { status: 'Regularizado', count: 156, percentage: 12, color: 'bg-emerald-500' },
    { status: 'Recolhimento', count: 58, percentage: 5, color: 'bg-red-500' },
  ],
  avgDaysInQueue: 12.3,
  casesResolvedToday: 47,
  resolutionRate: 12.5,
}

const mockPromisesData = {
  totalPromises: 423,
  fulfilled: 287,
  broken: 89,
  pending: 47,
  fulfillmentRate: 76.3,
  totalValuePromised: 89450000, // in cents
  totalValueReceived: 67230000,
  recoveryRate: 75.2,
}

const mockPickupsData = {
  totalAssessments: 156,
  approved: 89,
  rejected: 34,
  pending: 33,
  approvalRate: 72.4,
  avgCycleTime: 5.2,
  equipmentByType: [
    { type: 'ONU', count: 67, percentage: 43 },
    { type: 'Roteador', count: 45, percentage: 29 },
    { type: 'Conversor', count: 23, percentage: 15 },
    { type: 'Outros', count: 21, percentage: 13 },
  ],
}

const mockPerformanceData = {
  operators: [
    { name: 'Maria Silva', casesResolved: 156, avgTime: 8.2, promisesFulfilled: 34, score: 92 },
    { name: 'João Santos', casesResolved: 142, avgTime: 9.1, promisesFulfilled: 28, score: 85 },
    { name: 'Ana Costa', casesResolved: 138, avgTime: 7.8, promisesFulfilled: 31, score: 88 },
    { name: 'Pedro Lima', casesResolved: 125, avgTime: 10.3, promisesFulfilled: 22, score: 78 },
    { name: 'Carla Dias', casesResolved: 118, avgTime: 8.9, promisesFulfilled: 26, score: 82 },
  ],
  totalResolved: 679,
  avgResolutionTime: 8.9,
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

function QueueReport() {
  const data = mockQueueData

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total de Casos"
          value={data.totalCases.toLocaleString('pt-BR')}
          icon={Icons.listChecks}
        />
        <StatCard
          label="Tempo Médio na Fila"
          value={`${data.avgDaysInQueue} dias`}
          icon={Icons.clock}
        />
        <StatCard
          label="Resolvidos Hoje"
          value={data.casesResolvedToday.toString()}
          icon={Icons.checkCircle}
          highlight="success"
        />
        <StatCard
          label="Taxa de Resolução"
          value={`${data.resolutionRate}%`}
          icon={Icons.trendingUp}
        />
      </div>

      {/* Distribution Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-6">Distribuição por Status</h3>
        <div className="space-y-4">
          {data.byStatus.map((item) => (
            <div key={item.status} className="flex items-center gap-4">
              <span className="w-28 text-sm text-surface-400">{item.status}</span>
              <div className="flex-1 bg-surface-700 rounded-full h-8 overflow-hidden">
                <div
                  className={`${item.color} h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                  style={{ width: `${Math.max(item.percentage, 8)}%` }}
                >
                  <span className="text-sm font-medium text-white">
                    {item.count}
                  </span>
                </div>
              </div>
              <span className="w-14 text-sm text-surface-400 text-right">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PromisesReport() {
  const data = mockPromisesData

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total de Promessas"
          value={data.totalPromises.toString()}
          icon={Icons.handshake}
        />
        <StatCard
          label="Taxa de Cumprimento"
          value={`${data.fulfillmentRate}%`}
          icon={Icons.checkCircle}
          highlight="success"
        />
        <StatCard
          label="Valor Prometido"
          value={formatCurrency(data.totalValuePromised)}
          icon={Icons.barChart}
        />
        <StatCard
          label="Valor Recebido"
          value={formatCurrency(data.totalValueReceived)}
          icon={Icons.trendingUp}
          highlight="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Promise Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-6">Status das Promessas</h3>
          <div className="space-y-4">
            <PromiseStatusRow
              label="Cumpridas"
              value={data.fulfilled}
              total={data.totalPromises}
              color="bg-score-good"
            />
            <PromiseStatusRow
              label="Quebradas"
              value={data.broken}
              total={data.totalPromises}
              color="bg-score-critical"
            />
            <PromiseStatusRow
              label="Pendentes"
              value={data.pending}
              total={data.totalPromises}
              color="bg-amber-500"
            />
          </div>
        </div>

        {/* Recovery Rate */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-6">Recuperação</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-surface-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${data.recoveryRate * 4.4} 440`}
                  strokeLinecap="round"
                  className="text-accent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-surface-100">
                  {data.recoveryRate}%
                </span>
              </div>
            </div>
            <p className="text-sm text-surface-400 mt-4">do valor prometido foi recuperado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PromiseStatusRow({ label, value, total, color }: {
  label: string
  value: number
  total: number
  color: string
}) {
  const percentage = (value / total) * 100

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-surface-300">{label}</span>
        <span className="font-medium text-surface-100">{value}</span>
      </div>
      <div className="bg-surface-700 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function PickupsReport() {
  const data = mockPickupsData

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total de Avaliações"
          value={data.totalAssessments.toString()}
          icon={Icons.truck}
        />
        <StatCard
          label="Aprovados"
          value={data.approved.toString()}
          icon={Icons.checkCircle}
          highlight="success"
        />
        <StatCard
          label="Rejeitados"
          value={data.rejected.toString()}
          icon={Icons.xCircle}
          highlight="danger"
        />
        <StatCard
          label="Tempo Médio (dias)"
          value={data.avgCycleTime.toString()}
          icon={Icons.clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment by Type */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-6">Equipamentos por Tipo</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.equipmentByType.map((item) => (
              <div key={item.type} className="p-4 bg-surface-700/30 rounded-xl border border-surface-700 text-center">
                <div className="text-3xl font-display font-bold text-surface-100">{item.count}</div>
                <div className="text-sm text-surface-400 mt-1">{item.type}</div>
                <div className="text-xs text-surface-500">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Rate */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-100 mb-6">Taxa de Aprovação</h3>
          <div className="flex flex-col items-center justify-center h-48">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-surface-700"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${data.approvalRate * 4.4} 440`}
                  strokeLinecap="round"
                  className="text-score-good"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-display font-bold text-surface-100">
                  {data.approvalRate}%
                </span>
              </div>
            </div>
            <p className="text-sm text-surface-400 mt-4">das solicitações aprovadas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PerformanceReport() {
  const data = mockPerformanceData

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Resolvidos"
          value={data.totalResolved.toString()}
          icon={Icons.checkCircle}
          highlight="success"
        />
        <StatCard
          label="Tempo Médio (min)"
          value={data.avgResolutionTime.toString()}
          icon={Icons.clock}
        />
        <StatCard
          label="Operadores Ativos"
          value={data.operators.length.toString()}
          icon={Icons.users}
        />
      </div>

      {/* Performance Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-700">
          <h3 className="text-lg font-semibold text-surface-100">Performance por Operador</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Operador</th>
              <th className="text-center">Casos Resolvidos</th>
              <th className="text-center">Tempo Médio (min)</th>
              <th className="text-center">Promessas Cumpridas</th>
              <th className="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.operators.map((operator, index) => (
              <tr key={operator.name}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-semibold">
                        {operator.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-surface-200">{operator.name}</span>
                      <div className="text-xs text-surface-500">#{index + 1} no ranking</div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <span className="font-semibold text-surface-100">{operator.casesResolved}</span>
                </td>
                <td className="text-center">
                  <span className={`${operator.avgTime < 9 ? 'text-score-good' : 'text-surface-300'}`}>
                    {operator.avgTime}
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge badge-success">{operator.promisesFulfilled}</span>
                </td>
                <td className="text-center">
                  <ScoreBadge score={operator.score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, highlight }: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: 'success' | 'danger' | 'warning'
}) {
  const highlightClasses = {
    success: 'text-score-good',
    danger: 'text-score-critical',
    warning: 'text-amber-400',
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-surface-500">{icon}</div>
        <span className="text-sm text-surface-400">{label}</span>
      </div>
      <div className={`text-2xl font-display font-bold ${highlight ? highlightClasses[highlight] : 'text-surface-100'}`}>
        {value}
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 90 ? 'score-excellent' :
    score >= 80 ? 'score-good' :
    score >= 70 ? 'score-regular' :
    score >= 60 ? 'score-risk' : 'score-critical'

  return (
    <div className={`inline-flex w-10 h-10 rounded-lg items-center justify-center font-bold ${colorClass}`}>
      {score}
    </div>
  )
}

function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('queue')
  const [dateRange, setDateRange] = useState('30d')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-100 flex items-center gap-3">
            {Icons.barChart}
            <span>Relatórios</span>
          </h1>
          <p className="text-surface-400 mt-1">Analise métricas e acompanhe a performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-surface-400">
            {Icons.calendar}
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="select"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="year">Este ano</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            {Icons.download}
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedReport === report.id
                ? 'border-accent bg-accent/10'
                : 'border-surface-700 bg-surface-800 hover:border-surface-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${selectedReport === report.id ? 'text-accent' : 'text-surface-500'}`}>
                {report.icon}
              </div>
              <span className={`font-semibold ${selectedReport === report.id ? 'text-accent' : 'text-surface-200'}`}>
                {report.name}
              </span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'queue' && <QueueReport />}
        {selectedReport === 'promises' && <PromisesReport />}
        {selectedReport === 'pickups' && <PickupsReport />}
        {selectedReport === 'performance' && <PerformanceReport />}
      </div>
    </div>
  )
}
