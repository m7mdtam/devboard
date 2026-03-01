import {
  createBrowserHistory,
  createRouter,
  Navigate,
  RouterProvider,
} from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { Route as rootRoute } from '@/routes/__root'
import { Route as appRoute } from '@/routes/_app'
import { Route as homeRoute } from '@/routes/_app/index'
import { Route as boardIndexRoute } from '@/routes/_app/board/index'
import { Route as boardIdRoute } from '@/routes/_app/board/$boardId'

const routeTree = rootRoute.addChildren([
  appRoute.addChildren([homeRoute, boardIndexRoute, boardIdRoute]),
])

const history = createBrowserHistory()

const router = createRouter({
  routeTree,
  history,
  defaultNotFoundComponent: () => <Navigate to="/" />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function AppRouter() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="devboard-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
