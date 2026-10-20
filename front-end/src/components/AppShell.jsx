import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}
