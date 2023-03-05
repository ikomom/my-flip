<script setup lang="ts">
const [visible, toggleVisible] = useToggle()

let mdl = $ref<any>({ transformRes: '' })

const show = (data: any) => {
  toggleVisible(true)
  console.log('show', toRaw(data))
  mdl = toRaw(data)
}
defineExpose({ show })
</script>

<template>
  <n-modal v-model:show="visible" :title="mdl.title" preset="dialog" style="width: 1000px">
    <SCodeMirror v-model="mdl.transformRes" flex-1 />
  </n-modal>
</template>

<style scoped>

</style>
