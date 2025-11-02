import KPI from '../ui/KPI'
import Button from '../ui/Button'
import AreaChartCard from '../widgets/AreaChartCard'
import UsersTable from '../widgets/UsersTable'

// Recharts imports (already in dependencies)
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar
} from 'recharts'

// ---------- Realistic monthly metrics (dummy production-like data) ----------
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// These would normally come from your API. You can wire them later.
const monthlyMetrics = [
  { m: 'Jan', revenue: 102_400, users: 18450, churn: 1.4, arpu: 5.55, mrrStarter: 18_000, mrrPro: 52_000, mrrEnt: 32_400, nps: 62 },
  { m: 'Feb', revenue: 107_900, users: 19120, churn: 1.35, arpu: 5.64, mrrStarter: 19_200, mrrPro: 54_300, mrrEnt: 34_400, nps: 63 },
  { m: 'Mar', revenue: 115_300, users: 19880, churn: 1.3, arpu: 5.80, mrrStarter: 20_100, mrrPro: 57_200, mrrEnt: 38_000, nps: 65 },
  { m: 'Apr', revenue: 118_700, users: 20550, churn: 1.28, arpu: 5.78, mrrStarter: 20_900, mrrPro: 58_600, mrrEnt: 39_200, nps: 66 },
  { m: 'May', revenue: 121_900, users: 21240, churn: 1.25, arpu: 5.74, mrrStarter: 21_300, mrrPro: 60_200, mrrEnt: 40_400, nps: 66 },
  { m: 'Jun', revenue: 125_600, users: 21980, churn: 1.22, arpu: 5.72, mrrStarter: 21_800, mrrPro: 61_900, mrrEnt: 41_900, nps: 67 },
  { m: 'Jul', revenue: 129_400, users: 22510, churn: 1.2, arpu: 5.74, mrrStarter: 22_100, mrrPro: 63_500, mrrEnt: 43_800, nps: 68 },
  { m: 'Aug', revenue: 132_800, users: 23200, churn: 1.18, arpu: 5.72, mrrStarter: 22_600, mrrPro: 64_100, mrrEnt: 46_100, nps: 69 },
  { m: 'Sep', revenue: 135_900, users: 23990, churn: 1.16, arpu: 5.66, mrrStarter: 22_900, mrrPro: 66_000, mrrEnt: 47_000, nps: 69 },
  { m: 'Oct', revenue: 138_300, users: 24580, churn: 1.15, arpu: 5.63, mrrStarter: 23_100, mrrPro: 67_200, mrrEnt: 48_000, nps: 70 },
  { m: 'Nov', revenue: 142_600, users: 25240, churn: 1.14, arpu: 5.65, mrrStarter: 23_300, mrrPro: 69_400, mrrEnt: 49_900, nps: 70 },
  { m: 'Dec', revenue: 148_900, users: 25980, churn: 1.12, arpu: 5.73, mrrStarter: 23_600, mrrPro: 72_300, mrrEnt: 53_000, nps: 71 },
]

const planShare = [
  { name: 'Starter', value: 24 },
  { name: 'Pro', value: 51 },
  { name: 'Enterprise', value: 25 },
]

const kpis = [
  { title: 'Revenue', value: '₹128,940', change: '+12.3%', trend: 'up' as const },
  { title: 'Active Users', value: '24,581', change: '+3.8%', trend: 'up' as const },
  { title: 'Churn', value: '1.2%', change: '-0.2%', trend: 'down' as const },
  { title: 'NPS', value: '68', change: '+4', trend: 'up' as const },
]

const COLORS = ['#8b5cf6', '#60a5fa', '#22d3ee', '#f472b6', '#facc15']

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass p-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full blur-3xl bg-violet-500/30 dark:bg-violet-400/35" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full blur-3xl bg-indigo-500/25 dark:bg-indigo-400/30" />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.25em] text-subtle">Welcome back</p>
          <h2 className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight">Your premium dashboard</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">Monitor revenue, user growth, and product health with a clean, luxurious UI.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="brand" size="lg">Generate Report</Button>
            <Button variant="ghost" size="lg">Create Segment</Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => <KPI key={k.title} {...k} />)}
      </div>

      {/* Existing traffic area chart */}
      <AreaChartCard />

      {/* ---------- New premium chart grid ---------- */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* 1) MRR by Plan (Stacked Bars) */}
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">MRR by Plan</h3>
            <span className="text-xs opacity-70">Last 12 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyMetrics} margin={{ left: 0, right: 0, top: 10 }}>
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="mrrStarter" stackId="mrr" fill="#60a5fa" name="Starter" />
                <Bar dataKey="mrrPro" stackId="mrr" fill="#8b5cf6" name="Pro" />
                <Bar dataKey="mrrEnt" stackId="mrr" fill="#22d3ee" name="Enterprise" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2) Revenue vs Active Users (Dual Axis Lines) */}
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Revenue vs Active Users</h3>
            <span className="text-xs opacity-70">Last 12 months</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyMetrics} margin={{ left: 0, right: 0, top: 10 }}>
                <CartesianGrid strokeOpacity={0.15} vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue"  stroke="#8b5cf6" strokeWidth={2} dot={false} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="users"    stroke="#60a5fa" strokeWidth={2} dot={false} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3) Plan Distribution (Donut) + NPS (Radial) */}
        <div className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Plan Distribution & NPS</h3>
            <span className="text-xs opacity-70">Current snapshot</span>
          </div>
          <div className="grid grid-cols-2 gap-2 h-64">
            {/* Donut */}
            <div className="relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={planShare}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="85%"
                    stroke="none"
                  >
                    {planShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-semibold">Plans</div>
                  <div className="text-xs opacity-70">100%</div>
                </div>
              </div>
            </div>

            {/* Radial NPS */}
            <div className="relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="85%"
                  barSize={10}
                  data={[{ name: 'NPS', value: monthlyMetrics[monthlyMetrics.length - 1].nps }]}
                >
                  <RadialBar
                    dataKey="value"
                    minAngle={15}
                    clockWise
                    fill="#8b5cf6"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold">{monthlyMetrics[monthlyMetrics.length - 1].nps}</div>
                  <div className="text-xs opacity-70">NPS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Customers table */}
      <UsersTable />
    </div>
  )
}
