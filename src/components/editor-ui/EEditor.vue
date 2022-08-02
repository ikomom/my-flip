<script setup lang="ts">
import type { languageType } from '~/composables/use-monaco'
import useMonaco from '~/composables/use-monaco'

const props = defineProps<{ language: languageType }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = ref()

const { onChange, setContent } = useMonaco(target, {
  code: '',
  language: props.language,
})
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
