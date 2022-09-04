<script lang="ts" setup>
defineProps<{ active: boolean }>()
const tab = ref()
const width = ref()
onMounted(() => {
  width.value = getComputedStyle(tab.value).width
  console.log(tab)
})
</script>

<template>
  <div
    ref="tab"
    text-xs
    items-center
    h="8"
    p="t-1 x-2"
    cursor-pointer
    truncate
    b="r-1 #dde1e3"
    :style="{ width }"
    bg="hover:#dee2e6 dark:hover:#0000"
    :class="{ 'text-green-500': active }"
  >
    <i w-4 h-4 relative top-1 inline-block i-vscode-icons-file-type-vue />
    <slot />
  </div>
</template>

