<script setup lang="ts">
import { TheImageProxy } from '~/composables/image'

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
    <TheImageProxy :class="value ? 'w-80 h-50' : 'h-100 w-60' " rounded-xl />
  </div>
</template>
