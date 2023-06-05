<script setup lang="ts">
const emits = defineEmits(['files', 'cancel'])

const defaultShow = ref(false)
const formRef = ref()
const fileRef = ref()
let selectWindowOpen = false

function onFileChange(e: Event) {
  const target = (e.target as HTMLInputElement)
  const originFile = target.files
  emits('files', originFile)
  resetWindow()
}

function resetWindow() {
  formRef.value.reset()
  selectWindowOpen = false
}

let timeRef: any

defineExpose({
  show() {
    if (fileRef.value) {
      selectWindowOpen = true
      fileRef.value.click()
      // 模拟取消事件
      window.addEventListener(
        'focus',
        () => {
          timeRef && clearTimeout(timeRef)
          timeRef = setTimeout(() => {
            if (selectWindowOpen) {
              resetWindow()
              emits('cancel')
            }
          }, 200)
        },
        { once: true },
      )
    }
  },
})
</script>

<template>
  <form v-show="defaultShow" ref="formRef">
    <input ref="fileRef" type="file" multiple @change="onFileChange">
  </form>
</template>
