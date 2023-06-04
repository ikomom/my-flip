<script setup lang="ts">
import Uploader from './modules/uploader/index.vue'
import Pool from './modules/pool/index.vue'

function onCopy() {
  navigator.clipboard.writeText('xxx xxxxxxxxxxxx')
}
</script>

<template>
  <n-space mb-2>
    <button btn @click="onCopy">
      copy
    </button>
    <Pool />
  </n-space>

  <Uploader />
</template>
