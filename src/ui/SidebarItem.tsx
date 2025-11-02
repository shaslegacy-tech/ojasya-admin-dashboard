import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function SidebarItem({
  icon: Icon, label, onClick, active = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={clsx(
        'group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium tracking-[0.01em] transition-all',
        // light
        !active && 'text-slate-700 hover:text-slate-900 hover:bg-black/5',
        active   && 'bg-black/5 text-slate-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]',
        // dark
        'dark:text-white',
        !active && 'dark:opacity-85 dark:hover:opacity-100 dark:hover:bg-white/10',
        active   && 'dark:bg-white/20 dark:opacity-100 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]'
      )}
    >
      <Icon className={clsx('h-5 w-5 transition-opacity', active ? 'opacity-100' : 'opacity-90 group-hover:opacity-100')} />
      <span>{label}</span>
    </motion.button>
  )
}