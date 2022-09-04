<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import type { ToastID } from 'vue-toastification/dist/types/types'

const props = defineProps<{ id: string }>()

onBeforeRouteLeave(() => {
  const answer = window.confirm(
    '你想离开吗',
  )
  // 取消导航并停留在同一页面上
  if (!answer)
    return false
})

const { count, inc } = useCounter(0)
const lastId = ref<string>()
let lastToastId: ToastID

onBeforeRouteUpdate(() => {
  if (count.value >= 5) {
    lastToastId && toast.dismiss(lastToastId)
    lastToastId = toast.warning('到达最大更新次数')
    return false
  }
  lastId.value = props.id
  inc()
})
</script>

<template>
  <div bg-yellow color-white>
    <table>
      <tbody>
        <tr>
          <td>更新次数</td>
          <td>{{ count }}</td>
        </tr>      <tr>
          <td>second</td>
          <td>{{ id }}</td>
        </tr>
        <tr>
          <td>lastId</td>
          <td>{{ lastId }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
table {
  td {border: 1px solid currentColor;padding: 10px}
}
</style>
