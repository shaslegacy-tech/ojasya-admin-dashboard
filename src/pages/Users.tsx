import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Users2, Plus, Download, Filter, Mail, UserPlus, Shield, Ban, ChevronRight, Search, X
} from 'lucide-react'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'

/* =========================
   Demo data / types
   ========================= */
type Status = 'Active' | 'Invited' | 'Suspended'
type Role = 'Owner' | 'Admin' | 'Manager' | 'Member'

export type User = {
  id: number
  name: string
  email: string
  role: Role
  plan: 'Starter' | 'Pro' | 'Enterprise'
  mrr: number
  status: Status
  joined: string
}

const seed: User[] = Array.from({ length: 36 }).map((_, i) => ({
  id: i + 1,
  name: ['Ava Patel','Arjun Singh','Ishaan Rao','Neha Sharma','Riya Kapoor','Kabir Mehta','Zara Khan','Anaya Joshi','Vihaan Das','Advait Iyer'][i%10],
  email: `user${i+1}@example.com`,
  role: (['Owner','Admin','Manager','Member'] as Role[])[i%4],
  plan: (['Starter','Pro','Enterprise'] as const)[i%3],
  mrr: [800, 2900, 14900][i%3],
  status: (['Active','Invited','Suspended'] as Status[])[i%3 === 0 ? 0 : i%3 === 1 ? 1 : 2],
  joined: new Date(Date.now() - i*86400000).toISOString(),
}))

const INR = new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 })

/* =========================
   Page
   ========================= */
export default function UsersPage() {
  const [tab, setTab] = React.useState<'All'|Status>('All')
  const [query, setQuery] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [selected, setSelected] = React.useState<User|null>(null)
  const [inviteOpen, setInviteOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = seed
    if (tab !== 'All') rows = rows.filter(r => r.status === tab)
    if (q) rows = rows.filter(r =>
      [r.name, r.email, r.role, r.plan, r.status].some(v => String(v).toLowerCase().includes(q)))
    return rows
  }, [tab, query])

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: () => null,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-black/20 dark:border-white/20"
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false
    },
    {
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => {
        const name = row.getValue<string>('name')
        const email = row.original.email
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white grid place-items-center text-xs font-bold shadow-sm">
              {name.slice(0,2).toUpperCase()}
            </div>
            <div className="leading-tight">
              <div className="font-medium text-slate-900 dark:text-white">{name}</div>
              <div className="text-[11px] text-slate-500 dark:text-white/60">{email}</div>
            </div>
          </div>
        )
      }
    },
    { header: 'Role', accessorKey: 'role' },
    {
      header: 'Plan / MRR',
      accessorKey: 'mrr',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-xs">{row.original.plan}</span>
          <span className="font-medium">{INR.format(row.original.mrr)}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const v = getValue<Status>()
        const cls =
          v==='Active'    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
          v==='Invited'   ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400' :
                            'bg-rose-500/15 text-rose-600 dark:text-rose-400'
        return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{v}</span>
      }
    },
    {
      header: 'Joined',
      accessorKey: 'joined',
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    },
    {
      id: 'open',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => setSelected(row.original)}
          className="group rounded-xl px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label="Open"
        >
          <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100" />
        </button>
      ),
      size: 40,
      enableSorting: false
    }
  ]

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl grid place-items-center bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10">
            <Users2 className="h-5 w-5 opacity-80" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Users</h2>
            <p className="text-sm text-slate-600 dark:text-white/60">Manage members, roles, and invitations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="soft" onClick={() => {/* export hook */}}><Download className="h-4 w-4" /> Export</Button>
          <Button variant="brand" onClick={() => setInviteOpen(true)}><UserPlus className="h-4 w-4" /> Invite</Button>
        </div>
      </div>

      {/* Tabs + search toolbar */}
      <div className="panel p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-1">
            {(['All','Active','Invited','Suspended'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-2xl px-3 py-1.5 text-sm transition
                  ${tab===t ? 'bg-black/10 dark:bg-white/15 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Premium search pill */}
          <motion.div
            className="relative group"
            initial={false}
            animate={{ scale: focused ? 1.01 : 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.22 }}
          >
            <div className="p-[1.5px] rounded-2xl transition-all duration-200 bg-transparent group-focus-within:bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60">
              <div className="relative flex items-center gap-2 h-10 pl-3 pr-2 rounded-[14px] bg-white/80 dark:bg-white/5 backdrop-blur [transition:box-shadow_.2s,background_.2s,width_.25s] w-56 md:w-72">
                <Search className="h-4 w-4 opacity-70" />
                <motion.input
                  value={query}
                  onChange={(e)=>setQuery(e.target.value)}
                  onFocus={()=>setFocused(true)}
                  onBlur={()=>setFocused(false)}
                  placeholder="Search name, email, role…"
                  className="bg-transparent outline-none focus:outline-none ring-0 border-0 shadow-none appearance-none text-sm placeholder:opacity-60 w-full caret-slate-700 dark:caret-white"
                  initial={false}
                  animate={{ opacity: focused ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                />
                {query && (
                  <button onClick={()=>setQuery('')} className="grid place-items-center rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition" aria-label="Clear">
                    <X className="h-3.5 w-3.5 opacity-70" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <Button variant="outline"><Filter className="h-4 w-4" /> Filters</Button>
        </div>

        {/* Bulk actions when rows selected */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 flex items-center justify-between rounded-2xl bg-black/5 dark:bg-white/5 px-3 py-2 text-sm"
            >
              <span>{selectedCount} selected</span>
              <div className="flex gap-2">
                <Button variant="gray" size="sm"><Mail className="h-4 w-4" /> Email</Button>
                <Button variant="soft" size="sm"><Shield className="h-4 w-4" /> Change Role</Button>
                <Button variant="danger" size="sm"><Ban className="h-4 w-4" /> Suspend</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 table-thead">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white/80 select-none cursor-pointer"
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ width: (h.getSize() ?? undefined) as any }}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext()) as React.ReactNode}
                      {({ asc:' ↑', desc:' ↓' } as Record<string,string>)[h.column.getIsSorted() as string] ?? ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {table.getRowModel().rows.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-black/5 dark:hover:bg-white/8 transition motion-safe:animate-fade-in"
                >
                  {r.getVisibleCells().map((c) => (
                    <td key={c.id} className="px-3 py-2 text-slate-800 dark:text-slate-200">
                      {(flexRender(c.column.columnDef.cell, c.getContext()) ??
                        String(c.getValue() as any)) as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr><td colSpan={table.getAllLeafColumns().length} className="px-3 py-10 text-center text-subtle">No users</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-xs text-subtle">
          <span>
            Showing{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filtered.length
            )}{' '}
            of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
            <Button variant="outline" size="sm" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </div>

      {/* Invite modal */}
      <InviteModal open={inviteOpen} onClose={()=>setInviteOpen(false)} />

      {/* Drawer */}
      <UserDrawer user={selected} onClose={()=>setSelected(null)} />
    </div>
  )
}

/* =========================
   Drawer (details)
   ========================= */
function UserDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-[380px] bg-card border-l border-surface p-4 overflow-y-auto"
            initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <div className="flex items-center justify-between">
              <SectionTitle label="User Details" hint={user.email} />
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white grid place-items-center text-sm font-bold">
                {user.name.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-xs text-slate-600 dark:text-white/60">{user.role} • {user.plan}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="panel p-3">
                <div className="text-xs text-subtle">Status</div>
                <div className="mt-1 font-semibold">{user.status}</div>
              </div>
              <div className="panel p-3">
                <div className="text-xs text-subtle">MRR</div>
                <div className="mt-1 font-semibold">{INR.format(user.mrr)}</div>
              </div>
              <div className="panel p-3 col-span-2">
                <div className="text-xs text-subtle">Joined</div>
                <div className="mt-1 font-semibold">
                  {new Date(user.joined).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="soft"><Mail className="h-4 w-4" /> Email</Button>
              <Button variant="success"><Shield className="h-4 w-4" /> Promote</Button>
              <Button variant="danger"><Ban className="h-4 w-4" /> Suspend</Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* =========================
   Invite modal
   ========================= */
function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const valid = name.trim().length >= 2 && /^[^@]+@[^@]+\.[^@]+$/.test(email)

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
            <div className="panel w-full max-w-md p-4">
              <div className="flex items-center justify-between">
                <SectionTitle label="Invite User" hint="Send an email invitation" />
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-subtle">Full name</label>
                  <input
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                    placeholder="e.g. Arjun Singh"
                  />
                </div>
                <div>
                  <label className="text-xs text-subtle">Email</label>
                  <input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[rgba(139,92,246,0.35)]"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="brand" disabled={!valid}><Plus className="h-4 w-4" /> Send Invite</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}