<script setup lang="ts">
defineProps<{
  title: string
//   noOverflow?: boolean
//   noRounding?: boolean
}>()
</script>

<template>
  <div
    h-full
    grid="~"
    shadow-lg
    rounded-md
    class="grid-rows-[min-content_auto]"
    border="1  light-900 "
  >
    <div
      flex="~ row"
      rounded-t-md
      text-xs
      items-center
      h="8" p="l-2"
      dark:border="b-1 light-200"
      bg="light-500 dark:dark-800"
    >
      <div flex="1">
        {{ title }}
      </div>
      <div flex="~ row" items-center>
        <slot name="controls" />
      </div>
    </div>
    <div bg="dark:dark-800 light-300" overflow="auto" relative rounded-b-md>
      <slot />
    </div>
  </div>
</template>
