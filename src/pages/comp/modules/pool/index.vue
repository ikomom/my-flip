<script setup lang="ts">
import axios from 'axios'
import ProgressForm from '~/pages/comp/modules/pool/ProgressForm.vue'
import ProgressItem from '~/pages/comp/modules/pool/ProgressItem.vue'
import { uploadFiles } from '~/pages/comp/modules/pool/Request'
import { TaskPool } from '~/pages/comp/modules/pool/Task'

const formRef = ref()

const pool = shallowReactive(new TaskPool())

function init() {
  pool.clear()
  for (let i = 0; i < 10; i++) {
    pool.add(() => {
      return axios({
        data: new FormData(),
      })
    })
  }
}
init()

function run() {
  formRef.value.show()
  // pool.start()
}

function onFiles(files: HTMLInputElement['files']) {
  console.log('onFiles', files)
  uploadFiles(files)
}
function onCancel() {
  console.log('oncancel')
}
</script>

<template>
  <button btn mb-2 @click="run()">
    上传
  </button>
  <ProgressForm ref="formRef" @cancel="onCancel" @files="onFiles" />
  <div flex="~ wrap" gap="3" w-120>
    <ProgressItem
      v-for="(item, idx) in pool.taskList"
      :key="idx" :item="item"
    />
  </div>
</template>
