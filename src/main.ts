import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
nProgress.configure({ showSpinner: false, trickleSpeed: 200 })
router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

app.use(router)
app.mount('#app')
