import type { Component, StyleValue } from 'vue'
import { Teleport, h } from 'vue'

export const metaData = reactive<any>({
  props: {},
  attrs: {},
})

export interface floatingOptions {
  duration?: number
}

export const proxyEl = ref<HTMLElement | null>()

const defaultOptions = {
  duration: 800,
}

export function createFloating<T extends Component>(component: T, options?: floatingOptions) {
  const _options = { ...defaultOptions, options }
  const metaData = reactive<any>({
    props: {},
    attrs: {},
  })
  const proxyEl = ref<HTMLElement | null>()
  const isFly = ref(true)
  const { left, top } = useElementBounding(proxyEl)

  const Container = defineComponent({
    setup() {
      const router = useRouter()
      const cleanRouterGuard = router.beforeEach(async () => {
        isFly.value = true
        await nextTick()
        console.log('起飞')
      })

      onBeforeUnmount(() => {
        console.warn('clean Guard')
        cleanRouterGuard()
      })

      const fixed: StyleValue = {
        'transition-property': 'all',
        'transition-timing-function': 'ease-in-out',
        'transition-delay': '0s',
        'transition-duration': `${_options.duration}ms`,
        'position': 'fixed',
      }

      const getStyle = computed((): StyleValue => {
        const params = {
          ...fixed,
          left: `${left.value}px`,
          top: `${top.value}px`,
          // display: isFly.value ? 'block' : 'none',
        }
        if (!proxyEl.value) {
          // console.log('getStyle:reset', params)
          return {
            ...params,
            display: 'none',
            opacity: 0,
          }
        }
        // console.log('getStyle:block', params)
        return params
      })

      let transition: any

      return () => {
        return (
          h('div',
            {
              style: getStyle.value,
              // onTransitionstart: () => {
              //   console.log('onTransitionstart')
              // },
              onTransitionend: async () => {
                // console.log('onTransitionend')
                await nextTick()
                // isFly.value = false
                // console.log('降落', proxyEl.value)
                clearTimeout(transition)
                transition = setTimeout(() => {
                  isFly.value = false
                  console.log('降落', proxyEl.value)
                }, 200)
              },
            },
            h(
              Teleport,
              { to: (isFly.value || !proxyEl.value) ? 'body' : proxyEl.value, disabled: isFly.value },
              h(component, metaData.attrs),
            ),
          )
        )
      }
    },
  }) as T

  const Proxy = defineComponent({
    setup(props, ctx) {
      metaData.attrs = ctx.attrs
      onBeforeUnmount(() => {
        console.log('Proxy unmounted')
        isFly.value = true
      })
      return () => h('div', { ref: proxyEl, id: 'container' })
    },
  }) as T

  return {
    container: Container,
    proxy: Proxy,
  }
}
