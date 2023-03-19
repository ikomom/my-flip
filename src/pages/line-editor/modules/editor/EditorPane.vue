<script setup lang="ts">
import { useEditorState } from '../../data'
import { UseDraggableWithBounding } from '~/composables'

const container = ref()
const state = useEditorState()
</script>

<template>
  <div ref="container" relative h-full>
    <template v-for="item in state.state" :key="item.key">
      <UseDraggableWithBounding
        v-slot="{ x, y, isDragging }"
        p="x-4 y-2"
        border="~ gray-400/30 rounded"
        w="40"
        shadow="~ hover:lg"
        class="absolute select-none cursor-move z-24"
        :bound-element="container"
        :storage-key="`state:${item.key}`"
      >
        👋 {{ item.name }} {{ isDragging }}
        <div class="text-sm">
          {{ Math.round(x) }}, {{ Math.round(y) }}
        </div>
      </UseDraggableWithBounding>
    </template>
  </div>
</template>
