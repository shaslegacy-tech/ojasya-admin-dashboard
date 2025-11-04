import { motion } from 'framer-motion'
import TableCard from '../widgets/TableCard'
import Button from '../ui/Button'
import { ColumnDef } from '@tanstack/react-table'
import { Boxes, GraduationCap, ShieldBan, ClipboardList, Download, Plus } from 'lucide-react'

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

// shared column model (edit per card as needed)
const baseCols: ColumnDef<Row, any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Description', accessorKey: 'description' },
  { header: 'Group', accessorKey: 'group' },
  { header: 'Order', accessorKey: 'order' },
]

// Motion presets
const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
}

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }
}

function SectionTitle({ icon: Icon, label, hint }: { icon: React.ComponentType<any>, label: string, hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 grid place-items-center rounded-xl bg-black/5 dark:bg-white/10 ring-1 ring-black/10 dark:ring-white/10">
          <Icon className="h-4 w-4 opacity-80" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-wide html:not(.dark):!text-slate-900 dark:!text-white/90">
            {label}
          </h3>
          {hint && <p className="text-xs text-slate-600 dark:text-white/60">{hint}</p>}
        </div>
      </div>
      {/* subtle gradient underline */}
      <div className="hidden xl:block h-[2px] w-24 rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 opacity-60" />
    </div>
  )
}

export default function Analytics() {
  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight html:not(.dark):!text-slate-900 dark:!text-white">
            Analytics
          </h2>
          <p className="text-sm text-slate-600 dark:text-white/60">
            Masters & operational datasets at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="soft" size="md" animated>
            <Download className="h-4 w-4" /> Download CSV
          </Button>
          <Button variant="brand" size="md" animated>
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </div>
      </div>

      {/* 2×2 Grid (animated reveal) */}
      <motion.div
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Discipline */}
        <motion.div variants={cardVariants} className="space-y-2">
          <SectionTitle icon={Boxes} label="Discipline Master" hint="Core engineering categories" />
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
        </motion.div>

        {/* Grades */}
        <motion.div variants={cardVariants} className="space-y-2">
          <SectionTitle icon={GraduationCap} label="Grades Master" hint="Quality bands & sequencing" />
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
        </motion.div>

        {/* Exclusions */}
        <motion.div variants={cardVariants} className="space-y-2">
          <SectionTitle icon={ShieldBan} label="Standard Exclusions Master" hint="Commonly out-of-scope items" />
          <TableCard<Row>
            columns={[
              { header: 'Exclusion', accessorKey: 'name' },
              { header: 'Details', accessorKey: 'description' },
            ]}
            rows={exclusionsRows}
            searchKeys={['name', 'description']}
            searchPlaceholder="Search exclusions…"
          />
        </motion.div>

        {/* Assumptions */}
        <motion.div variants={cardVariants} className="space-y-2">
          <SectionTitle icon={ClipboardList} label="Standard Assumptions Master" hint="Baseline working rules" />
          <TableCard<Row>
            columns={[
              { header: 'Assumption', accessorKey: 'name' },
              { header: 'Details', accessorKey: 'description' },
            ]}
            rows={assumptionsRows}
            searchKeys={['name', 'description']}
            searchPlaceholder="Search assumptions…"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}