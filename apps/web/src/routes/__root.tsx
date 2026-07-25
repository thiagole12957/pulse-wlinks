import { createRootRouteWithContext, Outlet, Link, useLocation } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

// SVG Icons as components (Bitrix24 style - cleaner lines)
const Icons = {
  queue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  pickup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  collapse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
}

interface NavItemConfig {
  to: '/' | '/customers' | '/pickups' | '/reports'
  icon: React.ReactNode
  label: string
  badge?: number
}

const navItems: NavItemConfig[] = [
  { to: '/', icon: Icons.queue, label: 'Fila de Trabalho', badge: 47 },
  { to: '/customers', icon: Icons.customers, label: 'Clientes' },
  { to: '/pickups', icon: Icons.pickup, label: 'Recolhimento', badge: 5 },
  { to: '/reports', icon: Icons.reports, label: 'Relatórios' },
]

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-surface-100">
      {/* Sidebar - Bitrix24 style */}
      <aside
        className={`${
          collapsed ? 'w-[60px]' : 'w-60'
        } fixed left-0 top-0 h-screen bg-white border-r border-surface-200 flex flex-col transition-all duration-200 z-40 shadow-sidebar`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-surface-200">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/images/logo-wlinks.png"
              alt="WLinks"
              className={`${collapsed ? 'w-8 h-8' : 'h-9'} object-contain`}
            />
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="text-base font-semibold text-text-primary">
                  Pulse
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${
                  isActive ? 'nav-item-active' : 'nav-item'
                } relative group`}
                title={collapsed ? item.label : undefined}
              >
                <span className={isActive ? 'text-accent' : 'text-text-muted'}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 text-sm">{item.label}</span>
                )}
                {item.badge && (
                  <span
                    className={`${
                      collapsed
                        ? 'absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px]'
                        : 'px-1.5 py-0.5 text-[10px]'
                    } rounded-full bg-accent text-white font-medium flex items-center justify-center`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-surface-200 space-y-0.5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item w-full justify-center text-text-muted hover:text-text-primary"
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? Icons.expand : Icons.collapse}
            {!collapsed && <span className="flex-1 text-sm">Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 ${
          collapsed ? 'ml-[60px]' : 'ml-60'
        } transition-all duration-200`}
      >
        {/* Top bar - Bitrix24 style */}
        <header className="h-14 bg-white border-b border-surface-200 sticky top-0 z-30 flex items-center justify-between px-4">
          {/* Left side - Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                {Icons.search}
              </span>
              <input
                type="text"
                placeholder="Buscar cliente, CPF, contrato..."
                className="input pl-10 py-1.5 bg-surface-50 border-surface-200 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1">
            <button className="btn-ghost btn-icon relative" title="Sincronizar dados">
              {Icons.sync}
            </button>
            <button className="btn-ghost btn-icon relative pulse-live" title="Notificações">
              {Icons.bell}
            </button>
            <button className="btn-ghost btn-icon" title="Configurações">
              {Icons.settings}
            </button>
            <div className="w-px h-6 bg-surface-200 mx-2" />
            <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-surface-100 transition-colors">
              <div className="avatar-sm">
                TS
              </div>
              <div className="text-left hidden md:flex items-center gap-1">
                <span className="text-sm font-medium text-text-primary">
                  Tiago Silva
                </span>
                {Icons.chevronDown}
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
