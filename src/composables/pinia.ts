import { cloneDeep } from 'lodash-es'
import type { PiniaPlugin } from 'pinia'
import { createPinia } from 'pinia'
import type { App } from 'vue'

const resetPlugin: PiniaPlugin = ({ store }) => {
  const initialState = cloneDeep(store.$state)

  store.$reset = () => {
    store.$patch(cloneDeep(initialState))
  }
}

export const installPinia = (app: App<Element>) => {
  const pinia = createPinia()
  pinia.use(resetPlugin)
  app.use(pinia)
}
