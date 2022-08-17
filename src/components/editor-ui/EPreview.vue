<script setup lang="ts">
import PreviewPage from '../../pages/editor/Preview.html?raw'
import { createBlobURL } from '~/utils/utils'
const frame = ref()

const srcDoc = PreviewPage.replace('/<!--IMPORT_MAP-->/', JSON.stringify({
  'vue-demi': 'https://unpkg.com/vue-demi/lib/index.mjs',
}))

const iframeSrc = createBlobURL(srcDoc, 'text/html')
console.log('previewPage', { srcDoc, iframeSrc })
</script>

<template>
  <iframe ref="frame" :src="iframeSrc" width="100%" height="100%" />
</template>
