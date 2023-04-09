import type { App } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION, useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export function installNotification(app: App<Element>) {
  app.use(Toast, {
    pauseOnHover: false,
    position: POSITION.TOP_CENTER,
    showCloseButtonOnHover: true,
    timeout: 1200,
  } as PluginOptions)
}

export const toast = useToast()
