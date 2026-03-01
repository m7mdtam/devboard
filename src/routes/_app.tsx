import { createRoute, Outlet } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'

function AppLayout() {
  return <Outlet />
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',
  component: AppLayout,
})
