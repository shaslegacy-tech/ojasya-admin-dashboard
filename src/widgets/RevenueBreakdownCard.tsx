import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'
import { Download } from 'lucide-react'

const mrrData = [
  { month: 'Jan', mrr: 120000 },
  { month: 'Feb', mrr: 138000 },
  { month: 'Mar', mrr: 152000 },
  { month: 'Apr', mrr: 158000 },
  { month: 'May', mrr: 169000 },
  { month: 'Jun', mrr: 181000 },
  { month: 'Jul', mrr: 192000 },
  { month: 'Aug', mrr: 205000 },
  { month: 'Sep', mrr: 212000 },
  { month: 'Oct', mrr: 224000 },
  { month: 'Nov', mrr: 238000 },
  { month: 'Dec', mrr: 250000 },
]

const mix = [
  { name: 'Starter', value: 22 },
  { name: 'Pro', value: 48 },
  { name: 'Enterprise', value: 30 },
]

const COLORS = ['#60a5fa', '#a78bfa', '#f472b6'] // light/dark friendly

export default function RevenueBreakdownCard() {
  const totalMRR = useMemo(() => mrrData[mrrData.length - 1].mrr, [])

  return (
    <div className="space-y-2">
      <SectionTitle label="Revenue Breakdown" hint="MRR trend & plan mix" />

      <div className="panel p-4 grid gap-6 md:grid-cols-3">
        {/* Left: MRR trend */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between pb-2">
            <div className="text-sm text-slate-600 dark:text-white/70">Monthly Recurring Revenue</div>
            <Button variant="soft" size="sm"><Download className="h-4 w-4" /> Export</Button>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'MRR']}
                />
                <Area
                  dataKey="mrr"
                  stroke="rgb(99 102 241)"
                  strokeWidth={2}
                  fill="url(#mrrGrad)"
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 text-sm">
            <span className="text-subtle">Total:</span>{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              ₹{totalMRR.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right: Plan mix */}
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-white/70">Plan Mix</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {mix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                  formatter={(v: any, n: any) => [`${v}%`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-1 text-sm">
            {mix.map((m, i) => (
              <li key={m.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1">{m.name}</span>
                <span className="font-semibold">{m.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}