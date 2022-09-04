<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <div bg-green color-white>
    first: {{ id }}
  </div>
</template>

<style scoped>

</style>
