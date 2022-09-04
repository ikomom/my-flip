<script setup lang="ts">
const links = [
  {
    path: '/layout/first',
  },
  {
    path: '/layout/second',
  },
  {
    path: '/layout/third',
  },
]

const route = useRoute()

// watch(route, (val) => {
//   console.log('route', toPlainObject(val))
// })
</script>

<template>
  <div flex h-80>
    <div w-40 b-1 h-full p-2>
      <router-link
        v-for="(link) in links"
        :key="link.path"
        class="mb-1" :class="[route.path.startsWith(link.path) ? 's-link-active' : 's-link']" :to="`${link.path}/${new Date().getTime()}`"
      >
        {{ link.path }}
      </router-link>
    </div>
    <div flex-1 b-1 h-full p-4>
      <router-view p-4 />
    </div>
  </div>
</template>

<style scoped>

</style>
