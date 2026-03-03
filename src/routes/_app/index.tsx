import { createRoute } from '@tanstack/react-router'
import { Route as appRoute } from '../_app'
import HomePage from '@/pages/home'

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: HomePage,
  staticData: {
    title: 'Home',
  },
})
