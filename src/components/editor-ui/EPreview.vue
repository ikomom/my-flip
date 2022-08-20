<script setup lang="ts">
import PreviewPage from '../../pages/editor/Preview.html?raw'
import { COMP_IDENTIFIER } from '~/composables/editor/compiler/vueCompiler'
import { createBlobURL } from '~/utils/utils'

const props = defineProps<{ code?: string; importMap?: string }>()

const frame = ref()
const iframeSrc = ref()

watchEffect(() => {
  let srcDoc = PreviewPage.replace('/<!--IMPORT_MAP-->/', props.importMap)

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
