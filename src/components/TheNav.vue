<script lang="ts" setup>
import SMenu from './SMenu.vue'
const route = useRoute()

const menus = [
  {
    path: '/foo',
  },
  {
    path: '/bar',
  },
  {
    path: '/layout',
  },
  {
    path: '/algorithms',
  },
  {
    path: '/forbidden',
  },
  {
    path: '/tableTest',
  },
  {
    path: '/editor',
  },
  {
    path: '/vr',
  },
]
</script>

<template>
  <div flex justify-between p-2>
    <div text-large>
      {{ route.path }}
    </div>
    <div flex="~ gap1" font-mono justify-center>
      <router-link btn to="/">
        /
      </router-link>
      <SMenu :menus="menus" />
    </div>
  </div>
</template>

