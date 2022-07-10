<script lang="ts" setup>
const bool = $ref(false)
</script>

<template>
  <div overflow-hidden @click="bool = !bool">
    <img v-if="bool" src="https://img.cc0.cn/unsplash/2019102200284640791.jpg/tuijian">
    <img v-else src="https://img.cc0.cn/unsplash/2019102200312841111.jpg/tuijian">
  </div>
</template>
