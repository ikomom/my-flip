// @ts-ignore

import { createApp } from 'vue'
import * as fundebug from 'fundebug-javascript'
// @ts-expect-error
import FundebugVue from 'fundebug-vue'
import App from './App.vue'
import { installPinia } from '~/composables/pinia'
import { installNotification } from '~/composables/notification'
import { router } from '~/router'

import '@unocss/reset/tailwind.css'
import './assets/styles/main.css'
import 'uno.css'

//
// if (process.env.NODE_ENV === 'development') {
//   const worker = import.meta.glob('./mocks/browser.ts')
//   worker['./mocks/browser.ts']().then(({ worker }) => {
//     console.log('worker', worker.start())
//   })
// }
fundebug.init({
  apikey: '51024a11062c24a528ae666bd3c1006e84e6056682a378b16026a4f361493496',
})

const app = createApp(App)
installPinia(app)
installNotification(app)
app.use(new FundebugVue(fundebug))
app.use(router)
app.mount('#app')
