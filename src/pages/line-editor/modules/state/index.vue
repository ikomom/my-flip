<script setup lang="ts">
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore } from '~/pages/line-editor/data'

const store = useDataSourceStore()
</script>

<template>
  states 列出所有状态
  <LineEditorList :data-source="store.dataSource">
    <template #default="{ item }">
      <span text-blue>{{ item.type }}</span> {{ item.stateKey }}
    </template>
  </LineEditorList>
</template>
