import nProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'
import { toast } from '~/composables/notification'
import { layoutRoute } from '~/router/route'

nProgress.configure({ showSpinner: false, trickleSpeed: 200 })

const ROUTE = [
  ...routes,
  ...layoutRoute,
  {
    path: '/forbidden',
    meta: {
      forbidden: true,
    },
    component: {
      render() {
        return h('div', { style: { color: 'red' } }, 'is forbidden page')
      },
    },
    beforeEnter() {
      return true
    },
  },
]

console.log('routes', ROUTE)

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTE,
})
/**
 * 权限控制
 */
router.beforeResolve(async (to, from) => {
  console.log('beforeResolve', to)
  if (to.meta.forbidden) {
    const timeout = 1000
    toast.error('禁止访问', { timeout })
    await new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
    return false
  }

  return true
})

router.beforeEach(() => {
  console.log('beforeEach')
  nProgress.start()
})

router.afterEach((to, from, failure) => {
  console.log('afterEach', { to, from, failure })
  nProgress.done()
})
