<script lang="ts" setup>
const bool = $ref(false)
const imgSrc = computed(() => bool ? 'https://img.cc0.cn/unsplash/2019102200284640791.jpg/tuijian' : 'https://img.cc0.cn/unsplash/2019102200312841111.jpg/tuijian')
</script>

<template>
  <div overflow-hidden transition-all transition-duration-500 @click="bool = !bool">
    <img w-full h-full object-cover :src="imgSrc">
  </div>
</template>
