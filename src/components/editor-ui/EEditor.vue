<script setup lang="ts">
import type { languageType } from '~/composables/use-monaco'
import useMonaco from '~/composables/use-monaco'

const props = defineProps<{ language: languageType; value: string }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = ref()

const { onChange, setContent } = useMonaco(target, {
  code: props.value,
  language: props.language,
})

watch(() => props.value, () => setContent(props.value))
onChange(content => emit('change', content))
emit('change', props.value)
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
