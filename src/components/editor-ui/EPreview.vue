<script setup lang="ts">
import PreviewPage from '~/composables/editor/template/Preview.html?raw'
import { COMP_IDENTIFIER, exportKey, modulesKey, startProcessFile } from '~/composables/editor/compiler/vueCompiler'
import { createBlobURL } from '~/utils/utils'
import { MAIN_FILE, useEditorInject } from '~/composables/editor/EditorCore'

const props = defineProps<{ code?: string; importMap?: string }>()
const { core } = useEditorInject()

const frame = ref()
const iframeSrc = ref()

watchEffect(() => {
  const codeArr = startProcessFile(core)
  if (codeArr.length) {
    const previewHtml = [
      PreviewPage.replace('/<!--IMPORT_MAP-->/', props.importMap),
      `<script >
        window.${modulesKey} = {}
        window.${exportKey} = (mod, key, get) => {
          Object.defineProperty(mod, key, {
            enumerable: true,
            configurable: true,
            get
          })
        }
       <\/script>`,
      ...codeArr.map(code => (
        `<script type="module">
        ${code}
       <\/script>
      `
      )),
      `<script type="module">
          import { createApp } from 'vue'
          createApp(${modulesKey}["${MAIN_FILE}"]).mount('#app')
       <\/script>`,
    ].join('\n')

    //   srcDoc += `<script type="module">
    //   <\/script>`

    iframeSrc.value = createBlobURL(previewHtml, 'text/html')
    console.log('preview codeArr', { codeArr, previewHtml, iframeSrc })
  }
})
</script>

<template>
  <iframe ref="frame" :src="iframeSrc" width="100%" height="100%" />
</template>
