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
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const [focused, setFocused] = React.useState(false)
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
        <motion.div
          className="relative group"
          initial={false}
          animate={{ scale: focused ? 1.01 : 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.22 }}
        >
          {/* gradient BORDER wrapper (no fill) */}
          <div className="p-[1.5px] rounded-2xl transition-all duration-200 bg-transparent group-focus-within:bg-gradient-to-r from-indigo-400/60 via-fuchsia-400/60 to-pink-400/60">
            <div className="relative flex items-center gap-2 h-10 pl-3 pr-2 rounded-[14px] bg-white/80 dark:bg-white/5 backdrop-blur [transition:box-shadow_.2s,background_.2s,width_.25s] w-40 md:w-64 focus-within:w-48 md:focus-within:w-72 shadow-[inset_0_0_0_1px_rgba(2,6,23,0.10)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
              <Search className="h-4 w-4 opacity-70" />

              <motion.input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={searchPlaceholder}
                className="bg-transparent outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-0 shadow-none appearance-none text-sm placeholder:opacity-60 w-full caret-slate-700 dark:caret-white"
                initial={false}
                animate={{ opacity: focused ? 1 : 0.95 }}
                transition={{ duration: 0.2 }}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="grid place-items-center rounded-md p-1 hover:bg-black/10 dark:hover:bg-white/10 transition"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 opacity-70" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {rightActions ?? (
          <>
            <Button variant="soft" size="sm" animated>Export</Button>
            <Button variant="brand" size="sm" animated>Create</Button>
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
          <Button variant="outline" size="sm" animated disabled={!table.getCanPreviousPage()}>Prev</Button>
          <Button variant="outline" size="sm" animated disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  )
}