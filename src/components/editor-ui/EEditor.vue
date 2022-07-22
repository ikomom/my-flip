<script setup lang="ts">
const props = defineProps<{ language: string; value: string }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = $ref()
// TODO
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
