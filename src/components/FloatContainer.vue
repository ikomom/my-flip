<script setup lang="ts">
import type { StyleValue } from 'vue'
import { metaData, proxyEl } from '~/composables/floating'

const rect = reactive(useElementBounding(proxyEl))

const style = computed((): StyleValue => {
  return {
    transition: 'all .5s ease-in-out',
    position: 'fixed',
    left: `${rect?.left}px`,
    top: `${rect?.top}px`,
  }
})
</script>

<template>
  <slot v-bind="metaData.attrs ? metaData.attrs : {}" :style="style" />
  <div>
    {{ rect }}
  </div>
</template>

<style scoped>

</style>
