import type { Component, StyleValue } from 'vue'
import { KeepAlive, Teleport, h } from 'vue'

export const metaData = reactive<any>({
  props: {},
  attrs: {},
})

export interface floatingOptions {
  duration?: number
}

export const proxyEl = ref<HTMLElement | null>()

const defaultOptions = {
  duration: 1000,
}

export function createFloating<T extends Component>(component: T, options?: floatingOptions) {
  const _options = { ...defaultOptions, options }
  const metaData = reactive<any>({
    props: {},
    attrs: {},
  })
  const proxyEl = ref<HTMLElement | null>()

  const container = defineComponent({
    setup() {
      let rect = $ref<DOMRect | undefined>()

      const fixed: StyleValue = {
        'transition': 'all',
        'transition-duration': `${_options.duration}ms`,
        'position': 'fixed',
      }

      const style = computed((): StyleValue => {
        const params = {
          ...fixed,
          left: `${rect?.left}px`,
          top: `${rect?.top}px`,
        }
        if (!rect || !proxyEl.value) {
          return {
            ...params,
            opacity: 0,
          }
        }

        return params
      })

      function update() {
        console.log('update', rect)
        rect = proxyEl.value?.getBoundingClientRect()
      }

      useMutationObserver(proxyEl, update, {
        characterData: true,
        childList: true,
        subtree: true,
        attributes: true,
      })
      useEventListener('resize', update)

      let landed = $ref(false)
      let landing: any

      async function liftOff() {
        console.log('liftOff')
        landed = false
      }
      async function land() {
        console.log('land')
        landing = setTimeout(() => {
          landed = true
        }, _options.duration)
      }

      watch(proxyEl, (el, prev) => {
        update()
        clearTimeout(landing)

        if (prev)
          liftOff()
        if (el)
          land()
      })
      // TODO
      return () => {
        const children = [h(component, metaData.attrs)]
        return (
          h(KeepAlive, {}, [
            landed && proxyEl.value
              ? h(Teleport, { to: proxyEl.value }, children)
              : h('div', { style: style.value }, children),
          ])
        )
      }
    },
  }) as T

  const proxy = defineComponent({
    setup(props, ctx) {
      const attrs = useAttrs()
      const el = ref<HTMLElement>()

      metaData.attrs = attrs

      onMounted(() => {
        proxyEl.value = el.value
      })

      onUnmounted(() => {
        proxyEl.value = undefined
      })

      return () => h('div', { ref: el }, [
        ctx.slots.default ? h(ctx.slots.default) : null,
      ])
    },
  }) as T

  return {
    container,
    proxy,
  }
}
