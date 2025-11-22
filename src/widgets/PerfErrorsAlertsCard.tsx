import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import { AlertTriangle, Bell } from 'lucide-react'
import Button from '../ui/Button'

const series = Array.from({ length: 24 }).map((_, i) => {
  const h = `${i}:00`
  return {
    hour: h,
    p95: 180 + Math.round(40 * Math.sin(i / 3)) + (i % 7 === 0 ? 40 : 0), // ms
    err: 0.25 + Math.max(0, 0.35 * Math.cos(i / 4)) + (i % 9 === 0 ? 0.15 : 0), // %
  }
})

const alerts = [
  { id: 1, sev: 'high',  title: 'Error spike on /api/export', time: '10:34', hint: '+3.1% over baseline' },
  { id: 2, sev: 'med',   title: 'Latency regression (p95)',   time: '09:58', hint: '+120ms over 7d mean' },
  { id: 3, sev: 'low',   title: 'Churn up (24h)',            time: '08:22', hint: '+0.6% WoW' },
]

export default function PerfErrorsAlertsCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Performance & Alerts" hint="Latency, errors, and recent signals" />

      <div className="panel p-4 grid gap-6 md:grid-cols-3">
        {/* Latency */}
        <div className="space-y-1">
          <div className="text-sm text-slate-600 dark:text-white/70">p95 Latency</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity={0.55}/>
                    <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                  formatter={(v: any) => [`${v} ms`, 'p95']}
                />
                <Area dataKey="p95" type="monotone" stroke="rgb(99 102 241)" strokeWidth={2} fill="url(#latGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Errors */}
        <div className="space-y-1">
          <div className="text-sm text-slate-600 dark:text-white/70">Error Rate</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(244 114 182)" stopOpacity={0.55}/>
                    <stop offset="100%" stopColor="rgb(244 114 182)" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                  formatter={(v: any) => [`${(v as number).toFixed(2)}%`, 'Errors']}
                />
                <Area dataKey="err" type="monotone" stroke="rgb(244 114 182)" strokeWidth={2} fill="url(#errGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-white/70">Recent Alerts</div>
            <Button variant="soft" size="sm"><Bell className="h-4 w-4" /> Manage</Button>
          </div>

          <ul className="space-y-2">
            {alerts.map(a => {
              const badge =
                a.sev === 'high' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' :
                a.sev === 'med'  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                                   'bg-sky-500/15 text-sky-600 dark:text-sky-400'
              return (
                <li key={a.id} className="flex items-center justify-between rounded-xl px-3 py-2 bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge}`}>
                      <AlertTriangle className="h-3.5 w-3.5" /> {a.sev.toUpperCase()}
                    </span>
                    <span className="text-sm">{a.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-white/60">{a.time} · {a.hint}</div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}