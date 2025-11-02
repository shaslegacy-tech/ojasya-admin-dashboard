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

type User = {
  name: string
  email: string
  plan: string
  mrr: number
  status: 'Active' | 'Paused'
}

const data: User[] = Array.from({ length: 18 }).map((_, i) => ({
  name: `User ${i+1}`,
  email: `user${i+1}@example.com`,
  plan: ['Starter','Pro','Enterprise'][i%3],
  mrr: [80,2900,14900][i%3],
  status: i%4===0 ? 'Paused' : 'Active'
}))

const columns: ColumnDef<User>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Plan', accessorKey: 'plan' },
  { header: 'MRR', accessorKey: 'mrr', cell: ({ getValue }) => `₹${getValue<number>().toLocaleString()}` },
{ header: 'Status', accessorKey: 'status',
  cell: ({ getValue }) => {
    const v = getValue<User['status']>()
    const cls = v === 'Active'
      ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400'
      : 'rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400'
    return <span className={cls}>{v}</span>
  }
},
]

export default function UsersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="panel">
      <div className="flex items-center justify-between px-4 py-3 border-surface">
        <h3 className="text-sm font-semibold">Customers</h3>
        <div className="flex gap-2">
          <button className="rounded-2xl px-3 py-1.5 bg-white/10 hover:bg-white/14">Export</button>
          <button className="rounded-2xl px-3 py-1.5 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white hover:brightness-[1.06]">Add</button>
        </div>
      </div>
      <div className="overflow-x-auto px-2 py-2">
        <table className="min-w-full text-sm">
          <thead className="text-left text-subtle">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="px-4 py-3 font-medium select-none cursor-pointer" onClick={h.column.getToggleSortingHandler()}>
                    {flexRender(h.column.columnDef.header, h.getContext()) as React.ReactNode}
                    {({ asc: ' ↑', desc: ' ↓' } as Record<string, string>)[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map(r => (
              <tr key={r.id} className="hover:panel-hover">
                {r.getVisibleCells().map(c => (
                  <td key={c.id} className="px-4 py-3">
                    {(flexRender(c.column.columnDef.cell, c.getContext()) ?? String(c.getValue() as any)) as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-xs text-subtle">
        <div>Rows: {table.getRowModel().rows.length}</div>
        <div className="flex gap-2">
          <button className="rounded-2xl px-2 py-1 bg-white/10 hover:bg-white/14">Prev</button>
          <button className="rounded-2xl px-2 py-1 bg-white/10 hover:bg-white/14">Next</button>
        </div>
      </div>
    </div>
  )
}
