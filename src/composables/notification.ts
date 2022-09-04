import type { App } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export const installNotification = (app: App<Element>) => {
  app.use(Toast, {
    showCloseButtonOnHover: true,
  } as PluginOptions)
}

export const toast = useToast()
