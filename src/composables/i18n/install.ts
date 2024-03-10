import { createI18n } from 'vue-i18n'
import type { App } from 'vue'

export function installI18n(app: App<Element>) {
  const i18n = createI18n({
    legacy: false,
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {
      zh: {
        menu: {
          more: '更多',
        },
      },
      en: {
        menu: {
          more: 'more',
        },
      },
    },
  })
  app.use(i18n)
}
