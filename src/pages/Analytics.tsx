import TableCard from '../widgets/TableCard'
import Button from '../ui/Button'
import { ColumnDef } from '@tanstack/react-table'
import { Boxes, GraduationCap, ShieldBan, ClipboardList } from 'lucide-react'

type Row = {
  id: number
  name: string
  description?: string
  group?: string
  order?: number
}

const disciplineRows: Row[] = [
  { id: 1, name: 'Civil', group: 'Engineering', order: 1 },
  { id: 2, name: 'Mechanical', group: 'Engineering', order: 2 },
  { id: 3, name: 'Electrical', group: 'Engineering', order: 3 },
  { id: 4, name: 'Plumbing', group: 'Services', order: 4 },
  { id: 5, name: 'Fire Safety', group: 'Services', order: 5 },
]

const gradesRows: Row[] = [
  { id: 1, name: 'Grade A', description: 'High precision estimation', order: 1 },
  { id: 2, name: 'Grade B', description: 'Optimized cost baseline', order: 2 },
  { id: 3, name: 'Grade C', description: 'Preliminary rough order', order: 3 },
]

const exclusionsRows: Row[] = [
  { id: 1, name: 'Landscaping', description: 'Excluded unless specified' },
  { id: 2, name: 'Fencing', description: 'Only boundary walls included' },
  { id: 3, name: 'Interior Design', description: 'FF&E outside scope' },
]

const assumptionsRows: Row[] = [
  { id: 1, name: 'Working hours', description: 'Mon–Sat, 9am–6pm' },
  { id: 2, name: 'Material escalation', description: '3% QoQ assumed' },
  { id: 3, name: 'Site access', description: 'Continuous access available' },
]

const baseCols: ColumnDef<Row, any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  { header: 'Group', accessorKey: 'group' },
  { header: 'Order', accessorKey: 'order' },
]

function SectionTitle({
  icon: Icon,
  label,
}: { icon: React.ComponentType<any>; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
      <Icon className="h-4 w-4 opacity-70" />
      <span>{label}</span>
    </div>
  )
}

export default function Analytics() {
  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Analytics</h2>
        <div className="flex gap-2">
          <Button variant="soft">Download CSV</Button>
          <Button variant="brand">New Report</Button>
        </div>
      </div>

      {/* 2×2 grid with external titles */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-2">
          <SectionTitle icon={Boxes} label="Discipline Master" />
          <TableCard<Row>
            columns={[
              baseCols[0],
              { header: 'Parent Group', accessorKey: 'group' },
              { header: 'Order', accessorKey: 'order' },
            ]}
            rows={disciplineRows}
            searchKeys={['name', 'group']}
            searchPlaceholder="Search disciplines…"
          />
        </div>

        <div className="space-y-2">
          <SectionTitle icon={GraduationCap} label="Grades Master" />
          <TableCard<Row>
            columns={[
              { header: 'Grade', accessorKey: 'name' },
              { header: 'Description', accessorKey: 'description' },
              { header: 'Seq.', accessorKey: 'order' },
            ]}
            rows={gradesRows}
            searchKeys={['name', 'description']}
            searchPlaceholder="Search grades…"
          />
        </div>

        <div className="space-y-2">
          <SectionTitle icon={ShieldBan} label="Standard Exclusions Master" />
          <TableCard<Row>
            columns={[
              { header: 'Exclusion', accessorKey: 'name' },
              { header: 'Details', accessorKey: 'description' },
            ]}
            rows={exclusionsRows}
            searchKeys={['name', 'description']}
            searchPlaceholder="Search exclusions…"
          />
        </div>

        <div className="space-y-2">
          <SectionTitle icon={ClipboardList} label="Standard Assumptions Master" />
          <TableCard<Row>
            columns={[
              { header: 'Assumption', accessorKey: 'name' },
              { header: 'Details', accessorKey: 'description' },
            ]}
            rows={assumptionsRows}
            searchKeys={['name', 'description']}
            searchPlaceholder="Search assumptions…"
          />
        </div>
      </div>
    </div>
  )
}