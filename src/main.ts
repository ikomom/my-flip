import { createApp } from 'vue'
import App from './App.vue'
import { installNotification } from '~/composables/notification'
import { router } from '~/router'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
//
// if (process.env.NODE_ENV === 'development') {
//   const worker = import.meta.glob('./mocks/browser.ts')
//   worker['./mocks/browser.ts']().then(({ worker }) => {
//     console.log('worker', worker.start())
//   })
// }

const app = createApp(App)
installNotification(app)
app.use(router)
app.mount('#app')
