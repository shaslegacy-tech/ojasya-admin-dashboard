import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar'
import TopNav from '../ui/TopNav'
import clsx from 'clsx'
import { useThemeStore } from '../store/theme'

export default function MainLayout() {
  const { sidebarCollapsed, hoverExpanded } = useThemeStore()
  const expanded = !sidebarCollapsed || hoverExpanded
  const marginClass = expanded ? 'ml-72' : 'ml-[76px]'
  return (
    <div className={clsx('min-h-screen overflow-hidden ink-bg')}>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 h-screen flex-col flex transition-[margin] duration-200">
          <TopNav />
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
