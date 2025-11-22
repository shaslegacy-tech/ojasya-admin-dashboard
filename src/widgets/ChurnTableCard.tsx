import SectionTitle from '../ui/SectionTitle'
import TableCard from './TableCard'

type Row = {
  id: number
  account: string
  plan: 'Starter' | 'Pro' | 'Enterprise'
  mrr: number
  reason: 'Budget' | 'Missing features' | 'Bugs' | 'Switched vendor' | 'Inactive'
  date: string
}

const rows: Row[] = [
  { id: 1, account: 'Acme Labs', plan: 'Pro', mrr: 29000, reason: 'Switched vendor', date: '2025-10-02' },
  { id: 2, account: 'Nimbus Retail', plan: 'Starter', mrr: 800, reason: 'Budget', date: '2025-10-05' },
  { id: 3, account: 'Hubble AI', plan: 'Enterprise', mrr: 149000, reason: 'Missing features', date: '2025-10-08' },
  { id: 4, account: 'Orbit Fintech', plan: 'Pro', mrr: 29000, reason: 'Bugs', date: '2025-10-11' },
  { id: 5, account: 'Stellar Edu', plan: 'Starter', mrr: 800, reason: 'Inactive', date: '2025-10-12' },
]

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export default function ChurnTableCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Churned Accounts" hint="Last 30 days · top reasons" />

      <TableCard<Row>
        columns={[
          { header: 'Account', accessorKey: 'account' },
          { header: 'Plan', accessorKey: 'plan' },
          {
            header: 'MRR',
            accessorKey: 'mrr',
            cell: ({ getValue }) => <span className="font-medium">{INR.format(getValue<number>())}</span>,
          },
          {
            header: 'Reason',
            accessorKey: 'reason',
            cell: ({ getValue }) => {
              const v = getValue<Row['reason']>()
              const map: Record<Row['reason'], string> = {
                Budget: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
                'Missing features': 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
                Bugs: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
                'Switched vendor': 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
                Inactive: 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
              }
              return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[v]}`}>{v}</span>
            },
          },
          {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ getValue }) =>
              new Date(getValue<string>()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          },
        ]}
        rows={rows}
        searchKeys={['account', 'plan', 'reason']}
        searchPlaceholder="Search churn by account, reason…"
        pageSize={6}
      />
    </div>
  )
}