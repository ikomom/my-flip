<script setup lang="ts">
import { useDataSourceStore } from '~/pages/line-editor/data'

const store = useDataSourceStore()
</script>

<template>
  <div v-for="(item, idx) in store.dataSource" :key="idx">
    {{ item.stateKey }}
  </div>
</template>

<style scoped>

</style>
