<script setup lang="ts">
import SplitPaneContent from './modules/SplitPaneContent.vue'
import { EEditorProvider } from '~/composables/editor/EditorCore'
</script>

<template>
  <e-editor-provider>
    <split-pane-content />
  </e-editor-provider>
</template>

<style>

</style>

<style scoped lang="scss">
</style>
