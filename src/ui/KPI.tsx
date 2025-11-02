import { motion } from 'framer-motion'

export default function KPI({
  title, value, change, trend
}: { title: string; value: string; change: string; trend: 'up' | 'down' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-subtle">{title}</p>
        {trend === 'up' ? (
          <span className="text-xs rounded-full bg-emerald-500/15 text-emerald-700 px-2 py-0.5 dark:bg-emerald-500/10 dark:text-emerald-400">{change}</span>
        ) : (
          <span className="text-xs rounded-full bg-rose-500/15 text-rose-700 px-2 py-0.5 dark:bg-rose-500/10 dark:text-rose-400">{change}</span>
        )}
      </div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">{value}</h3>
      <div className="mt-4 h-10 w-full rounded-lg bg-gradient-to-r from-black/10 via-black/0 to-black/10 dark:from-white/10 dark:via-white/0 dark:to-white/10" />
    </motion.div>
  )
}
