import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    // Pages are prerendered as /path/index.html, so every URL ends with a slash.
    trailingSlash: 'always',
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Cross-fade every navigation; elements that share a view-transition-name morph between pages.
    defaultViewTransition: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
