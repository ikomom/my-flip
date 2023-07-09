<script setup lang="ts">
import SplitPaneContent from './modules/SplitPaneContent.vue'
import { sleep } from '~/utils/utils'
import { EEditorProvider } from '~/composables/editor/EditorCore'

await sleep(1000)
</script>

<template>
  <EEditorProvider>
    <SplitPaneContent />
  </EEditorProvider>
</template>

<style>

</style>

<style scoped lang="scss">
</style>
