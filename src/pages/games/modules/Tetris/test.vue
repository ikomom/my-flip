<script lang="ts" setup>
import { ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'

const translateX = ref(0)
const translateY = ref(0)

onKeyStroke(['w', 'W', 'ArrowUp'], () => {
  translateY.value -= 10
})

onKeyStroke(['s', 'S', 'ArrowDown'], () => {
  translateY.value += 10
})
onKeyStroke(['a', 'A', 'ArrowLeft'], () => {
  translateX.value -= 10
})

onKeyStroke(['d', 'D', 'ArrowRight'], () => {
  translateX.value += 10
})
</script>

<template>
  <div w="150px" h="150px" m-auto b="1" relative>
    <div absolute :style="{ left: `${translateX}px`, top: `${translateY}px` }" w="20px" h="20px" bg="red" />
  </div>
</template>
