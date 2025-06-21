<script setup lang="ts">
import { runQuene } from './QueueTest'
import { cloneDeep, compareKeys, timeCount } from '~/pages/js/DeepClone'

const source: any = {
  a: {
    t: 2,
  },
  b: 'xx',
  c: Symbol('a'),
  d(p: any) {
    console.log(p)
  },
  e: [1, 2, 3],
}
source.target = source

const res = cloneDeep(source)
console.table(compareKeys(source, res))
timeCount(() => compareKeys(source, res))
</script>

<template>
  <div>
    1
    <n-button @click="() => runQuene()">
      run quene
    </n-button>
  </div>
</template>

<style scoped>

</style>
