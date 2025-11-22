import * as React from 'react'
import { motion } from 'framer-motion'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, SortingState } from '@tanstack/react-table'
import { Users2, UserPlus, Shield, Trash2, Search, X } from 'lucide-react'
import Button from '../../ui/Button'
import SectionTitle from '../../ui/SectionTitle'

type Role = 'Owner' | 'Admin' | 'Manager' | 'Member' | 'Viewer'
type Status = 'Active' | 'Suspended' | 'Invited'

export type TeamUser = {
  id: number
  name: string
  email: string
  role: Role
  status: Status
  joined: string
}

const seed: TeamUser[] = [
  { id: 1, name: 'Ava Patel', email: 'ava@acme.com', role: 'Owner',   status: 'Active',   joined: '2025-08-01' },
  { id: 2, name: 'Arjun Singh', email: 'arjun@acme.com', role: 'Admin',   status: 'Active',   joined: '2025-09-04' },
  { id: 3, name: 'Zara Khan', email: 'zara@acme.com', role: 'Manager', status: 'Invited',  joined: '2025-10-12' },
  { id: 4, name: 'Vihaan Das', email: 'vihaan@acme.com', role: 'Member',  status: 'Suspended', joined: '2025-09-30' },
]

const ROLE_ORDER: Role[] = ['Owner', 'Admin', 'Manager', 'Member', 'Viewer']
const roleClass = (r: Role) =>
  r === 'Owner'   ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300' :
  r === 'Admin'   ? 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300' :
  r === 'Manager' ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300' :
  r === 'Member'  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300' :
                    'bg-slate-500/15 text-slate-600 dark:text-slate-300'

export default function TeamRoles() {
  const [rows, setRows] = React.useState<TeamUser[]>(seed)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [query, setQuery] = React.useState('')
  const [focused, setFocused] = React.useState(false)

  // Invite inline state
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [invName, setInvName] = React.useState('')
  const [invEmail, setInvEmail] = React.useState('')
  const [invRole, setInvRole] = React.useState<Role>('Member')
  const validInvite = invName.trim().length >= 2 && /^[^@]+@[^@]+\.[^@]+$/.test(invEmail)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      [r.name, r.email, r.role, r.status].some(v => String(v).toLowerCase().includes(q))
    )
  }, [rows, query])

  function changeRole(id: number, role: Role) {
    setRows(rs => rs.map(r => r.id === id ? { ...r, role } : r))
  }
  function toggleSuspend(id: number) {
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: r.status === 'Suspended' ? 'Active' : 'Suspended' } : r))
  }
  function removeUser(id: number) {
    setRows(rs => rs.filter(r => r.id !== id))
  }
  function invite() {
    if (!validInvite) return
    setRows(rs => [
      { id: Math.max(0, ...rs.map(r => r.id)) + 1, name: invName.trim(), email: invEmail.trim(), role: invRole, status: 'Invited', joined: new Date().toISOString().slice(0,10) },
      ...rs
    ])
    setInvName(''); setInvEmail(''); setInvRole('Member'); setInviteOpen(false)
  }

  const columns: ColumnDef<TeamUser>[] = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white grid place-items-center text-[11px] font-bold">
            {row.original.name.slice(0,2).toUpperCase()}
          </div>
          <div className="leading-tight">
            <div className="font-medium text-slate-900 dark:text-white">{row.original.name}</div>
            <div className="text-[11px] text-slate-600 dark:text-white/60">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortingFn: (a, b) => ROLE_ORDER.indexOf(a.original.role) - ROLE_ORDER.indexOf(b.original.role),
      cell: ({ row }) => (
        <div className="relative">
          <select
            value={row.original.role}
            onChange={(e)=>changeRole(row.original.id, e.target.value as Role)}
            className={`rounded-full px-2 py-0.5 text-xs font-semibold pr-6 appearance-none ${roleClass(row.original.role)}`}
          >
            {ROLE_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {/* caret */}
          <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[10px] opacity-60">▾</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const v = getValue<Status>()
        const cls = v === 'Active'
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
          : v === 'Invited'
          ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
        return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{v}</span>
      }
    },
    {
      header: 'Joined',
      accessorKey: 'joined',
      cell: ({ getValue }) =>
        new Date(getValue<string>()).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="soft" size="sm" onClick={()=>toggleSuspend(row.original.id)}>
            <Shield className="h-4 w-4" /> {row.original.status === 'Suspended' ? 'Activate' : 'Suspend'}
          </Button>
          <Button variant="outline" size="sm" onClick={()=>removeUser(row.original.id)}>
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        </div>
      )
    }
  ]

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  return (
    <div id="section-team" className="space-y-2 scroll-mt-24">
      <SectionTitle label="Team & Roles" hint="Invite, assign roles, suspend/remove" />
      <div className="panel overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10">
              <Users2 className="h-4 w-4 opacity-80" />
            </div>
            <div className="text-sm text-slate-700 dark:text-white/75">{rows.length} members</div>
          </div>

          {/* Search pill + Invite */}
          <div className="flex items-center gap-2">
            <motion.div
              className="relative group"
              initial={false}
              animate={{ scale: focused ? 1.01 : 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.22 }}
            >
              <div className="p-[1.5px] rounded-2xl bg-transparent group-focus-within:bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60 transition">
                <div className="relative flex items-center gap-2 h-10 pl-3 pr-2 rounded-[14px] bg-white/80 dark:bg-white/5 backdrop-blur w-56 md:w-72">
                  <Search className="h-4 w-4 opacity-70" />
                  <input
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    onFocus={()=>setFocused(true)}
                    onBlur={()=>setFocused(false)}
                    placeholder="Search name, email, role…"
                    className="bg-transparent outline-none text-sm w-full"
                  />
                  {query && (
                    <button onClick={()=>setQuery('')} className="grid place-items-center rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition" aria-label="Clear">
                      <X className="h-3.5 w-3.5 opacity-70" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <Button variant="brand" onClick={()=>setInviteOpen(v => !v)}>
              <UserPlus className="h-4 w-4" /> Invite
            </Button>
          </div>
        </div>

        {/* Inline invite row */}
        {inviteOpen && (
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 bg-black/3 dark:bg-white/3">
            <div className="grid gap-2 md:grid-cols-[1.2fr_1.4fr_0.9fr_auto]">
              <input
                value={invName}
                onChange={(e)=>setInvName(e.target.value)}
                placeholder="Full name"
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
              />
              <input
                value={invEmail}
                onChange={(e)=>setInvEmail(e.target.value)}
                placeholder="name@company.com"
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
              />
              <select
                value={invRole}
                onChange={(e)=>setInvRole(e.target.value as Role)}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
              >
                {ROLE_ORDER.map(r => <option key={r}>{r}</option>)}
              </select>
              <div className="flex gap-2">
                <Button variant="soft" onClick={invite} disabled={!validInvite}>Send</Button>
                <Button variant="ghost" onClick={()=>setInviteOpen(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 table-thead">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white/80 select-none cursor-pointer"
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
              {table.getRowModel().rows.map(r => (
                <tr key={r.id} className="hover:bg-black/5 dark:hover:bg-white/8 transition">
                  {r.getVisibleCells().map(c => (
                    <td key={c.id} className="px-3 py-2 text-slate-800 dark:text-slate-200">
                      {(flexRender(c.column.columnDef.cell, c.getContext()) ?? String(c.getValue() as any)) as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={table.getAllLeafColumns().length} className="px-3 py-10 text-center text-subtle">
                    No members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 text-xs text-subtle">
          <span>
            Showing {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
            <Button variant="outline" size="sm" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}