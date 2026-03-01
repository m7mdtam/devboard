import { createRoute, redirect } from '@tanstack/react-router'
import { Route as appRoute } from '../../_app'

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: 'board',
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
  staticData: {
    title: 'Board',
  },
})
