<script lang="ts" setup>
const route = useRoute()
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
      <router-link btn to="/foo">
        /foo
      </router-link>
      <router-link btn to="/bar">
        /bar
      </router-link>
      <router-link btn to="/tableTest">
        /table
      </router-link>
    </div>
  </div>
</template>

