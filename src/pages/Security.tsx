import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, KeyRound, Lock, Smartphone, Bell, Eye, EyeOff,Shield,
  Copy, Trash2, Plus, CheckCircle2, AlertTriangle, LogOut, Globe, Cpu, Building2, GlobeLock,Upload, Download as DownloadIcon  
} from 'lucide-react'

import SectionTitle from '../ui/SectionTitle'
import Button from '../ui/Button'
import TableCard from '../widgets/TableCard'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts'

/* =========================
   Mock data
   ========================= */
type Session = {
  id: number
  device: string
  ip: string
  location: string
  lastSeen: string
  trusted: boolean
}

const sessions: Session[] = [
  { id: 1, device: 'MacBook Pro (Safari)', ip: '103.51.34.12', location: 'Mumbai, IN', lastSeen: '2025-11-05 10:35', trusted: true },
  { id: 2, device: 'Pixel 7 (Chrome)',    ip: '103.51.34.13', location: 'Pune, IN',   lastSeen: '2025-11-04 20:12', trusted: true },
  { id: 3, device: 'Windows (Edge)',       ip: '103.51.34.22', location: 'Delhi, IN',  lastSeen: '2025-11-03 09:41', trusted: false },
]

type ApiKey = { id: string; name: string; prefix: string; created: string; lastUsed?: string; scopes: string[] }
const seedKeys: ApiKey[] = [
  { id: 'k_live_1', name: 'Production Service', prefix: 'pk_live_9JY', created: '2025-08-12', lastUsed: '2025-11-05', scopes: ['read', 'write'] },
  { id: 'k_live_2', name: 'Analytics ETL',      prefix: 'pk_live_K3Q', created: '2025-10-01', lastUsed: '2025-11-02', scopes: ['read'] },
]

const loginSeries = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i))
  const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  const ok = 120 + Math.round(30 * Math.sin(i / 3)) + (i % 6 === 0 ? 20 : 0)
  const fail = 6 + Math.max(0, Math.round(3 * Math.cos(i / 2))) + (i % 8 === 0 ? 3 : 0)
  return { day: label, ok, fail }
})

/* =========================
   Page
   ========================= */
export default function SecurityPage() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10">
            <ShieldCheck className="h-5 w-5 opacity-80" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Security</h2>
            <p className="text-sm text-slate-600 dark:text-white/60">Protect your account, sessions, and API access</p>
          </div>
        </div>
        <Button variant="brand"><Bell className="h-4 w-4" /> Security Alerts</Button>
      </div>

      {/* ROW 1: Posture + 2FA + Password */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <SecurityPostureCard />
        <TwoFactorCard />
        <PasswordCard />
      </div>

      {/* ROW 2: Sessions + Login Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SessionsCard />
        <LoginActivityCard />
      </div>

      {/* ROW 3: API Keys & Webhooks */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ApiKeysCard />
        <RecommendationsCard />
      </div>
      {/* ROW 4: IP Allowlist + SSO */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IpAllowlistCard />
        <SsoCard />
      </div>
    </motion.div>
  )
}

/* ========= Widgets ========= */

/* Security posture score, quick wins */
function SecurityPostureCard() {
  const checks = [
    { ok: true,  label: '2FA enabled' },
    { ok: true,  label: 'Recent password change (< 90d)' },
    { ok: false, label: 'IP allowlist not configured' },
    { ok: false, label: 'SSO not enforced' },
  ]
  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100)

  return (
    <div className="space-y-2">
      <SectionTitle label="Security Posture" hint="Overall protection & recommendations" />
      <div className="panel p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-white/70">Current Score</div>
          <span className="text-sm font-semibold">{score}%</span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          {checks.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-2 rounded-xl px-2 py-1 ${
                c.ok ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                     : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {c.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <span className="text-sm">{c.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Button variant="brand">Review Settings</Button>
          <Button variant="soft">Learn More</Button>
        </div>
      </div>
    </div>
  )
}

/* 2FA enable/disable */
function TwoFactorCard() {
  const [enabled, setEnabled] = React.useState(true)
  const [show, setShow] = React.useState(false)

  return (
    <div className="space-y-2">
      <SectionTitle label="Two-Factor Authentication" hint="Add an extra layer of security" />
      <div className="panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center bg-black/5 dark:bg-white/10">
              <Smartphone className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {enabled ? 'Enabled (Authenticator App)' : 'Disabled'}
              </div>
              <div className="text-xs text-slate-600 dark:text-white/60">
                Time-based one-time passwords (TOTP)
              </div>
            </div>
          </div>
          <Button variant={enabled ? 'outline' : 'brand'} onClick={() => setShow(true)}>
            {enabled ? 'Disable' : 'Enable 2FA'}
          </Button>
        </div>

        {/* Modal (inline) */}
        <AnimatePresence>
          {show && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShow(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 grid place-items-center p-4"
                initial={{ scale: .98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .98, opacity: 0 }}
              >
                <div className="panel w-full max-w-md p-4">
                  <SectionTitle label={`${enabled ? 'Disable' : 'Enable'} 2FA`} hint="Scan QR with Google Authenticator" />
                  <div className="mt-3 rounded-2xl bg-black/5 dark:bg-white/5 h-40 grid place-items-center text-sm text-subtle">
                    QR Code Preview
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
                    <Button variant={enabled ? 'danger' : 'brand'} onClick={() => { setEnabled(!enabled); setShow(false) }}>
                      {enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* Password change (inline validation demo) */
function PasswordCard() {
  const [show1, setShow1] = React.useState(false)
  const [show2, setShow2] = React.useState(false)
  const [p1, setP1] = React.useState('')
  const [p2, setP2] = React.useState('')
  const strong = p1.length >= 10 && /[A-Z]/.test(p1) && /[a-z]/.test(p1) && /[0-9]/.test(p1)
  const match = p1 && p1 === p2

  return (
    <div className="space-y-2">
      <SectionTitle label="Password" hint="Last changed 54 days ago" />
      <div className="panel p-4 space-y-3">
        <div>
          <label className="text-xs text-subtle">New password</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2">
            <input
              type={show1 ? 'text' : 'password'}
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="At least 10 chars, mixed case & number"
            />
            <button onClick={() => setShow1(v => !v)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
              {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className={`mt-1 text-xs ${strong ? 'text-emerald-600' : 'text-amber-600'}`}>
            {strong ? 'Strong password' : 'Weak — add uppercase, lowercase and a number'}
          </div>
        </div>

        <div>
          <label className="text-xs text-subtle">Confirm new password</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2">
            <input
              type={show2 ? 'text' : 'password'}
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Re-enter new password"
            />
            <button onClick={() => setShow2(v => !v)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10">
              {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {!!p2 && (
            <div className={`mt-1 text-xs ${match ? 'text-emerald-600' : 'text-rose-600'}`}>
              {match ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}
        </div>

        <div className="pt-1 flex justify-end">
          <Button variant="brand" disabled={!(strong && match)}><Lock className="h-4 w-4" /> Update Password</Button>
        </div>
      </div>
    </div>
  )
}

/* Active sessions table using TableCard */
function SessionsCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Active Sessions" hint="Devices and recent activity" />
      <TableCard<Session>
        columns={[
          { header: 'Device', accessorKey: 'device' },
          { header: 'IP', accessorKey: 'ip' },
          { header: 'Location', accessorKey: 'location' },
          { header: 'Last Seen', accessorKey: 'lastSeen' },
          {
            header: 'Trusted',
            accessorKey: 'trusted',
            cell: ({ getValue }) => getValue<boolean>() ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Trusted</span>
            ) : (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">New</span>
            )
          },
          {
            id: 'actions',
            header: '',
            cell: () => (
              <div className="flex gap-1 justify-end">
                <Button variant="outline" size="sm"><LogOut className="h-4 w-4" /> Sign Out</Button>
              </div>
            )
          }
        ]}
        rows={sessions}
        searchKeys={['device','ip','location']}
        searchPlaceholder="Search device, IP, location…"
        pageSize={5}
      />
    </div>
  )
}

/* Login success vs failure area mini-chart */
function LoginActivityCard() {
  return (
    <div className="space-y-2">
      <SectionTitle label="Login Activity" hint="Success vs failed attempts" />
      <div className="panel p-4">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loginSeries} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="okGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity={0.55}/>
                  <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity={0.06}/>
                </linearGradient>
                <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(244 114 182)" stopOpacity={0.55}/>
                  <stop offset="100%" stopColor="rgb(244 114 182)" stopOpacity={0.06}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)' }}
                formatter={(v: any, n: any) => [String(v), n === 'ok' ? 'Success' : 'Failed']}
              />
              <Area dataKey="ok"   type="monotone" stroke="rgb(99 102 241)" strokeWidth={2} fill="url(#okGrad)" />
              <Area dataKey="fail" type="monotone" stroke="rgb(244 114 182)" strokeWidth={2} fill="url(#failGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* API Keys management */
function ApiKeysCard() {
  const [keys, setKeys] = React.useState<ApiKey[]>(seedKeys)
  const [showSecret, setShowSecret] = React.useState<Record<string, boolean>>({})
  const [modalOpen, setModalOpen] = React.useState(false)
  const [name, setName] = React.useState('')

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  function revoke(id: string) {
    setKeys(k => k.filter(x => x.id !== id))
  }

  function create() {
    if (!name.trim()) return
    const id = `k_live_${Math.random().toString(36).slice(2, 7)}`
    setKeys(k => [{ id, name, prefix: 'pk_live_' + Math.random().toString(36).slice(2,5), created: new Date().toISOString().slice(0,10), scopes: ['read'] }, ...k])
    setName('')
    setModalOpen(false)
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="API Keys" hint="Manage programmatic access" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-white/70">Use server-side only. Rotate regularly.</div>
          <Button variant="brand" onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New Key</Button>
        </div>

        <div className="space-y-2">
          {keys.map(k => {
            const visible = !!showSecret[k.id]
            const secret = visible ? `${k.prefix}${Math.random().toString(36).slice(2, 26)}` : `${k.prefix}•••••••••••••••••••`
            return (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-2xl px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-white/80 dark:bg-white/5"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">{k.name}</div>
                  <div className="text-xs text-slate-600 dark:text-white/70 truncate">{secret}</div>
                  <div className="text-[11px] text-subtle">Created {k.created}{k.lastUsed ? ` · Last used ${k.lastUsed}` : ''} · Scopes: {k.scopes.join(', ')}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="gray" size="sm" onClick={() => setShowSecret(s => ({ ...s, [k.id]: !visible }))}>
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {visible ? 'Hide' : 'Reveal'}
                  </Button>
                  <Button variant="soft" size="sm" onClick={() => copy(secret)}><Copy className="h-4 w-4" /> Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => revoke(k.id)}><Trash2 className="h-4 w-4" /> Revoke</Button>
                </div>
              </motion.div>
            )
          })}
          {keys.length === 0 && (
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-4 text-sm text-slate-600 dark:text-white/70">
              No API keys yet. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center p-4"
              initial={{ scale: .98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .98, opacity: 0 }}
            >
              <div className="panel w-full max-w-md p-4">
                <SectionTitle label="Create API Key" hint="Name it by service or environment" />
                <div className="mt-3">
                  <label className="text-xs text-subtle">Key name</label>
                  <input
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                    placeholder="e.g. Payments Service"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={()=>setModalOpen(false)}>Cancel</Button>
                  <Button variant="brand" onClick={create} disabled={!name.trim()}><KeyRound className="h-4 w-4" /> Create</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Recommendations / hardening checklist */
function RecommendationsCard() {
  const items = [
    { icon: Globe, label: 'Set IP allowlist for admin access', severity: 'high' },
    { icon: Cpu,   label: 'Rotate API keys every 90 days', severity: 'med' },
    { icon: Lock,  label: 'Enforce SSO for members', severity: 'med' },
  ] as const

  return (
    <div className="space-y-2">
      <SectionTitle label="Recommendations" hint="Hardening tips to reduce risk" />
      <div className="panel p-4 space-y-2">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10">
                <it.icon className="h-4 w-4 opacity-80" />
              </div>
              <div className="text-sm">{it.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                it.severity === 'high'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}>{it.severity.toUpperCase()}</span>
              <Button variant="soft" size="sm">Configure</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


/* =========================
   Utilities (validation, helpers)
   ========================= */
// Accepts IPv4 CIDR or single IPv4 (auto-/32). Trims, de-dupes and normalizes.
function normalizeCIDRs(input: string): { ok: string[]; bad: string[] } {
  const lines = input
    .split(/[\n,; ]+/)
    .map(s => s.trim())
    .filter(Boolean)

  const ok: string[] = []
  const bad: string[] = []

  for (const raw of lines) {
    const s = raw.trim()
    const withMask = s.includes('/') ? s : `${s}/32`
    if (isValidIPv4CIDR(withMask)) ok.push(withMask)
    else bad.push(s)
  }

  // de-dupe
  const set = new Set(ok)
  return { ok: [...set], bad }
}

function isValidIPv4CIDR(s: string): boolean {
  // 1.2.3.4/0-32
  const m = s.match(/^(\d{1,3})(?:\.(\d{1,3})){3}\/([0-9]|[12][0-9]|3[0-2])$/)
  if (!m) return false
  const [a,b,c,d] = s.split('/')[0].split('.').map(Number)
  return [a,b,c,d].every(oct => oct >= 0 && oct <= 255)
}

/* =========================
   IP Allowlist Editor
   ========================= */


function IpAllowlistCard() {
  const [items, setItems] = React.useState<string[]>([
    '203.0.113.10/32',
    '203.0.113.0/24',
  ])
  const [bulk, setBulk] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  function addOne(cidr: string) {
    const { ok, bad } = normalizeCIDRs(cidr)
    if (bad.length) {
      setError(`Invalid: ${bad.join(', ')}`)
      return
    }
    setError(null)
    setItems(prev => Array.from(new Set([...prev, ...ok])))
    setBulk('')
  }

  function addBulk() {
    const { ok, bad } = normalizeCIDRs(bulk)
    if (bad.length) {
      setError(`Invalid: ${bad.join(', ')}`)
    } else {
      setError(null)
    }
    if (ok.length) setItems(prev => Array.from(new Set([...prev, ...ok])))
    setBulk('')
  }

  function removeOne(cidr: string) {
    setItems(prev => prev.filter(x => x !== cidr))
  }

  function exportList() {
    const blob = new Blob([items.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ip-allowlist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="IP Allowlist" hint="Restrict admin access to trusted networks (CIDR)" />
      <div className="panel p-4 space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-white/70">Only these IPs/ranges can access the admin.</div>
          <div className="flex gap-2">
            <Button variant="soft" size="sm" onClick={exportList}><DownloadIcon className="h-4 w-4" /> Export</Button>
          </div>
        </div>

        {/* Quick add */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="text-xs text-subtle">Add IP / CIDR</label>
            <div className="mt-1 p-[1.5px] rounded-2xl bg-transparent focus-within:bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60 transition">
              <div className="flex h-10 items-center gap-2 rounded-[14px] bg-white/80 dark:bg-white/5 backdrop-blur px-3">
                <input
                  value={bulk}
                  onChange={(e)=>setBulk(e.target.value)}
                  onKeyDown={(e)=>{ if (e.key==='Enter') addOne(bulk) }}
                  placeholder="e.g. 203.0.113.5  or  203.0.113.0/24"
                  className="w-full bg-transparent outline-none text-sm"
                />
                <Button variant="brand" size="sm" onClick={() => addOne(bulk)}><Plus className="h-4 w-4" /> Add</Button>
              </div>
            </div>
            {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
          </div>
        </div>

        {/* Bulk import */}
        <div>
          <details className="group">
            <summary className="cursor-pointer text-sm text-slate-700 dark:text-white/80">Bulk import</summary>
            <div className="mt-2 rounded-2xl bg-black/5 dark:bg-white/5 p-3 space-y-2">
              <textarea
                value={bulk}
                onChange={(e)=>setBulk(e.target.value)}
                rows={4}
                placeholder="Paste IPs or CIDRs separated by newline, comma, or space"
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
              />
              <div className="flex gap-2">
                <Button variant="soft" size="sm" onClick={addBulk}><Upload className="h-4 w-4" /> Import</Button>
                <Button variant="ghost" size="sm" onClick={()=>setBulk('')}>Clear</Button>
              </div>
            </div>
          </details>
        </div>

        {/* List */}
        <div className="grid gap-2">
          <AnimatePresence initial={false}>
            {items.map((cidr) => (
              <motion.div
                key={cidr}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between rounded-2xl px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-white/80 dark:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10">
                    <Shield className="h-4 w-4 opacity-80" />
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">{cidr}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeOne(cidr)}>
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-3 text-sm text-slate-600 dark:text-white/70">
              No IPs yet. Add a single IP (auto /32) or a CIDR range.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


type SsoMethod = 'SAML' | 'OIDC'

function SsoCard() {
  const [enabled, setEnabled] = React.useState(false)
  const [wizard, setWizard] = React.useState(false)
  const [enforce, setEnforce] = React.useState(false)

  return (
    <div className="space-y-2">
      <SectionTitle label="Single Sign-On (SSO)" hint="SAML or OIDC — connect your IdP" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl grid place-items-center bg-black/5 dark:bg-white/10">
              <GlobeLock className="h-5 w-5 opacity-80" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {enabled ? 'Enabled' : 'Disabled'}
              </div>
              <div className="text-xs text-slate-600 dark:text-white/60">
                Sign in via your identity provider
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {enabled ? (
              <Button variant="outline" onClick={() => setEnabled(false)}>Disable</Button>
            ) : (
              <Button variant="brand" onClick={() => setWizard(true)}><KeyRound className="h-4 w-4" /> Set up SSO</Button>
            )}
          </div>
        </div>

        {/* Enforce toggle (only when enabled) */}
        {enabled && (
          <div className="rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2 flex items-center justify-between">
            <div className="text-sm">Enforce SSO for all members</div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enforce}
                onChange={(e)=>setEnforce(e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-black/20 dark:bg-white/20 peer-checked:bg-indigo-500 transition-all relative">
                <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white dark:bg-slate-200 peer-checked:translate-x-5 transition" />
              </div>
            </label>
          </div>
        )}
      </div>

      <SsoWizard open={wizard} onClose={() => setWizard(false)} onDone={() => { setEnabled(true); setWizard(false) }} />
    </div>
  )
}

function SsoWizard({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [step, setStep] = React.useState(1)
  const [method, setMethod] = React.useState<SsoMethod | null>(null)

  // SAML fields
  const [saml, setSaml] = React.useState({ issuer: '', ssoUrl: '', cert: '' })
  // OIDC fields
  const [oidc, setOidc] = React.useState({ issuer: '', clientId: '', clientSecret: '' })

  const canNextStep2 =
    (method === 'SAML' && saml.issuer && saml.ssoUrl && saml.cert) ||
    (method === 'OIDC' && oidc.issuer && oidc.clientId && oidc.clientSecret)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            initial={{ scale: .98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .98, opacity: 0 }}
          >
            <div className="panel w-full max-w-2xl p-4">
              <div className="flex items-center justify-between">
                <SectionTitle label="Setup SSO" hint="Connect your SAML or OIDC provider" />
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>

              {/* Stepper */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                {['Method', 'Configuration', 'Verify'].map((s, i) => (
                  <div key={s} className={`rounded-xl px-2 py-1 text-center ${i < step ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300' : 'bg-black/5 dark:bg-white/5'}`}>{s}</div>
                ))}
              </div>

              {/* Content */}
              <div className="mt-4 space-y-4">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => setMethod('SAML')}
                      className={`rounded-2xl px-4 py-3 text-left ring-1 ring-black/10 dark:ring-white/10 ${method==='SAML' ? 'bg-black/10 dark:bg-white/10' : 'bg-white/80 dark:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <div className="font-semibold">SAML 2.0</div>
                      </div>
                      <div className="mt-1 text-xs text-subtle">Okta, OneLogin, Azure AD</div>
                    </button>
                    <button
                      onClick={() => setMethod('OIDC')}
                      className={`rounded-2xl px-4 py-3 text-left ring-1 ring-black/10 dark:ring-white/10 ${method==='OIDC' ? 'bg-black/10 dark:bg-white/10' : 'bg-white/80 dark:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        <div className="font-semibold">OIDC</div>
                      </div>
                      <div className="mt-1 text-xs text-subtle">Auth0, Google, Azure AD</div>
                    </button>
                  </div>
                )}

                {step === 2 && method === 'SAML' && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-xs text-subtle">Entity ID / Issuer</label>
                      <input value={saml.issuer} onChange={(e)=>setSaml({ ...saml, issuer: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="urn:yourapp:SAML:prod" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-subtle">SSO URL</label>
                      <input value={saml.ssoUrl} onChange={(e)=>setSaml({ ...saml, ssoUrl: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="https://idp.example.com/sso" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-subtle">X.509 Certificate</label>
                      <textarea value={saml.cert} onChange={(e)=>setSaml({ ...saml, cert: e.target.value })}
                        rows={5}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="-----BEGIN CERTIFICATE-----" />
                    </div>
                  </div>
                )}

                {step === 2 && method === 'OIDC' && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-xs text-subtle">Issuer URL</label>
                      <input value={oidc.issuer} onChange={(e)=>setOidc({ ...oidc, issuer: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="https://your-tenant.auth0.com/" />
                    </div>
                    <div>
                      <label className="text-xs text-subtle">Client ID</label>
                      <input value={oidc.clientId} onChange={(e)=>setOidc({ ...oidc, clientId: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="xxxxx" />
                    </div>
                    <div>
                      <label className="text-xs text-subtle">Client Secret</label>
                      <input value={oidc.clientSecret} onChange={(e)=>setOidc({ ...oidc, clientSecret: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                        placeholder="••••••••" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 text-sm">
                    We’ll try a **metadata validation** and redirect URL check when you integrate a backend.
                    For now this step simulates a success and enables SSO.
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-between">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={()=> setStep(s => Math.max(1, s-1))} disabled={step===1}>Back</Button>
                  {step < 2 && (
                    <Button variant="brand" onClick={()=> setStep(2)} disabled={!method}>Continue</Button>
                  )}
                  {step === 2 && (
                    <Button variant="brand" onClick={()=> setStep(3)} disabled={!canNextStep2}>Validate</Button>
                  )}
                  {step === 3 && (
                    <Button variant="success" onClick={onDone}>Finish & Enable</Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}