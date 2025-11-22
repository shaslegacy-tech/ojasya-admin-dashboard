import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Shield, Globe, Bell, SunMoon, Moon, Upload, Image as ImageIcon, GitBranch, Slack, KanbanSquare, Trash2,
  Download, Save, Building2, KeyRound, Languages, ChevronRight
} from 'lucide-react'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'
import TeamRoles from './settings/TeamRoles'
import SettingsRail from './settings/SettingsRail'

/* =========================
   Small helpers
   ========================= */
function useAutosaveLocal<T extends object>(key: string, initial: T) {
  const [data, setData] = React.useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initial } catch { return initial }
  })
  const [status, setStatus] = React.useState<'idle'|'saving'|'saved'>('idle')
  React.useEffect(() => {
    setStatus('saving')
    const id = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data))
      setStatus('saved')
      const back = setTimeout(() => setStatus('idle'), 1200)
      return () => clearTimeout(back)
    }, 450)
    return () => clearTimeout(id)
  }, [data, key])
  return { data, setData, status }
}

const LANGS = ['English', 'हिन्दी', 'Deutsch', '日本語'] as const
type Lang = typeof LANGS[number]

/* =========================
   Page
   ========================= */
export default function SettingsPage() {
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
            <Shield className="h-5 w-5 opacity-80" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h2>
            <p className="text-sm text-slate-600 dark:text-white/60">Profile, preferences, notifications & workspace</p>
          </div>
        </div>
        <Button variant="soft"><Download className="h-4 w-4" /> Export Settings</Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* <SettingsRail /> */}
        <div className="space-y-6">
          <ProfileCard />
          <PreferencesCard />
          <NotificationsCard />
          <OrganizationCard />
          <IntegrationsCard />
        </div>
        <div className="space-y-6">
          <AuditPrivacyCard />
          <DangerZoneCard />
        </div>
           <TeamRoles />
      </div>
    </motion.div>
  )
}

/* =========================================================
   Profile
   ========================================================= */
function ProfileCard() {
  const { data, setData, status } = useAutosaveLocal('settings.profile', {
    name: 'Arjun Singh',
    email: 'arjun@example.com',
    avatarDataUrl: '',
    bio: 'Building delightful admin experiences.'
  })

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const rdr = new FileReader()
    rdr.onload = () => setData({ ...data, avatarDataUrl: String(rdr.result) })
    rdr.readAsDataURL(f)
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="Profile" hint="Basic account info & avatar" />
      <div className="panel p-4 space-y-4">
        {/* autosave indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/5 grid place-items-center">
              {data.avatarDataUrl
                ? <img src={data.avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                : <ImageIcon className="h-6 w-6 opacity-60" />}
            </div>
            <div className="flex gap-2">
              <label className="inline-flex items-center gap-2 rounded-2xl bg-white/80 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 px-3 py-2 text-sm cursor-pointer">
                <Upload className="h-4 w-4" /> Upload
                <input type="file" accept="image/*" className="sr-only" onChange={onPick} />
              </label>
              {data.avatarDataUrl && (
                <Button variant="outline" onClick={() => setData({ ...data, avatarDataUrl: '' })}>Remove</Button>
              )}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-subtle">Full name</label>
              <input
                value={data.name}
                onChange={(e)=>setData({ ...data, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
              />
            </div>
            <div>
              <label className="text-xs text-subtle">Email</label>
              <input
                value={data.email}
                onChange={(e)=>setData({ ...data, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                type="email"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-subtle">Bio</label>
              <textarea
                value={data.bio}
                onChange={(e)=>setData({ ...data, bio: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                placeholder="Tell us about you…"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   Preferences
   ========================================================= */
function PreferencesCard() {
  const { data, setData, status } = useAutosaveLocal('settings.prefs', {
    theme: (document.documentElement.classList.contains('dark') ? 'dark' : 'light') as 'light'|'dark'|'system',
    density: 'cozy' as 'compact'|'cozy'|'comfortable',
    language: 'English' as Lang
  })

  React.useEffect(() => {
    if (data.theme === 'dark') document.documentElement.classList.add('dark')
    if (data.theme === 'light') document.documentElement.classList.remove('dark')
  }, [data.theme])

  return (
    <div className="space-y-2">
      <SectionTitle label="Preferences" hint="Theme, density & language" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {/* Theme */}
          <div className="space-y-1">
            <div className="text-xs text-subtle flex items-center gap-2"><SunMoon className="h-3.5 w-3.5" /> Theme</div>
            <div className="flex gap-2">
              {(['light','dark'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setData({ ...data, theme: t })}
                  className={`rounded-2xl px-3 py-2 text-sm ring-1 ring-black/10 dark:ring-white/10 transition
                    ${data.theme===t ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white' : 'bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {t === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="space-y-1">
            <div className="text-xs text-subtle">Density</div>
            <div className="flex gap-2">
              {(['compact','cozy','comfortable'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setData({ ...data, density: d })}
                  className={`rounded-2xl px-3 py-2 text-sm ring-1 ring-black/10 dark:ring-white/10 transition
                    ${data.density===d ? 'bg-black/10 dark:bg:white/10 text-slate-900 dark:text-white' : 'bg-white/80 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <div className="text-xs text-subtle flex items-center gap-2"><Languages className="h-3.5 w-3.5" /> Language</div>
            <select
              value={data.language}
              onChange={(e)=>setData({ ...data, language: e.target.value as Lang })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
            >
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   Notifications
   ========================================================= */
function NotificationsCard() {
  const { data, setData, status } = useAutosaveLocal('settings.notif', {
    email: { product: true, security: true, billing: true, weekly: false },
    push: { alerts: true, tips: false }
  })

  function Toggle({ checked, onChange }: { checked: boolean; onChange: (v:boolean)=>void }) {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e)=>onChange(e.target.checked)} />
        <div className="h-6 w-11 rounded-full bg-black/20 dark:bg-white/20 peer-checked:bg-indigo-500 transition-all relative">
          <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white dark:bg-slate-200 peer-checked:translate-x-5 transition" />
        </div>
      </label>
    )
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="Notifications" hint="Email & push preferences" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4" /> Email</div>
            <div className="mt-2 space-y-2 text-sm">
              {(['product','security','billing','weekly'] as const).map(k => (
                <div key={k} className="flex items-center justify-between">
                  <span className="capitalize">{k} updates</span>
                  <Toggle checked={data.email[k]} onChange={(v)=>setData({ ...data, email: { ...data.email, [k]: v } })} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-black/5 dark:bg:white/5 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold"><PhoneIcon /> Push</div>
            <div className="mt-2 space-y-2 text-sm">
              {(['alerts','tips'] as const).map(k => (
                <div key={k} className="flex items-center justify-between">
                  <span className="capitalize">{k}</span>
                  <Toggle checked={data.push[k]} onChange={(v)=>setData({ ...data, push: { ...data.push, [k]: v } })} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
function PhoneIcon(){ return <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none"><path d="M16 2H8a2 2 0 0 0-2 2v16l6-3 6 3V4a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5"/></svg> }

/* =========================================================
   Organization
   ========================================================= */
function OrganizationCard() {
  const { data, setData, status } = useAutosaveLocal('settings.org', {
    name: 'PrimeAdmin',
    slug: 'primeadmin',
    logo: ''
  })

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const rdr = new FileReader()
    rdr.onload = () => setData({ ...data, logo: String(rdr.result) })
    rdr.readAsDataURL(f)
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="Organization" hint="Name, slug & branding" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs text-subtle">Organization name</label>
            <input
              value={data.name}
              onChange={(e)=>setData({ ...data, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
            />
          </div>
          <div>
            <label className="text-xs text-subtle">Slug</label>
            <div className="mt-1 flex items-center rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2">
              <span className="text-xs text-slate-500 dark:text-white/60">app.example.com/</span>
              <input
                value={data.slug}
                onChange={(e)=>setData({ ...data, slug: e.target.value.replace(/[^a-z0-9-]/g,'').toLowerCase() })}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-between rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/10 grid place-items-center">
                {data.logo ? <img src={data.logo} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 opacity-80" />}
              </div>
              <div>
                <div className="text-sm font-semibold">Logo</div>
                <div className="text-xs text-subtle">PNG/SVG up to 1MB</div>
              </div>
            </div>
            <div className="flex gap-2">
              <label className="rounded-2xl bg-white/80 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 px-3 py-2 text-sm cursor-pointer">
                Upload
                <input type="file" accept="image/*" className="sr-only" onChange={onPick} />
              </label>
              {data.logo && <Button variant="outline" onClick={()=>setData({ ...data, logo: '' })}>Remove</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   Integrations
   ========================================================= */
function IntegrationsCard() {
  const [gh, setGh] = React.useState(true)
  const [slack, setSlack] = React.useState(false)
  const [linear, setLinear] = React.useState(true)

  function Row({ icon: Icon, name, connected, onToggle }:{
    icon: React.ComponentType<any>, name: string, connected: boolean, onToggle: ()=>void
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-white/80 dark:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10">
            <Icon className="h-4 w-4 opacity-80" />
          </div>
          <div className="text-sm font-medium">{name}</div>
        </div>
        <Button variant={connected ? 'outline' : 'brand'} size="sm" onClick={onToggle}>
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      <SectionTitle label="Integrations" hint="Connect your tools" />
      <div className="panel p-4 space-y-2">
        <Row icon={GitBranch} name="GitHub" connected={gh} onToggle={()=>setGh(!gh)} />
        <Row icon={Slack} name="Slack" connected={slack} onToggle={()=>setSlack(!slack)} />
        <Row icon={KanbanSquare} name="Linear" connected={linear} onToggle={()=>setLinear(!linear)} />
      </div>
    </div>
  )
}

/* =========================================================
   Audit & Privacy
   ========================================================= */
function AuditPrivacyCard() {
  const { data, setData, status } = useAutosaveLocal('settings.audit', {
    retentionDays: 180,
    exportReady: false
  })

  return (
    <div className="space-y-2">
      <SectionTitle label="Audit & Privacy" hint="Data retention & exports" />
      <div className="panel p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">Autosave</span>
          <span className={status==='saving' ? 'text-amber-600' : status==='saved' ? 'text-emerald-600' : 'text-subtle'}>
            {status==='saving' ? 'Saving…' : status==='saved' ? 'Saved' : 'Idle'}
          </span>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="text-xs text-subtle">Log retention</label>
            <select
              value={String(data.retentionDays)}
              onChange={(e)=>setData({ ...data, retentionDays: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
            >
              {[30,90,180,365].map(d => <option key={d} value={d}>{d} days</option>)}
            </select>
          </div>

          <div className="rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2 flex items-center justify-between">
            <div className="text-sm">Export account data</div>
            <Button variant="soft"><Download className="h-4 w-4" /> Request Export</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   Danger Zone
   ========================================================= */
function DangerZoneCard() {
  const [open, setOpen] = React.useState(false)
  const [confirm, setConfirm] = React.useState('')

  return (
    <div className="space-y-2">
      <SectionTitle label="Danger Zone" hint="Irreversible actions" />
      <div className="panel p-4 space-y-3">
        <div className="rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-2 text-sm flex items-center justify-between">
          <span>Deleting the organization will permanently remove data.</span>
          <Button variant="danger" onClick={()=>setOpen(true)}><Trash2 className="h-4 w-4" /> Delete Organization</Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={()=>setOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center p-4"
              initial={{ scale: .98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .98, opacity: 0 }}
            >
              <div className="panel w-full max-w-md p-4">
                <SectionTitle label="Delete Organization" hint="Type DELETE to confirm" />
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-slate-700 dark:text-white/80">
                    This action cannot be undone. All projects, members, and billing data will be removed.
                  </div>
                  <input
                    value={confirm}
                    onChange={(e)=>setConfirm(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-400/40"
                    placeholder="Type DELETE"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={()=>setOpen(false)}>Cancel</Button>
                  <Button variant="danger" disabled={confirm!=='DELETE'} onClick={()=>alert('Deleted!')}>
                    <Trash2 className="h-4 w-4" /> Permanently Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}