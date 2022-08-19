<script lang="ts" setup>
import { useEditorInject } from '~/composables/editor/EditorCore'

const { core } = useEditorInject()
</script>

<template>
  <div
    flex="~ nowrap"
    bg="light-500 dark:dark-800"
    overflow-x-auto overflow-y-hidden
    b="x-1 t-1 #dde1e3"
    rounded-t-md
  >
    <div
      v-for="file in core.files"
      :key="file.filename"
      text-xs
      items-center
      h="8"
      p="t-1 x-2"
      cursor-pointer
      truncate
      b="r-1 #dde1e3"
      bg="hover:#dee2e6 dark:hover:#0000"
      :class="{ 'text-green-500': core.activeFilename === file.filename }"
    >
      <i w-4 h-4 relative top-1 inline-block i-vscode-icons-file-type-vue />
      {{ file.filename }}
    </div>
  </div>
</template>

<style scoped>

</style>
