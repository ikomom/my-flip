<script setup lang="ts">
import TestStateResolve from './TestStateResolve.vue'
import { useDataSourceStore } from '~/pages/line-editor/data'

const store = useDataSourceStore()
</script>

<template>
  <!-- states 列出所有状态
  <LineEditorList :data-source="store.dataSource">
    <template #default="{ item }">
      <span text-blue>{{ item.type }}</span> {{ item.stateKey }}
    </template>
  </LineEditorList> -->
  <TestStateResolve />
</template>
