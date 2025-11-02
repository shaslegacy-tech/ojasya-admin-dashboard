import { Bell, LayoutGrid, Search, Moon, SunMedium, Command, ChevronDown, Plus, User, Settings, LogOut, CreditCard, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../store/theme'

export default function TopNav() {
  const { dark, toggleDark, sidebarCollapsed, toggleSidebar } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const firstItemRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return
      const t = e.target as Node
      if (popRef.current && !popRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Autofocus first item
  useEffect(() => {
    if (open && firstItemRef.current) firstItemRef.current.focus()
  }, [open])

  return (
    <header className="sticky top-0 z-30">
      <div className={clsx('chrome chrome--bottom','flex items-center justify-between gap-3 px-4 py-3')}>
        {/* Left — Collapse + Brand + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/14 transition dark:bg-white/10 dark:hover:bg-white/14"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5 opacity-90" /> : <ChevronLeft className="h-5 w-5 opacity-90" />}
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 shadow dark:bg-white dark:text-slate-900">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="font-semibold">Dashboard</span>
            <span className="opacity-60">/</span>
            <span className="opacity-80">Overview</span>
          </div>
        </div>

        {/* Center — Search / Command */}
        <button className={clsx('group hidden lg:flex items-center gap-3 rounded-2xl px-3 py-2','bg-white/10 hover:bg-white/14 dark:bg-white/10 dark:hover:bg-white/14','transition')} aria-label="Open command palette">
          <Search className="h-4 w-4 opacity-70" />
          <span className="text-sm opacity-70 group-hover:opacity-100">Search or jump to…</span>
          <span className="ml-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] opacity-80 ring-1 ring-white/20">
            <Command className="h-3.5 w-3.5" />
            <span>K</span>
          </span>
        </button>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-white shadow-soft bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 hover:brightness-[1.06] hover:shadow-elevated active:brightness-95">
            <Plus className="h-4 w-4" /> New
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/14 transition">
            <Bell className="h-5 w-5 opacity-90" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-semibold text-white">3</span>
          </button>

          <button onClick={toggleDark} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/14 transition" aria-label="Toggle theme">
            {dark ? <SunMedium className="h-5 w-5 opacity-95" /> : <Moon className="h-5 w-5 opacity-95" />}
          </button>

          {/* Avatar / Account */}
          <div className="relative">
            <button ref={btnRef} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)} className="flex items-center gap-2 rounded-2xl bg-white/10 px-2 py-1 hover:bg-white/14 transition">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 shadow-soft" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-4">Shashi Ojha</p>
                <p className="text-[10px] opacity-70 leading-3">Admin</p>
              </div>
              <ChevronDown className="hidden sm:block h-4 w-4 opacity-70" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div ref={popRef} role="menu" aria-label="Account" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.5 }} className="absolute right-0 mt-2 w-72 rounded-2xl p-1 chrome">
                  <div className="pointer-events-none absolute -top-2 right-8 h-4 w-4 rotate-45 chrome rounded-sm"></div>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 shadow-soft" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">Shashi Ojha</p>
                      <p className="truncate text-xs opacity-70">shashi.ojha@ojasya.com</p>
                    </div>
                  </div>
                  <div className="my-1 h-px bg-white/10" />
                  <MenuItem refEl={firstItemRef} icon={User} label="Profile" onClick={() => setOpen(false)} />
                  <MenuItem icon={Settings} label="Settings" onClick={() => setOpen(false)} />
                  <MenuItem icon={CreditCard} label="Billing" onClick={() => setOpen(false)} />
                  <MenuItem icon={HelpCircle} label="Help & support" onClick={() => setOpen(false)} />
                  <div className="my-1 h-px bg-white/10" />
                  <MenuItem icon={LogOut} label="Sign out" danger onClick={() => setOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuItem({ icon: Icon, label, onClick, danger, refEl }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  danger?: boolean
  refEl?: React.RefObject<HTMLButtonElement>
}) {
  return (
    <button
      ref={refEl}
      role="menuitem"
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
        'hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
        danger ? 'text-rose-400 hover:text-rose-300' : 'opacity-90 hover:opacity-100'
      )}
    >
      <Icon className={clsx('h-4 w-4', danger ? 'opacity-100' : 'opacity-80')} />
      <span className="truncate">{label}</span>
    </button>
  )
}
