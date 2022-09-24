<script setup lang="ts">
import { cloneDeep, isEqual, random, range } from 'lodash-es'
import { Anchor } from 'two.js/src/anchor'
import { chroma, useTwoJs } from '~/composables'
import PopNumConfirm from '~/pages/algorithms/components/PopNumConfirm.vue'

// TODO: 1. 扩展为迷宫连接，优化渲染函数; 2. 现在应该用曲线连接，不然跨节点会重合; 3. 使用 @antv/g6 重构 4. 学习 union-find库
const originSet = range(0, 16)
const container = ref()
const radius = 20
const unionSet: number[][] = reactive([]) // 联通分量
const unionLineSet: number[][] = reactive([]) // 原始的对象集合, 用于画线

const { run } = useTwoJs(container, {
  render(two) {
    const numPos: { x: number; y: number }[] = []
    for (const num of originSet) {
      const offset = num * radius * 4 + radius
      const half = 8
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
      two.makePath(item.map((num) => {
        const { x, y } = numPos[num]
        return new Anchor(x, y)
      })).noFill()
    }
    console.log('numPos', numPos)
  },
})

const command = {
  test() {
    command.union(1, 3)
    command.union(9, 7)
    command.union(1, 7)
  },
  clear() {
    unionSet.length = 0
    unionLineSet.length = 0
    console.log('clear')
  },
  separate(n1: number, n2: number) {
    const connected = command.findConnect(n1, n2)
    if (connected) {
      for (let i = 0; i < unionSet.length; i++) {
        const n1Index = unionSet[i].indexOf(n1)
        const n2Index = unionSet[i].indexOf(n2)
        if (n1Index !== -1 && n2Index !== -1) {
          unionSet[i] = unionSet[i].filter((_, index) => ![n1Index, n2Index].includes(index))
          break
        }
      }
      for (let i = 0; i < unionLineSet.length; i++) {
        if (isEqual([n1, n2], unionLineSet[i]))
          unionLineSet[i].splice(i, 1)
      }
    }
    else {
      toast.warning(`${[n1, n2]}未连接`)
    }
  },
  union(n1: number, n2: number) {
    const connected = command.findConnect(n1, n2)
    if (connected) {
      toast.warning(`[${[n1, n2]}]已经连接`)
    }
    else {
      // 查找是否单个数已经在已连接的节点中
      let n1Index = -1
      let n2Index = -1

      for (let i = 0; i < unionSet.length; i++) {
        const item = unionSet[i]
        if (n2Index === -1 && item.includes(n1))
          n2Index = i
        else if (n1Index === -1 && item.includes(n2))
          n1Index = i
      }
      console.log({ n1Index, n2Index }, cloneDeep(unionSet))
      // 合并已有的项目
      if (n1Index !== -1 && n2Index !== -1) {
        unionSet[n1Index] = unionSet[n1Index].concat(unionSet[n2Index])
        unionSet.splice(n2Index, 1)
      }
      else if (n1Index !== -1) {
        unionSet[n1Index].push(n1)
      }
      else if (n2Index !== -1) {
        unionSet[n2Index].push(n2)
      }
      else {
        unionSet.push([n1, n2])
      }
      unionLineSet.push([n1, n2])
    }
  },
  findConnect(n1: number, n2: number) {
    for (const item of unionSet) {
      if (item.length < 2)
        continue
      if (item.includes(n1) && item.includes(n2))
        return true
    }

    return false
  },
}

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
      <div v-for="(item, index) in unionSet" :key="index">
        {{ item }}
      </div>
    </n-col>
    <n-col :span="16">
      <div ref="container" b="1" />
    </n-col>
  </n-row>
</template>

<style scoped>

</style>
