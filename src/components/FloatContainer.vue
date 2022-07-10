<script setup>
import { metaData } from '~/composables/floating'
</script>

<template>
  <slot v-bind="metaData.attrs ? metaData.attrs : {}" />
</template>

<style scoped>

</style>
