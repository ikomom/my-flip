<script setup lang="ts">
import { darkTheme, lightTheme } from 'naive-ui'
import { TheImageContainer } from '~/composables/image'

const theme = computed(() => isDark.value ? darkTheme : lightTheme)
</script>

<template>
  <n-config-provider :theme="theme">
    <the-nav />
    <main font-sans p="x-4 y-10" text="gray-700 dark:gray-200">
      <router-view />
      <TheImageContainer />
      <Footer />
    </main>
  </n-config-provider>
</template>
