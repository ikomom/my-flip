<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <div bg-red color-white>
    red: {{ id }}
  </div>
</template>

<style scoped>

</style>
