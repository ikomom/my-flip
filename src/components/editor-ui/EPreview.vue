<script setup lang="ts">
import PreviewPage from '../../pages/editor/Preview.html?raw'
import { COMP_IDENTIFIER } from '~/composables/editor/compiler/vueCompiler'
import { createBlobURL } from '~/utils/utils'

const props = defineProps<{ code?: string }>()

const frame = ref()
const iframeSrc = ref()

watchEffect(() => {
  let srcDoc = PreviewPage.replace('/<!--IMPORT_MAP-->/', JSON.stringify({
    imports: {
      'vue': 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
      'vue-demi': 'https://unpkg.com/vue-demi/lib/index.mjs',
    },
  }))

  srcDoc += `<script type="module">
    ${props.code}
     import { createApp } from 'vue'
    createApp(${COMP_IDENTIFIER}).mount('#app') 
<\/script>`
  srcDoc += `<script type="module">
  <\/script>`

  iframeSrc.value = createBlobURL(srcDoc, 'text/html')
  console.log('previewPage', { srcDoc, iframeSrc })
})
</script>

<template>
  <iframe ref="frame" :src="iframeSrc" width="100%" height="100%" />
</template>
