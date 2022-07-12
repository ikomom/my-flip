<script setup lang="ts">
const [value, toggle] = useToggle(true)
</script>

<template>
  <div>
    <div>Index</div>
    <div>
      <RouterLink class="m-3 text-sm btn" to="/foo">
        Foo
      </RouterLink>
      <button m-3 text-sm btn @click="toggle()">
        toggle {{ value }}
      </button>
    </div>

    <float-proxy :class="value ? 'w-80 h-50' : 'h-100 w-60' " rounded-xl />
  </div>
</template>
