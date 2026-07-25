import { createRootRouteWithContext, Outlet, Link, useLocation } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

// SVG Icons as components
const Icons = {
  queue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  pickup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  collapse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  sync: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
  { to: '/', icon: Icons.queue, label: 'Fila', badge: 47 },
  { to: '/customers', icon: Icons.customers, label: 'Clientes' },
  { to: '/pickups', icon: Icons.pickup, label: 'Recolhimento', badge: 5 },
  { to: '/reports', icon: Icons.reports, label: 'Relatórios' },
]

function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-[72px]' : 'w-64'
        } fixed left-0 top-0 h-screen bg-surface-800 border-r border-surface-700 flex flex-col transition-all duration-300 z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-700">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center text-surface-900 shadow-glow-accent">
              {Icons.pulse}
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <span className="font-display text-lg font-bold text-text-primary tracking-tight">
                  Pulse
                </span>
                <span className="block text-[10px] text-text-muted uppercase tracking-widest">
                  WLinks
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                {item.icon}
                {!collapsed && (
                  <span className="flex-1 animate-fade-in">{item.label}</span>
                )}
                {item.badge && (
                  <span
                    className={`${
                      collapsed
                        ? 'absolute -top-1 -right-1 w-5 h-5 text-[10px]'
                        : 'px-2 py-0.5 text-xs'
                    } rounded-full bg-accent/20 text-accent font-medium flex items-center justify-center`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-surface-700 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item w-full justify-center"
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            {collapsed ? Icons.expand : Icons.collapse}
            {!collapsed && <span className="flex-1">Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 ${
          collapsed ? 'ml-[72px]' : 'ml-64'
        } transition-all duration-300`}
      >
        {/* Top bar */}
        <header className="h-16 bg-surface-800/80 backdrop-blur-xl border-b border-surface-700 sticky top-0 z-30 flex items-center justify-between px-6">
          {/* Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                {Icons.search}
              </span>
              <input
                type="text"
                placeholder="Buscar cliente, CPF, contrato..."
                className="input pl-10 bg-surface-700/50 border-transparent focus:bg-surface-700 focus:border-surface-600"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-surface-700 text-text-muted text-xs rounded font-mono hidden md:block">
                /
              </kbd>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-icon relative pulse-live" title="Notificações">
              {Icons.bell}
            </button>
            <button className="btn-ghost btn-icon" title="Sincronizar IXC">
              {Icons.sync}
            </button>
            <div className="w-px h-8 bg-surface-700 mx-2" />
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-surface-700 transition-colors">
              <div className="avatar-sm bg-accent/20 text-accent">
                TS
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-text-primary">
                  Tiago Silva
                </div>
                <div className="text-xs text-text-muted">Operador</div>
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
