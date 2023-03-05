<script setup lang="ts">
import { cloneDeep, isEqual, random, range } from 'lodash-es'
import { Anchor } from 'two.js/src/anchor'
import { chroma, useTwoJs } from '~/composables'
import PopNumConfirm from '~/pages/algorithms/components/PopNumConfirm.vue'
import { useUnionFind } from '~/pages/algorithms/modules/union-find/use-union-find'

// TODO: 1. 扩展为迷宫连接，优化渲染函数; 2. 现在应该用曲线连接，不然跨节点会重合; 3. 使用 @antv/g6 重构 4. 学习 union-find库
const originSet = range(0, 10)
const container = ref()
const radius = 20

const { command, unionLineSet, unionSet } = useUnionFind('V3', 9) as any

const { run } = useTwoJs(container, {
  render(two) {
    const numPos: { x: number; y: number }[] = []
    for (const num of originSet) {
      const offset = num * radius * 4 + radius
      const half = 5
      const x = num < half ? offset : (num - half) * radius * 4 + radius
      const y = num < half ? radius : 200
      const circle = two.makeCircle(x, y, radius)
      circle.fill = chroma.random().hex()
      circle.noStroke()

      const text = two.makeText(String(num), x, y, {
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      })
      text.fill = '#fff'
      numPos.push({ x, y })
    }
    for (let i = 0; i < unionLineSet.length; i++) {
      const item = unionLineSet[i]
      two.makePath(item.map((num: any) => {
        const { x, y } = numPos[num]
        return new Anchor(x, y)
      })).noFill()
    }
    console.log('numPos', numPos)
  },
})

watch(unionLineSet, () => {
  run()
})
</script>

<template>
  <n-row>
    <n-col :span="8">
      <div class="space-x-1" mb-10>
        <PopNumConfirm @ok="(data) => command.union(data.n1, data.n2)">
          <template #trigger>
            <button btn text-sm>
              union
            </button>
          </template>
        </PopNumConfirm>
        <PopNumConfirm @ok="(data) => command.separate(data.n1, data.n2)">
          <template #trigger>
            <button btn text-sm>
              separate
            </button>
          </template>
        </PopNumConfirm>

        <button btn text-sm @click="command.test()">
          test
        </button>
        <button btn text-sm @click="command.clear()">
          clear
        </button>
      </div>

      {{ unionSet }}
      <n-divider />
      {{ unionLineSet }}
    </n-col>
    <n-col :span="16">
      <div ref="container" b="1" />
    </n-col>
  </n-row>
</template>

<style scoped>

</style>
