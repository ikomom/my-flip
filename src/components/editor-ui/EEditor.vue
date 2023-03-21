<script setup lang="ts">
import type { languageType } from '~/composables/use-monaco'
import useMonaco from '~/composables/use-monaco'

const props = defineProps<{ language: languageType; value: string }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = ref<HTMLDivElement>()

const { onChange, setContent, resize } = useMonaco(target, {
  code: props.value,
  language: props.language,
})

watch(() => props.value, () => setContent(props.value))
onChange(content => emit('change', content))
emit('change', props.value)

const getSize = (num: number, min: number) => num - min > 0 ? num - min : min

defineExpose({
  resize: () => {
    const { width, height } = target.value.parentElement.parentElement.getBoundingClientRect()
    resize({ width: getSize(width, 2), height: getSize(height, 40) })
  },
})
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
