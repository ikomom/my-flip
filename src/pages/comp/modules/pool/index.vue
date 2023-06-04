<script setup lang="ts">
import { TaskPool } from '~/pages/comp/modules/pool/index'

const pool = new TaskPool()

function run() {
  pool.clear()
  for (let i = 0; i < 100; i++) {
    pool.add(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log('resolve ', i)
          resolve()
        }, 2000 + Math.random() * 1000)
      })
    })
  }
}
</script>

<template>
  <button btn @click="run()">
    run
  </button>
</template>
