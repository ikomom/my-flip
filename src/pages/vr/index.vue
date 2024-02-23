<script lang="ts" setup>
import Panorama from '~/pages/vr/threejs/Panorama.vue'
import Demo from '~/pages/vr/threejs/Demo.vue'
</script>

<template>
  <n-tabs>
    <n-tab-pane name="demo" tab="demo">
      <Demo />
    </n-tab-pane>
    <n-tab-pane name="panorma" tab="panorma">
      <Panorama />
    </n-tab-pane>
  </n-tabs>
</template>
