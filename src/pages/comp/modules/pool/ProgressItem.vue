<script setup lang="ts">
import type { TaskStatus } from '~/pages/comp/modules/pool/utils'
import type { Task } from '~/pages/comp/modules/pool/Task'
import { getRandom } from '~/utils/utils'

defineProps<{ item: Task }>()

const TaskStatusTypeColorMap: Record<TaskStatus, string> = {
  ERROR: 'bg-red',
  PENDING: 'bg-blue',
  STOP: 'bg-gray',
  IDLE: 'bg-transparent',
  SUCCESS: 'bg-green',
}
function getRandomStatus() {
  const keys = Object.keys(TaskStatusTypeColorMap)
  return keys[getRandom(0, keys.length - 1)]
}
</script>

<template>
  <div
    :title="item.status" w-4 h-4 b="1 black"
    :class="[`${TaskStatusTypeColorMap[getRandomStatus() || item.status]}`]"
  />
</template>
