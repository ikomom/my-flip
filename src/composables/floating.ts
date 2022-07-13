// import type { Component } from 'vue'

export const metaData = reactive<any>({
  props: {},
  attrs: {},
})

export const proxyEl = ref<HTMLElement | null>()

// export function createFloating<T extends Component>(component: T) {
//   const metaData = reactive<any>({
//     props: {},
//     attrs: {},
//   })
//   const proxyEl = ref<HTMLElement | null>()

//   const container = defineComponent({
//     setup() {

//     },
//   })

//   const proxy = defineComponent({})

//   return {
//     container,
//     proxy,
//   }
// }
