import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import Button from '../ui/Button'
import { Search as SearchIcon, Download, Plus } from 'lucide-react'

// ---------- Types ----------
export type User = {
  name: string
  email: string
  plan: string
  mrr: number
  status: 'Active' | 'Paused'
}

// ---------- Demo Data ----------
const data: User[] = Array.from({ length: 24 }).map((_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  plan: ['Starter', 'Pro', 'Enterprise'][i % 3],
  mrr: [80, 2900, 14900][i % 3],
  status: i % 4 === 0 ? 'Paused' : 'Active',
}))

// ---------- Columns ----------
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

const columns: ColumnDef<User>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const v = row.getValue<string>('name')
      const email = row.getValue<string>('email')
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-400 text-white grid place-items-center text-xs font-bold shadow-sm">
            {v?.slice(0, 2).toUpperCase()}
          </div>
          <div className="leading-tight">
            <div className="font-medium html:not(.dark):!text-slate-900 dark:!text-white">{v}</div>
            <div className="text-[11px] text-slate-500 dark:text-white/60">{email}</div>
          </div>
        </div>
      )
    },
  },
  { header: 'Plan', accessorKey: 'plan' },
  {
    header: 'MRR',
    accessorKey: 'mrr',
    cell: ({ getValue }) => inr.format(getValue<number>()),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const v = getValue<User['status']>()
      const cls = v === 'Active'
        ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400'
        : 'rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400'
      return <span className={cls}>{v}</span>
    },
  },
]

// ---------- Small helpers ----------
function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

// ---------- Component ----------
export default function UsersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [query, setQuery] = React.useState('')
  const debounced = useDebounced(query)

  const searchKeys: (keyof User)[] = ['name', 'email', 'plan', 'status']

  const filtered = React.useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return data
    return data.filter((r) =>
      searchKeys.some((k) => String((r as any)[k] ?? '').toLowerCase().includes(q))
    )
  }, [debounced])

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

  const page = table.getState().pagination
  const from = page.pageIndex * page.pageSize + 1
  const to = Math.min((page.pageIndex + 1) * page.pageSize, filtered.length)

  return (
    <div className="panel overflow-hidden">
      {/* Header: title + search + actions */}
      <div className="flex flex-col gap-3 border-b border-black/10 dark:border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold tracking-wide html:not(.dark):!text-slate-900 dark:!text-white">Customers</h3>
          <span className="hidden md:inline text-xs text-slate-500 dark:text-white/60">{filtered.length} records</span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl px-3 h-9 ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-white/5 w-full md:w-72">
            <SearchIcon className="h-4 w-4 opacity-70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, emails, plans…"
              className="bg-transparent outline-none text-sm placeholder:opacity-60 w-full"
            />
          </div>

          {/* Actions */}
          <Button variant="soft" size="sm"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="brand" size="sm"><Plus className="h-4 w-4" /> Add</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-2 py-2">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 table-thead">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-left font-semibold html:not(.dark):!text-slate-900 dark:!text-white/80 select-none cursor-pointer"
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext()) as React.ReactNode}
                    {({ asc: ' ↑', desc: ' ↓' } as Record<string, string>)[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-black/6 dark:divide-white/8">
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="hover:bg-black/5 dark:hover:bg-white/8 transition">
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="px-4 py-3 text-slate-800 dark:text-slate-200">
                    {(flexRender(c.column.columnDef.cell, c.getContext()) ?? String(c.getValue() as any)) as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className="px-4 py-10 text-center text-subtle">No matching results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 p-4 text-xs text-subtle md:flex-row md:items-center md:justify-between">
        <div>
          Showing <span className="font-medium html:not(.dark):!text-slate-900 dark:!text-white/90">{filtered.length === 0 ? 0 : from}–{to}</span> of {filtered.length}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  )
}
