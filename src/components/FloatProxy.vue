<script setup lang="ts">
import { metaData, proxyEl } from '~/composables/floating'

// const props = defineProps<{
//   modalValue?: boolean
// }>()
const attrs = useAttrs()
const el = ref<HTMLElement>()

// metaData.props = props
metaData.attrs = attrs

onMounted(() => {
  proxyEl.value = el.value
})
</script>

<template>
  <div ref="el" bg-gray-200:80>
    <slot />
  </div>
</template>

<style scoped>
</style>
