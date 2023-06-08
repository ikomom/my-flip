<script setup lang="ts">
import axios from 'axios'
import filetypeinfo from 'magic-bytes.js'
import ProgressForm from '~/pages/comp/modules/pool/ProgressForm.vue'
import ProgressItem from '~/pages/comp/modules/pool/ProgressItem.vue'
import { uploadFiles } from '~/pages/comp/modules/pool/Request'
import { TaskPool } from '~/pages/comp/modules/pool/Task'
import { MB_BIT, sliceRange } from '~/pages/comp/modules/pool/utils'

const formRef = ref()
const formState = reactive({
  isChunk: true,
  chunkSize: 2,
})

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

const { isLoading, execute, state } = useAsyncState(uploadFiles, {}, { immediate: false })
function onFiles(files: HTMLInputElement['files']) {
  console.log('onFiles', files)
  if (formState.isChunk) {
    const f = files[0]
    if (f) {
      const slices: Blob[] = []
      sliceRange(f.size, formState.chunkSize * MB_BIT, (start, end) => {
        slices.push(f.slice(start, end))
      })

      console.log('slices', f, slices)
      f.arrayBuffer().then((res) => {
        console.log('info', filetypeinfo(new Uint8Array(res)))
      })
    }
    // const sl = f.slice(1000, 2000, 'text/plain; charset=utf-8')
    // const sl1 = f.slice(2000, 3000, 'text/plain; charset=utf-8')
    // console.log(sl, URL.createObjectURL(sl), URL.createObjectURL(sl1))
  }
  else {
    execute(0, files)
  }
}
function onCancel() {
  console.log('oncancel')
}
</script>

<template>
  <n-form inline>
    <n-form-item label="isChunk">
      <n-switch v-model:value="formState.isChunk" />
    </n-form-item>
    <n-form-item label="chunkSize(M)">
      <n-input-number v-model:value="formState.chunkSize" />
    </n-form-item>
  </n-form>
  <n-button mb-2 :loading="isLoading" @click="run()">
    上传
  </n-button>
  {{ state }}
  <ProgressForm ref="formRef" :multiple="!formState.isChunk" @cancel="onCancel" @files="onFiles" />
  <div v-if="formState.isChunk" flex="~ wrap" gap="3" w-120>
    <ProgressItem
      v-for="(item, idx) in pool.taskList"
      :key="idx" :item="item"
    />
  </div>
</template>
