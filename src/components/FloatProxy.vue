<script setup lang="ts">
import { metaData } from '~/composables/floating'

const props = defineProps<{
  modalValue?: boolean
}>()
const attrs = useAttrs()

metaData.props = props
metaData.attrs = attrs
</script>

<template>
  <slot />
  <div>
    {{ metaData }}
  </div>
</template>

<style scoped>
</style>
