<script lang="ts" setup>
const count = $ref(0)
const imgSrc = 'https://img.cc0.cn/unsplash/2019102200284640791.jpg/tuijian'

onMounted(() => {
  console.log('the image mounted')
})

onBeforeUnmount(() => {
  console.log('the image before mounted')
})
</script>

<template>
  <div cursor-pointer position-relative overflow-hidden transition-all transition-duration-500 @click="count++">
    <img w-full h-full object-cover :src="imgSrc">
    <span absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-t from-black:40 to-transparent text-white font-mono flex items-center justify-center text-50px>{{ count }}</span>
  </div>
</template>
