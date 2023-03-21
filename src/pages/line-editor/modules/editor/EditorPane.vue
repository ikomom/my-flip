<script setup lang="ts">
import { useEditorState } from '../../data'
import { UseDraggableWithBounding } from '~/composables'

const container = ref<HTMLDivElement>()
const state = useEditorState()
</script>

<template>
  <div ref="container" relative h-80>
    <template v-for="(item, index) in state.state" :key="item.key">
      <UseDraggableWithBounding
        v-slot="{ x, y, isDragging, isHover }"
        p="x-4 y-2"
        border="~ gray-400/50 rounded"
        w="40"
        shadow=" ~ hover:lg dark:white/30"
        class="absolute select-none cursor-move bg-white dark:bg-black"
        :bound-element="container"
        :storage-key="`state:${item.key}`"
        :style="{ zIndex: index }"
      >
        <span op50>[{{ index + 1 }}]</span>
        {{ item.name }}<br> isDragging: {{ isDragging }} isHover: {{ isHover }}
        <div class="text-sm">
          {{ Math.round(x) }}, {{ Math.round(y) }}
        </div>
      </UseDraggableWithBounding>
    </template>
  </div>
</template>
