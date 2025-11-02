import clsx from 'clsx'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home, BarChart3, Users2, CreditCard, Settings, ShieldCheck, Sparkles, HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { useThemeStore } from '../store/theme'

type NavItem = {
  icon: any
  label: string
  path: string
  badge?: string | number
}

const navPrimary: NavItem[] = [
  { icon: Home, label: 'Overview', path: '/' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users2, label: 'Users', path: '/users', badge: 4 },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
]

const navSecondary: NavItem[] = [
  { icon: ShieldCheck, label: 'Security', path: '/security' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

function MiniLogo() {
  // Used when collapsed
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow dark:bg-white dark:text-slate-900">
      <Sparkles className="h-5 w-5" />
    </div>
  )
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  // Global UI state (see src/store/theme.ts)
  const { sidebarCollapsed, hoverExpanded, setHoverExpanded } = useThemeStore()

  // Hover delays to avoid jitter
  const enterT = useRef<number | null>(null)
  const leaveT = useRef<number | null>(null)

  const expanded = !sidebarCollapsed || hoverExpanded
  const width = expanded ? 288 : 76 // 72 + padding vs compact

  function onEnter() {
    if (!sidebarCollapsed) return
    if (leaveT.current) { window.clearTimeout(leaveT.current); leaveT.current = null }
    enterT.current = window.setTimeout(() => setHoverExpanded(true), 110) // snappy but not jumpy
  }

  function onLeave(e: React.MouseEvent) {
    if (!sidebarCollapsed) return
    if (enterT.current) { window.clearTimeout(enterT.current); enterT.current = null }
    const to = e.relatedTarget as HTMLElement | null
    if (to && (to.closest('.sidebar') || to.closest('.tooltip'))) return
    leaveT.current = window.setTimeout(() => setHoverExpanded(false), 260)
  }

  function Item({ icon: Icon, label, path, badge }: NavItem) {
    const active = pathname === path || (path !== '/' && pathname.startsWith(path))

    return (
      <div className="relative">
        {/* Animated gradient accent rail (left) */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="activeRail"
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[4px] rounded-r-full bg-gradient-to-b from-violet-400 via-indigo-300 to-sky-300 shadow-[0_0_12px_rgba(139,92,246,0.55)]"
              transition={{ type: 'spring', stiffness: 600, damping: 42, mass: 0.45 }}
            />
          )}
        </AnimatePresence>

        <button
          onClick={() => navigate(path)}
          className={clsx(
            'group sidebar-item w-full pl-4 pr-2 relative',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-2xl',
            'text-slate-800 dark:text-white', // stronger default for light mode
            active
              ? 'sidebar-item--active text-slate-900 dark:text-white'
              : 'hover:bg-black/5 hover:text-slate-900 dark:hover:bg-white/10'
          )}
        >
          <Icon className={clsx('h-5 w-5 opacity-90 transition-transform group-hover:scale-[1.03]', active && 'drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]')} />

          {/* Label: always visible in light, gated by expand in dark */}
          <AnimatePresence initial={false}>
            {(expanded || !isDark) && (
              <motion.span
                key="lbl"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium tracking-[0.01em]"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Optional badge (only when expanded) */}
          <AnimatePresence initial={false}>
            {expanded && badge !== undefined && (
              <motion.span
                key="badge"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-lg px-1.5 py-0.5 text-[10px] font-semibold bg-white/12 text-black/90 dark:text-white"
              >
                {badge}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Premium layered active background */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="sidebarActiveBg"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
              transition={{ type: 'spring', stiffness: 520, damping: 36, mass: 0.5 }}
            >
              {/* Soft glow aura */}
              <div className="absolute -inset-1 rounded-3xl bg-white/10 blur-lg opacity-70" />
              {/* Main pill with gradient and ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 ring-1 ring-white/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip when collapsed */}
        {!expanded && (
          <div className="relative tooltip">
            <div className="absolute left-[84px] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2">
              <div className="tooltip-bubble">{label}</div>
              <div className="tooltip-arrow" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.aside
      className={clsx('sidebar sidebar-glass fixed inset-y-0 left-0 z-40 overflow-y-auto flex flex-col')}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ width }}
      initial={false}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-2 px-4">
        <MiniLogo />

        {/* Brand fades in when expanded */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
            >
              <p className="text-sm font-bold tracking-wide">Ojasya Dashboard</p>
              <p className="text-[10px] uppercase tracking-[0.2em] !text-slate-500 dark:!text-white/45">Premium</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top separator */}
      <div className="mx-3 my-2 h-px bg-white/10" />

      <nav className="px-3 pb-3 flex-1">
        {/* Main label */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="mainLbl"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
             className="section-label mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
            >
              Main
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          {navPrimary.map((i) => <Item key={i.path} {...i} />)}
        </div>

        {/* Secondary label */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="moreLbl"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="section-label mt-4 mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.25em]"
            >
              More
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          {navSecondary.map((i) => <Item key={i.path} {...i} />)}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3">
        <div className="mx-0 my-2 h-px bg-white/10" />
        <button
          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-xs dark:text-white/85 hover:bg-white/10 transition"
          onClick={() => alert('Help & Support coming soon')}
        >
          <HelpCircle className="h-4 w-4 opacity-85" />
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                key="help"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
              >
                Help & Support
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="flex items-center justify-between px-2 pt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span>Stable</span>
          {expanded && <span>v1.0.0</span>}
        </div>
      </div>
    </motion.aside>
  )
}