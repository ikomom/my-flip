<script lang="ts" setup>
import { useEditorInject } from '~/composables/editor/EditorCore'

const { core: { files } } = useEditorInject()
</script>

<template>
  <div flex>
    <div
      v-for="file in files"
      :key="file.filename"
      rounded-t-md
      text-xs items-center
      h="8"
      p="l-2" dark:border="b-1 light-200" bg="light-500 dark:dark-800"
    >
      {{ file.filename }}
    </div>
  </div>
</template>

<style scoped>

</style>
