<script setup lang="ts">
import Two from 'two.js'
import { getGcd, getLcm } from '~/utils/algorithms'

const container = ref()
const drawing = reactive({
  width: 800,
  height: 336,
})
const drawTime = ref(20)
const drawTimeout = new Set<any>()

const gcdValue = computed(() => getGcd(drawing.width, drawing.height))
const lcmValue = computed(() => getLcm(drawing.width, drawing.height))

const two = new Two({
  ...drawing,
})

async function drawRect() {
  const len = gcdValue.value
  for (let i = 0; i < drawing.width / len; i++) {
    for (let j = 0; j < drawing.height / len; j++) {
      await new Promise<void>((resolve) => {
        const num = setTimeout(() => {
          console.log('drawRect', [i * len + len / 2, j * len + len / 2], drawTimeout)
          drawTimeout.delete(num)

          const rect = two.makeRectangle(i * len + len / 2, j * len + len / 2, len, len)
          rect.fill = `rgb(${Math.random() * 300}, ${Math.random() * 300},  ${Math.random() * 300})`
          rect.noStroke()
          two.update()
          resolve()
        }, drawTime.value)
        drawTimeout.add(num)
      })
    }
  }
}

function clearDrawTimeArr() {
  console.log('clearDrawTimeArr', [...drawTimeout])
  drawTimeout.forEach(time => clearTimeout(time))
  drawTimeout.clear()
}

async function render() {
  two.clear()
  clearDrawTimeArr()
  two.height = drawing.height
  two.width = drawing.width
  await drawRect()
}

onUnmounted(() => {
  clearDrawTimeArr()
})

onMounted(() => {
  two.appendTo(container.value)
  watch(drawing, () => {
    render()
  }, {
    immediate: true,
  })
})
</script>

<template>
  animateTime:  <input v-model="drawTime" type="number" b="b-1" mx="2">
  width: <input v-model="drawing.width" type="number" b="b-1" mx="2">
  height: <input v-model="drawing.height" type="number" b="b-1" mx="2">
  <span bg-red s-tag>gcd: {{ gcdValue }}</span>
  <span bg-green s-tag>lcm: {{ lcmValue }}</span>

  <div ref="container" class="drawing" />
</template>

<style  lang="scss">
.drawing {
  @apply b-1 m-2 p-1;
  svg {
    background: #dddddd;
  }
}
</style>
