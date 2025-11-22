import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'
import { Filter } from 'lucide-react'

const steps = [
  { step: 'Visit', count: 42000, rate: 100, delta: +4.1 },
  { step: 'Signup', count: 9800, rate: 23.3, delta: +2.2 },
  { step: 'Activate', count: 7100, rate: 16.9, delta: +1.1 },
  { step: 'Subscribe', count: 2050, rate: 4.9, delta: +0.6 },
]

export default function FunnelCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Acquisition Funnel" hint="Step conversion & drop-off" />

      <div className="panel p-4">
        <div className="flex items-center justify-between pb-2">
          <div className="text-sm text-slate-600 dark:text-white/70">Last 30 days</div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Segment</Button>
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={steps} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
              <XAxis dataKey="step" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                formatter={(v: any, n: any, { payload }: any) => {
                  if (n === 'count') return [`${v.toLocaleString()}`, 'Leads']
                  return [`${payload.rate}%`, 'Conversion']
                }}
                labelFormatter={(l) => `Step: ${l}`}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="rgba(99,102,241,0.85)">
                <LabelList dataKey="rate" position="top" formatter={(v: any) => `${v}%`} className="text-xs fill-current" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {steps.map(s => (
            <li key={s.step} className="flex items-center justify-between rounded-xl bg-black/5 dark:bg-white/5 px-2 py-1">
              <span className="font-medium">{s.step}</span>
              <span className={s.delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}>
                {s.delta >= 0 ? '+' : ''}{s.delta}% WoW
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}