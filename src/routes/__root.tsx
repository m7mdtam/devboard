import { createRootRoute, Outlet } from '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string
  }
}

function RootComponent() {
  return (
    <main className="min-h-dvh">
      <Outlet />
    </main>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: ({ matches }) => {
    const routeWithTitle = [...matches]
      .reverse()
      .find((m) => m.staticData?.title)
    document.title = routeWithTitle?.staticData?.title
      ? `${routeWithTitle.staticData.title} | DevBoard`
      : 'DevBoard'
  },
})
