import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'

const IDS = [
  { id: 'section-profile', label: 'Profile' },
  { id: 'section-prefs', label: 'Preferences' },
  { id: 'section-notif', label: 'Notifications' },
  { id: 'section-org', label: 'Organization' },
  { id: 'section-integrations', label: 'Integrations' },
  { id: 'section-audit', label: 'Audit & Privacy' },
  { id: 'section-team', label: 'Team & Roles' },
  { id: 'section-danger', label: 'Danger Zone' },
] as const

export default function SettingsRail() {
  const [active, setActive] = React.useState<string>('section-profile')

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    IDS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="hidden xl:block sticky top-4 h-max sidebar-glass rounded-2xl p-3 mx-[-2px]">
      <nav className="space-y-1">
        {IDS.map((s) => {
          const isActive = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={clsx(
                'group w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-black/8 dark:bg-white/10 text-slate-900 dark:text-white'
                  : 'text-slate-700 dark:text-white/75 hover:bg-black/6 dark:hover:bg-white/6'
              )}
            >
              <span>{s.label}</span>
              <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
            </button>
          )
        })}
      </nav>
    </aside>
  )
}