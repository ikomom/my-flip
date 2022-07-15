import type { Component, StyleValue } from 'vue'
import { h } from 'vue'

export const metaData = reactive<any>({
  props: {},
  attrs: {},
})

export const proxyEl = ref<HTMLElement | null>()

export function createFloating<T extends Component>(component: T) {
  const metaData = reactive<any>({
    props: {},
    attrs: {},
  })
  const proxyEl = ref<HTMLElement | null>()

  const container = defineComponent({
    setup() {
      let rect = $ref<DOMRect | undefined>()

      const fixed: StyleValue = {
        transition: 'all .5s ease-in-out',
        position: 'fixed',
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
      watchEffect(update)

      return () => h('div', { style: style.value }, [
        h(component, metaData.attrs),
      ])
    },
  })

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
  })

  return {
    container,
    proxy,
  }
}
