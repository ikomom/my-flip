<script setup lang="ts">
import { isEqual } from 'lodash-es'
import Gcd from '~/pages/algorithms/modules/gcd.vue'
import UnionFind from '~/pages/algorithms/modules/union-find/unionFind.vue'

const checkedKey = shallowRef(UnionFind)
const Options = [
  {
    value: Gcd,
    title: '欧几里得算法',
  },
  {
    value: UnionFind,
    title: '并查集',
  },
]
</script>

<template>
  <n-space>
    <n-tag
      v-for="opt in Options"
      :key="opt.value" :checked="isEqual(checkedKey, opt.value)" checkable
      @click="checkedKey = opt.value"
    >
      {{ opt.title }}
    </n-tag>
  </n-space>
  <n-divider style="margin-top: 10px;margin-bottom: 10px" />
  <component :is="checkedKey" />
</template>

<style scoped>

</style>
