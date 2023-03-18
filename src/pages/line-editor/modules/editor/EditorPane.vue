<script setup lang="ts">
import { useDraggableWithBounding } from '~/composables'

const container = ref()
const element = ref()

const { x: dragX, y: dragY, isDragging } = useDraggableWithBounding(element, {
  boundElement: container,
})

const style = computed(() => {
  return {
    left: `${dragX.value}px`,
    top: `${dragY.value}px`,
  }
})
</script>

<template>
  <div ref="container" relative h-full>
    <div
      ref="element"
      p="x-4 y-2"
      border="~ gray-400/30 rounded"
      w="40"
      shadow="~ hover:lg"
      class="absolute bg-$vp-c-bg select-none cursor-move z-24"
      :style="style"
    >
      👋 Drag me! {{ isDragging }}
      <div class="text-sm opacity-50">
        I am at {{ Math.round(dragX) }}, {{ Math.round(dragY) }}
      </div>
    </div>
  </div>
</template>
