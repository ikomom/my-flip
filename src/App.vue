<script setup lang="ts">
import { TheImageContainer } from '~/composables/image'
</script>

<template>
  <the-nav />
  <main font-sans p="x-4 y-10" text="gray-700 dark:gray-200">
    <router-view />
    <TheImageContainer />
    <Footer />
  </main>
</template>
