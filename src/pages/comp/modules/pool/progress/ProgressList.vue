<script setup lang="ts">
import { getSizeDes } from '~/pages/comp/modules/pool/utils'

const props = defineProps<{ name: string; total: number; loaded: number }>()

const percent = computed(() => (props.loaded / props.total).toFixed(2))

const loaded = computed(() => getSizeDes(props.loaded))
const total = computed(() => getSizeDes(props.total))
</script>

<template>
  <div class="progress-list">
    {{ name }} &nbsp;|&nbsp; {{ percent }} {{ loaded }} {{ total }}
  </div>
</template>

<style scoped>

</style>
