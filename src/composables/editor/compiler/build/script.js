import { defineComponent as _defineComponent, ref } from 'vue'
import { render } from './templeta'

const __sfc__ = /* #__PURE__ */_defineComponent({
  __name: 'App',
  setup(__props, { expose }) {
    expose()

    const helloWorld = ref('helloWorld')

    const __returned__ = { helloWorld }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
  },

})

__sfc__.render = render
