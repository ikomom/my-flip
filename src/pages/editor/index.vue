<script setup lang="ts">
import SplitPaneContent from './modules/SplitPaneContent.vue'
import { EEditorProvider } from '~/composables/editor/EditorCore'
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
