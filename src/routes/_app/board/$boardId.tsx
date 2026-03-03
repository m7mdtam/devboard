import { createRoute } from '@tanstack/react-router'
import { Route as appRoute } from '../../_app'
import BoardPage from '@/pages/board'

export const Route = createRoute({
  getParentRoute: () => appRoute,
  path: 'board/$boardId',
  component: BoardPage,
  staticData: {
    title: 'Board',
  },
})
