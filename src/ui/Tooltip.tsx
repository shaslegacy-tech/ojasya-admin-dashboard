import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function Tooltip({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // simple fade in
    requestAnimationFrame(() => (el.style.opacity = '1'))
    return () => {
      if (el) el.style.opacity = '0'
    }
  }, [])

  return (
    <div
      ref={ref}
      className={clsx(
        'pointer-events-none absolute left-[84px] top-1/2 -translate-y-1/2',
        'rounded-xl px-2.5 py-1 text-xs text-white bg-black/80 dark:bg-white/10 dark:backdrop-blur',
        'shadow-lg ring-1 ring-white/15',
        'opacity-0 transition-opacity duration-150',
        className
      )}
    >
      {label}
      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 bg-black/80 dark:bg-white/10"></div>
    </div>
  )
}
