import * as React from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, Plus, Trash2, Star, Download, ArrowUpRight, ArrowDownRight, Shield, Info } from 'lucide-react'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'
import TableCard from '../widgets/TableCard'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

// ===== Mock data =====
type Invoice = {
  id: number
  number: string
  date: string
  period: string
  amount: number
  status: 'Paid' | 'Due'
}
const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

const invoices: Invoice[] = [
  { id: 1, number: 'INV-10251', date: '2025-10-11', period: 'Sep 01–30', amount: 2900, status: 'Paid' },
  { id: 2, number: 'INV-10250', date: '2025-09-10', period: 'Aug 01–31', amount: 2900, status: 'Paid' },
  { id: 3, number: 'INV-10249', date: '2025-08-11', period: 'Jul 01–31', amount: 2900, status: 'Paid' },
  { id: 4, number: 'INV-10248', date: '2025-07-11', period: 'Jun 01–30', amount: 2900, status: 'Paid' },
  { id: 5, number: 'INV-10247', date: '2025-06-11', period: 'May 01–31', amount: 2900, status: 'Paid' },
]

const usageSeries = Array.from({ length: 12 }).map((_, i) => {
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]
  const units = 120 + i*14 + Math.round(20*Math.sin(i/2))
  const cost = 1200 + i*180 + Math.round(100*Math.cos(i/3))
  return { month: m, units, cost }
})

const paymentMethods = [
  { id: 'pm_1', brand: 'Visa', last4: '4242', exp: '04/28', default: true },
  { id: 'pm_2', brand: 'Mastercard', last4: '4444', exp: '07/27', default: false },
]

/* =========================
   Autosave helper (debounced localStorage)
   ========================= */
function useAutosaveLocal<T extends object>(key: string, initial: T) {
  const [data, setData] = React.useState<T>(() => {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : initial
  })
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle')

  React.useEffect(() => {
    setStatus('saving')
    const id = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data))
      setStatus('saved')
      const back = setTimeout(() => setStatus('idle'), 1200)
      return () => clearTimeout(back)
    }, 500)
    return () => clearTimeout(id)
  }, [data, key])

  return { data, setData, status }
}

/* =========================
   Validation utils (IN)
   ========================= */
const PIN_RE   = /^[1-9][0-9]{5}$/    // India PIN (6 digits, cannot start with 0)
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i
const PAN_RE   = /^[A-Z]{5}[0-9]{4}[A-Z]$/i

/* =========================
   Coupon & Credits
   ========================= */
function CouponCreditsCard() {
  const [coupon, setCoupon] = React.useState('')
  const [applied, setApplied] = React.useState<{ code: string; percent?: number; amount?: number } | null>(null)
  const [credits, setCredits] = React.useState(1200) // ₹ credits

  function apply() {
    const code = coupon.trim().toUpperCase()
    if (!code) return
    // mock rules
    if (code === 'SAVE20') setApplied({ code, percent: 20 })
    else if (code === 'WELCOME500') setApplied({ code, amount: 500 })
    else setApplied({ code, amount: 0 })
    setCoupon('')
  }
  function remove() {
    setApplied(null)
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="Coupons & Credits" hint="Apply promo codes and view credit balance" />
      <div className="panel p-4 space-y-3">
        {/* Apply coupon */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="flex-1">
            <label className="text-xs text-subtle">Promo code</label>
            <div className="mt-1 p-[1.5px] rounded-2xl bg-transparent focus-within:bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60 transition">
              <div className="flex h-10 items-center gap-2 rounded-[14px] bg-white/80 dark:bg-white/5 backdrop-blur px-3">
                <input
                  value={coupon}
                  onChange={(e)=>setCoupon(e.target.value)}
                  placeholder="e.g. SAVE20"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>
          </div>
          <Button variant="brand" onClick={apply} disabled={!coupon.trim()}>Apply</Button>
        </div>

        {/* Applied badge */}
        {applied && (
          <div className="flex items-center justify-between rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2">
            <div className="text-sm">
              Applied: <span className="font-semibold">{applied.code}</span>{' '}
              {applied.percent ? `– ${applied.percent}% off` : applied.amount ? `– ₹${applied.amount}` : '(invalid)'}
            </div>
            <Button variant="outline" size="sm" onClick={remove}>Remove</Button>
          </div>
        )}

        {/* Credits balance */}
        <div className="rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2 text-sm flex items-center justify-between">
          <span>Account credits</span>
          <span className="font-semibold">₹{credits.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}

/* =========================
   GST Invoice Settings
   ========================= */
function InvoiceSettingsCard() {
  const { data, setData, status } = useAutosaveLocal('billing.invoice', {
    company: '',
    gstin: '',
    pan: '',
  })

  const validGST  = !data.gstin || GSTIN_RE.test(data.gstin)
  const validPAN  = !data.pan || PAN_RE.test(data.pan)

  return (
    <div className="space-y-2">
      <SectionTitle label="Invoice Settings (GST)" hint="These details appear on your invoices" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs text-subtle">Company name</label>
            <input
              value={data.company}
              onChange={(e)=>setData({ ...data, company: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Your Pvt Ltd"
            />
          </div>

          <div>
            <label className="text-xs text-subtle">GSTIN</label>
            <input
              value={data.gstin}
              onChange={(e)=>setData({ ...data, gstin: e.target.value.toUpperCase() })}
              className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                validGST ? 'border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 focus:ring-[rgba(139,92,246,0.35)]'
                         : 'border-rose-400/60 bg-rose-500/5 focus:ring-rose-400/40'
              }`}
              placeholder="22AAAAA0000A1Z5"
            />
            {!validGST && <p className="mt-1 text-xs text-rose-600">Invalid GSTIN format.</p>}
          </div>

          <div>
            <label className="text-xs text-subtle">PAN</label>
            <input
              value={data.pan}
              onChange={(e)=>setData({ ...data, pan: e.target.value.toUpperCase() })}
              className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                validPAN ? 'border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 focus:ring-[rgba(139,92,246,0.35)]'
                         : 'border-rose-400/60 bg-rose-500/5 focus:ring-rose-400/40'
              }`}
              placeholder="ABCDE1234F"
            />
            {!validPAN && <p className="mt-1 text-xs text-rose-600">Invalid PAN format.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================
   Billing Address (autosave)
   ========================= */
function BillingAddressCard() {
  const { data, setData, status } = useAutosaveLocal('billing.address', {
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  })

  const validPIN = !data.pin || PIN_RE.test(data.pin)

  return (
    <div className="space-y-2">
      <SectionTitle label="Billing Address" hint="Used for tax invoices and receipts" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs text-subtle">Full name / Company</label>
            <input
              value={data.name}
              onChange={(e)=>setData({ ...data, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Arjun Singh / Your Pvt Ltd"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-subtle">Address line 1</label>
            <input
              value={data.line1}
              onChange={(e)=>setData({ ...data, line1: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Street, Area"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-subtle">Address line 2 (optional)</label>
            <input
              value={data.line2}
              onChange={(e)=>setData({ ...data, line2: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Apartment, Suite"
            />
          </div>

          <div>
            <label className="text-xs text-subtle">City</label>
            <input
              value={data.city}
              onChange={(e)=>setData({ ...data, city: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="text-xs text-subtle">State</label>
            <input
              value={data.state}
              onChange={(e)=>setData({ ...data, state: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="Maharashtra"
            />
          </div>

          <div>
            <label className="text-xs text-subtle">PIN</label>
            <input
              value={data.pin}
              onChange={(e)=>setData({ ...data, pin: e.target.value })}
              className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${
                validPIN ? 'border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 focus:ring-[rgba(139,92,246,0.35)]'
                         : 'border-rose-400/60 bg-rose-500/5 focus:ring-rose-400/40'
              }`}
              placeholder="400001"
            />
            {!validPIN && <p className="mt-1 text-xs text-rose-600">Invalid PIN code.</p>}
          </div>

          <div>
            <label className="text-xs text-subtle">Country</label>
            <input
              value={data.country}
              onChange={(e)=>setData({ ...data, country: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              placeholder="India"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Page =====
export default function Billing() {
  const [methods, setMethods] = React.useState(paymentMethods)

  function setDefault(id: string) {
    setMethods((m) => m.map(x => ({ ...x, default: x.id === id })))
  }
  function removeMethod(id: string) {
    setMethods((m) => m.filter(x => x.id !== id))
  }
  function addMethod() {
    // stub: open modal / payment sheet
    alert('Add payment method sheet coming soon.')
  }

  const currentPlan = { name: 'Pro', price: 2900, cadence: 'mo', seats: 10, projects: 'Unlimited', support: 'Priority' }
  const nextCharge = { date: '11 Nov 2025', amount: 2900, note: 'Includes taxes' }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Billing</h2>
          <p className="text-sm text-slate-600 dark:text-white/60">Plan, payments, invoices & usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="soft" size="md"><Download className="h-4 w-4" /> Export CSV</Button>
          <Button variant="brand" size="md"><Shield className="h-4 w-4" /> Manage in Portal</Button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left – content */}
        <div className="space-y-6">
          <PlanCard plan={currentPlan} />
          <PaymentMethods methods={methods} onDefault={setDefault} onRemove={removeMethod} onAdd={addMethod} />

          {/* NEW */}
          <CouponCreditsCard />
          <InvoiceSettingsCard />
          <BillingAddressCard />

          <UsageCard />
          <InvoicesTable />
        </div>

        {/* Right – summary */}
        <SummarySidebar nextCharge={nextCharge} />
      </div>
    </motion.div>
  )
}

/* ========= Widgets ========= */

function PlanCard({ plan }: { plan: { name: string; price: number; cadence: string; seats: number; projects: string; support: string } }) {
  return (
    <div className="space-y-2">
      <SectionTitle label="Current Plan" hint="Manage subscription & limits" />
      <div className="panel p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 text-white shadow-md">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900 dark:text-white">{plan.name} · {INR.format(plan.price)}/{plan.cadence}</div>
            <div className="text-xs text-slate-600 dark:text-white/60">
              {plan.seats} seats · {plan.projects} projects · {plan.support} support
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="soft"><ArrowDownRight className="h-4 w-4" /> Downgrade</Button>
          <Button variant="brand"><ArrowUpRight className="h-4 w-4" /> Upgrade</Button>
        </div>
      </div>
    </div>
  )
}

function PaymentMethods({
  methods,
  onDefault,
  onRemove,
  onAdd
}: {
  methods: { id: string; brand: string; last4: string; exp: string; default: boolean }[]
  onDefault: (id: string) => void
  onRemove: (id: string) => void
  onAdd: () => void
}) {
  return (
    <div className="space-y-2">
      <SectionTitle label="Payment Methods" hint="Default card used for next charge" />
      <div className="panel p-4 space-y-3">
        {methods.length === 0 && (
          <div className="rounded-xl bg-black/5 dark:bg-white/5 p-4 text-sm text-slate-600 dark:text-white/70">
            No payment method on file.
          </div>
        )}

        {methods.map(m => (
          <motion.div
            key={m.id}
            className="flex items-center justify-between rounded-2xl px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-white/80 dark:bg-white/5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10">
                <CreditCard className="h-4 w-4 opacity-80" />
              </div>
              <div className="leading-tight">
                <div className="font-medium text-slate-900 dark:text-white">
                  {m.brand} ···· {m.last4} {m.default && <span className="ml-1 text-[11px] rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">Default</span>}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-white/60">Exp {m.exp}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {!m.default && (
                <Button variant="soft" size="sm" onClick={() => onDefault(m.id)}>
                  <Star className="h-4 w-4" /> Make Default
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onRemove(m.id)}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>
          </motion.div>
        ))}

        <Button variant="ghost" onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add Payment Method
        </Button>
      </div>
    </div>
  )
}

function UsageCard() {
  const total = usageSeries[usageSeries.length - 1].cost
  return (
    <div className="space-y-2">
      <SectionTitle label="Usage & Forecast" hint="Units consumed & monthly cost" />
      <div className="panel p-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageSeries} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="uCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity={0.55}/>
                  <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity={0.06}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(v: any, n: any) => n === 'cost' ? [INR.format(v as number), 'Cost'] : [String(v), 'Units']}
              />
              <Area dataKey="cost" stroke="rgb(99 102 241)" strokeWidth={2} fill="url(#uCost)" type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-subtle">Latest month</div>
          <div className="font-semibold text-slate-900 dark:text-white">{INR.format(total)}</div>
        </div>
      </div>
    </div>
  )
}

function InvoicesTable() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Invoices" hint="Download PDF receipts & CSV" />
      <TableCard<Invoice>
        columns={[
          { header: 'Invoice #', accessorKey: 'number' },
          {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          },
          { header: 'Period', accessorKey: 'period' },
          {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ getValue }) => <span className="font-medium">{INR.format(getValue<number>())}</span>,
          },
          {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
              const v = getValue<'Paid' | 'Due'>()
              const cls = v === 'Paid'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{v}</span>
            },
          },
        ]}
        rows={invoices}
        searchKeys={['number', 'period', 'status']}
        searchPlaceholder="Search invoice by number, status…"
        pageSize={6}
        rightActions={
          <>
            <Button variant="soft" size="sm"><Download className="h-4 w-4" /> Export</Button>
          </>
        }
      />
    </div>
  )
}

function SummarySidebar({ nextCharge }: { nextCharge: { date: string; amount: number; note: string } }) {
  return (
    <div className="space-y-2 xl:sticky xl:top-4 h-max">
      <SectionTitle label="Summary" hint="Next charge & credits" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-white/70">Next charge</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{INR.format(nextCharge.amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-white/70">On</span>
          <span className="text-sm font-medium">{nextCharge.date}</span>
        </div>
        <div className="rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 text-xs text-slate-600 dark:text-white/70 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 opacity-70" />
          <span>{nextCharge.note}. Update card or plan to change this.</span>
        </div>
        <div className="pt-2 flex gap-2">
          <Button variant="outline" className="flex-1">Update Address</Button>
          <Button variant="brand" className="flex-1">Download Statement</Button>
        </div>
      </div>
    </div>
  )
}