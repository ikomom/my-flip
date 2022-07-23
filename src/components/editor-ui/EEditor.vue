<script setup lang="ts">
import useMonaco from '~/composables/use-monaco'

// const props = defineProps<{ language: string; value: string }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = ref()

useMonaco(target, {
  code: '',
  language: 'javascript',
})
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
