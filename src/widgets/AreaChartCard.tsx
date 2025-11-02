import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts'

const data = Array.from({ length: 12 }).map((_, i) => ({
  name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  visits: Math.round(1000 + Math.random()*800),
  signups: Math.round(300 + Math.random()*400)
}))

export default function AreaChartCard() {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Traffic & Conversions</h3>
        <button className="rounded-2xl text-sm px-3 py-1.5 bg-white/10 hover:bg-white/14 dark:bg-white/10 dark:hover:bg-white/14">
          Last 12 months
        </button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeOpacity={0.15} vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} fill="url(#g1)" />
            <Area type="monotone" dataKey="signups" stroke="#60a5fa" strokeWidth={2} fill="url(#g2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
