import SectionTitle from '../ui/SectionTitle'

type Cell = { week: number; pct: number }
type Cohort = { label: string; size: number; cells: Cell[] }

const cohorts: Cohort[] = Array.from({ length: 8 }).map((_, i) => {
  const start = new Date()
  start.setDate(start.getDate() - i * 7)
  const label = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  const base = 42 - i * 2
  return {
    label,
    size: 1000 - i * 60,
    cells: Array.from({ length: 8 }).map((__, w) => ({
      week: w,
      pct: Math.max(0, Math.round((base - w * (4 + i * 0.2)))),
    })),
  }
})

function hue(pct: number) {
  // 0..100 → from slate to brand
  const t = Math.min(100, Math.max(0, pct)) / 100
  const a = 0.12 + t * 0.68
  return `rgba(99,102,241,${a})` // indigo with alpha by strength
}

export default function RetentionHeatmapCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Cohorts & Retention" hint="Weekly cohorts — D1..D56" />

      <div className="panel p-4">
        <div className="overflow-auto">
          <div className="min-w-[720px]">
            {/* Header row */}
            <div className="grid grid-cols-[140px_repeat(8,1fr)] text-xs font-semibold text-slate-700 dark:text-white/80 mb-2">
              <div>Cohort (size)</div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-center">W{i + 1}</div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {cohorts.map((c) => (
                <div key={c.label} className="grid grid-cols-[140px_repeat(8,1fr)] items-center text-xs">
                  <div className="pr-2 truncate">
                    <span className="font-medium text-slate-900 dark:text-white">{c.label}</span>
                    <span className="text-slate-500 dark:text-white/60"> · {c.size.toLocaleString()}</span>
                  </div>
                  {c.cells.map(cell => (
                    <div key={cell.week} className="h-7 rounded-md grid place-items-center"
                      style={{ background: hue(cell.pct) }}>
                      <span className="text-[11px] font-medium text-slate-900/80 dark:text-white/90">{cell.pct}%</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-subtle">
          Retention (% of users from cohort returning in week N). Synthetic demo data.
        </div>
      </div>
    </div>
  )
}