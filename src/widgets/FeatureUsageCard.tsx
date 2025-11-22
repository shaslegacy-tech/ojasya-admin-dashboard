import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'
import { SlidersHorizontal } from 'lucide-react'

type Row = { feature: string; mau: number }
const raw: Row[] = [
  { feature: 'Dashboards', mau: 5200 },
  { feature: 'Exports', mau: 4300 },
  { feature: 'Automations', mau: 3100 },
  { feature: 'Integrations', mau: 2600 },
  { feature: 'Alerts', mau: 2100 },
  { feature: 'Billing', mau: 1400 },
  { feature: 'Audit Log', mau: 900 },
]

const data = (() => {
  const sorted = [...raw].sort((a, b) => b.mau - a.mau)
  const total = sorted.reduce((s, r) => s + r.mau, 0)
  let acc = 0
  return sorted.map((r) => {
    acc += r.mau
    return { ...r, cum: Math.round((acc / total) * 100) }
  })
})()

export default function FeatureUsageCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Feature Usage" hint="Pareto — MAU by feature" />

      <div className="panel p-4">
        <div className="flex items-center justify-between pb-2">
          <div className="text-sm text-slate-600 dark:text-white/70">Last 30 days</div>
          <Button variant="outline" size="sm"><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis dataKey="feature" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                formatter={(v: any, n: any) => (n === 'cum' ? [`${v}%`, 'Cumulative'] : [`${v.toLocaleString()}`, 'MAU'])}
              />
              <Bar yAxisId="left" dataKey="mau" radius={[8, 8, 0, 0]} fill="rgba(99,102,241,0.85)" />
              <Line yAxisId="right" dataKey="cum" type="monotone" stroke="rgb(244,114,182)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}