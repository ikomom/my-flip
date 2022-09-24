<script setup lang="ts">
const emits = defineEmits<(e: 'ok', data: Record<string, number>) => void>()

const data = reactive({ n1: 0, n2: 1 })
const onOk = () => {
  if (data.n2 !== data.n1)
    emits('ok', { ...data })
  else
    toast.warning('数字不能相等')
}
</script>

<template>
  <n-popconfirm>
    <slot />
    <input v-model="data.n1" :min="0" :max="9" :step="1" w-10 type="number" b="b-1" mx="2">
    <input v-model="data.n2" :min="0" :max="9" :step="1" w-10 type="number" b="b-1" mx="2">
    <template #action>
      <button btn @click="onOk()">
        确定
      </button>
    </template>
    <template #trigger>
      <slot name="trigger" />
    </template>
  </n-popconfirm>
</template>

<style scoped>

</style>
