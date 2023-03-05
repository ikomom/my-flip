<script setup lang="ts">
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore, useEditorState } from '~/pages/line-editor/data'
import EditState from '~/pages/line-editor/modules/editor/EditState.vue'

const store = useDataSourceStore()
const editor = useEditorState()
const editState = ref()

const onReset = () => {
  const s = confirm('reset all')
  if (s)
    store.$reset()
}
</script>

<template>
  <header>
    <button btn @click="onReset()">
      reset
    </button>
  </header>
  <main>
    <LineEditorList :data-source="editor.state" @edit="editState.show($event.item)">
      <template #default="{ item }">
        {{ item }}
      </template>
    </LineEditorList>
  </main>
  <EditState ref="editState" />
</template>

<style scoped>

</style>
