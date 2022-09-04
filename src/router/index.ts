import nProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'
import { POSITION } from 'vue-toastification'
import { toast } from '~/composables/notification'

nProgress.configure({ showSpinner: false, trickleSpeed: 200 })

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...routes, {
      path: '/forbidden',
      meta: {
        forbidden: true,
      },
      components: {
        render() {
          return h('div', 'forbidden')
        },
      },
      beforeEnter() {
        return true
      },
    }],
})
/**
 * 权限控制
 */
router.beforeResolve(async (to, from) => {
  console.log('beforeResolve', to)
  if (to.meta.forbidden) {
    const timeout = 1000
    toast.error('禁止访问', { timeout, pauseOnHover: false, position: POSITION.TOP_CENTER })
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

router.afterEach(() => {
  console.log('afterEach')
  nProgress.done()
})
