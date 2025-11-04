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
import { Search } from 'lucide-react'

type TableCardProps<T extends { id?: string | number }> = {
  columns: ColumnDef<T, any>[]
  rows: T[]
  searchKeys?: (keyof T)[]
  searchPlaceholder?: string
  rightActions?: React.ReactNode
  footer?: React.ReactNode
  maxHeight?: number
  pageSize?: number
}

function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

export default function TableCard<T extends { id?: string | number }>({
  columns,
  rows,
  searchKeys,
  searchPlaceholder = 'Search…',
  rightActions,
  footer,
  maxHeight = 340,
  pageSize = 8,
}: TableCardProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [query, setQuery] = React.useState('')
  const q = useDebounced(query, 250).toLowerCase().trim()

  const keys = React.useMemo<(keyof T)[]>(() => {
    if (searchKeys?.length) return searchKeys
    const first = rows[0] ?? ({} as T)
    return Object.keys(first) as (keyof T)[]
  }, [rows, searchKeys])

  const filteredRows = React.useMemo(() => {
    if (!q) return rows
    return rows.filter((r) =>
      keys.some((k) =>
        String((r as any)[k] ?? '').toLowerCase().includes(q)
      )
    )
  }, [rows, q, keys])

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-transparent">
        <div className="flex items-center gap-2 rounded-2xl px-3 h-9 ring-1 ring-black/10 dark:ring-white/10 bg-white/60 dark:bg-white/5">
          <Search className="h-4 w-4 opacity-70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-transparent outline-none text-sm placeholder:opacity-60 w-40 md:w-56"
          />
        </div>

        {rightActions ?? (
          <>
            <Button variant="soft" size="sm" className="hidden md:inline-flex">
              Export
            </Button>
            <Button variant="brand" size="sm">Create</Button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="px-2">
        <div className="overflow-auto no-scrollbar" style={{ maxHeight }}>
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 table-thead">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                     <th key={h.id} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-white/75 select-none cursor-pointer"
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ width: (h.getSize() ?? undefined) as any }}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext()) as React.ReactNode}
                      {({ asc: ' ↑', desc: ' ↓' } as Record<string, string>)[h.column.getIsSorted() as string] ?? ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {table.getRowModel().rows.map((r) => (
                <tr key={r.id} className="hover:bg-black/6 dark:hover:bg-white/8 transition">
                  {r.getVisibleCells().map((c) => (
                    <td key={c.id} className="px-3 py-2 text-slate-800 dark:text-slate-200">
                      {(flexRender(c.column.columnDef.cell, c.getContext()) ??
                        String(c.getValue() as any)) as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-10 text-center text-subtle"
                    colSpan={table.getAllLeafColumns().length}
                  >
                    No matching results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 text-xs text-subtle">
        {footer ?? (
          <span>
            Showing{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filteredRows.length
            )}{' '}
            of {filteredRows.length}
          </span>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-2xl px-2 py-1 bg-black/5 hover:bg-black/8 dark:bg-white/10 dark:hover:bg-white/14 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-2xl px-2 py-1 bg-black/5 hover:bg-black/8 dark:bg-white/10 dark:hover:bg-white/14 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}