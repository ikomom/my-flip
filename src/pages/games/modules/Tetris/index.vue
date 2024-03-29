<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { createMatrix } from '~/composables'

const cols = 20
const rows = 10

const geometryMapDefault = {
  I: [[1, 1], [2, 1], [3, 1], [4, 1]],
  O: [[1, 1], [1, 2], [2, 1], [2, 2]],
  Z: [[1, 2], [2, 1], [2, 2], [1, 3]],
  T: [[1, 2], [2, 1], [2, 2], [2, 3]],
}
type geometryKey = keyof typeof geometryMapDefault
const activeKey = ref<geometryKey>('I')
const activeGeometry = ref(geometryMapDefault.I)

const geometries = ref<{ type: geometryKey; data: number[][] }[]>([])

watch(activeKey, (val) => {
  activeGeometry.value = cloneDeep(geometryMapDefault[val])
})

const matrix = computed(() => {
  const defaultMatrix = createMatrix(rows, cols)

  for (const cord of activeGeometry.value)
    defaultMatrix[cord[0] - 1][cord[1] - 1] = 1

  for (const geometry of geometries.value) {
    for (const cord of geometry.data)
      defaultMatrix[cord[0] - 1][cord[1] - 1] = 1
  }
  return defaultMatrix
})

function checkBound(rule: (cord: number[]) => boolean) {
  for (const cord of activeGeometry.value) {
    if (rule(cord))
      return false
  }

  return true
}

onKeyStroke(['a'], () => {
  if (!checkBound(cord => cord[1] - 2 < 0))
    return

  for (const cord of activeGeometry.value)
    cord[1] -= 1
})

onKeyStroke(['d'], () => {
  if (!checkBound(cord => cord[1] + 1 > rows))
    return

  for (const cord of activeGeometry.value)
    cord[1] += 1
})

onKeyStroke(['w'], () => {
  if (!checkBound(cord => cord[0] - 2 < 0))
    return

  for (const cord of activeGeometry.value)
    cord[0] -= 1
})

onKeyStroke(['s'], () => {
  if (!checkBound(cord => cord[0] + 1 > cols))
    return

  for (const cord of activeGeometry.value)
    cord[0] += 1
})

console.log({ matrix })

function onAdd() {
  geometries.value.push({
    type: activeKey.value,
    data: cloneDeep(activeGeometry.value),
  })
}
</script>

<template>
  <button btn @click="onAdd">
    add
  </button>
  <div w="200px" b="1" relative text-center>
    <n-radio-group v-model:value="activeKey" name="radiogroup">
      <n-space>
        <n-radio
          v-for="(_, label) in geometryMapDefault"
          :key="label" :value="label"
        >
          {{ label }}
        </n-radio>
      </n-space>
    </n-radio-group>

    <div flex>
      <div v-for="item in 11" :key="item" inline-block :class="[item === 1 ? 'w-6' : 'flex-1']" b="1">
        {{ item - 1 }}
      </div>
    </div>
    <div
      v-for="(line, lineIndex) in matrix"
      :key="lineIndex"
      inline-block
      b="1"
      flex="~"
    >
      <div inline-block b="1" w-6 op="70">
        {{ lineIndex + 1 }}
      </div>
      <div
        v-for="(item, idx) in line"
        :key="idx"
        inline-block b="1" flex="1"
        :class="[item ? 'bg-red' : '']"
      >
        <!-- {{ item }} -->
      </div>
    </div>
  </div>
</template>
