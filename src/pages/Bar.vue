<script setup lang="ts">
const onTransitionEnd = (...args: any[]) => {
  console.log('Bar: onTransitionEnd', args)
}
const onTransitionStart = (...args: any[]) => {
  console.log('Bar: onTransitionStart', args)
}

fetch('/login', {
  method: 'post',
}).then(() => {
  fetch('/user')
})
</script>

<template>
  <div
    flex="~ col"
    items-center
    @transitionstart="onTransitionStart"
    @transitionend="onTransitionEnd"
  >
    <div>Bar</div>
    <div class="space-x-1" mb-10 />
  </div>
</template>

<style scoped>

</style>
