import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Overview from '../pages/Overview'
import Analytics from '../pages/Analytics'
import Users from '../pages/Users'
import Billing from '../pages/Billing'
import Settings from '../pages/Settings'
import Security from '../pages/Security'
import NotFound from '../pages/NotFound'
import Login from '../pages/auth/Login'
import RequireAuth from './require-auth'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <RequireAuth><MainLayout /></RequireAuth>,
    children: [
      { index: true, element: <Overview /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'users', element: <Users /> },
      { path: 'billing', element: <Billing /> },
      { path: 'settings', element: <Settings /> },
      { path: 'security', element: <Security /> }
    ]
  },
  { path: '*', element: <NotFound /> },
])
export default router
