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
    path: '/multiEditor',
  },
  {
    path: '/mapbox',
  },
  {
    path: '/line-editor',
  },
  {
    path: '/workCount',
  },
  {
    path: '/vr',
  },
  {
    path: '/carousal',
  },
  {
    path: '/css',
  },
  {
    path: '/fsm',
  },
  {
    path: '/tensorflow',
  },
  {
    path: '/games',
  },
  {
    path: '/js',
  },
  {
    path: '/comp',
  },
  {
    path: '/cesium',
  },
  {
    path: '/video',
  },
]
</script>

<template>
  <div flex justify-between p-2>
    <div text-large>
      {{ route.path }}
    </div>
    <div flex="~ gap1" font-mono justify-center>
      <router-link btn :to="{ path: '/', state: { index: true } }" mx-2>
        /
      </router-link>
      <SMenu :menus="menus" />
    </div>
  </div>
</template>
