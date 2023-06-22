<script setup lang="ts">
import type { AxiosProgressEvent } from 'axios'
import axios from 'axios'
import { Md5 } from 'ts-md5'

import ProgressList from '~/pages/comp/modules/pool/progress/ProgressList.vue'
import ProgressForm from '~/pages/comp/modules/pool/ProgressForm.vue'
import ProgressItem from '~/pages/comp/modules/pool/ProgressItem.vue'
import { uploadFiles } from '~/pages/comp/modules/pool/Request'
import { TaskPool } from '~/pages/comp/modules/pool/Task'
import { runTest, runWorkerPool } from '~/pages/comp/modules/pool/upload/parallel/test'
import { UploadFile } from '~/pages/comp/modules/pool/upload/UploadFile'
import { MB_BIT, sliceRange } from '~/pages/comp/modules/pool/utils'

const formRef = ref()
const formState = reactive({
  isChunk: false,
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
// const hasher = new ParallelHasher(HashWorkerUrl)

const { isLoading, execute, state } = useAsyncState(uploadFiles, {}, { immediate: false })

const progressEvent = ref<AxiosProgressEvent>()
const status = ref('idle')
async function onFiles(files: HTMLInputElement['files']) {
  console.log('onFiles', files)

  if (formState.isChunk) {
    const f = files[0]
    if (f) {
      // TODO: 切片
      const md5 = new Md5()

      const slices: Blob[] = []
      sliceRange(f.size, formState.chunkSize * MB_BIT, (start, end) => {
        const sliced = f.slice(start, end)
        slices.push(sliced)
        // md5.appendByteArray(sliced)
        // spark.appendBinary()
      })

      console.log('slices', f, slices)
      // f.arrayBuffer().then((res) => {
      //   console.log('info', filetypeinfo(new Uint8Array(res)))
      // })
    }
    // const sl = f.slice(1000, 2000, 'text/plain; charset=utf-8')
    // const sl1 = f.slice(2000, 3000, 'text/plain; charset=utf-8')
    // console.log(sl, URL.createObjectURL(sl), URL.createObjectURL(sl1))
  }
  else {
    status.value = 'split file'
    const uFiles = []
    for (let i = 0; i < files.length; i++) {
      // console.log(files[i])
      uFiles.push(new UploadFile(files[i], { chunkSize: formState.chunkSize }))
    }
    status.value = 'get Hash'
    console.log('uFiles', uFiles)

    Promise.all(uFiles.map(item => item.getHash())).then((...res) => {
      status.value = 'already get Hash res'
      console.log('uFiles hash', res)
    })
    for (const uFile of uFiles)
      console.log('getInfo', await uFile.getTypeInfo())

    // execute(0, files, {
    //   fields: { a: 1, b2: 3 },
    //   onUploadProgress(ev) {
    //     console.log(ev)
    //     progressEvent.value = ev
    //   },
    // })
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
  <n-button m-2 @click="runTest(), false">
    运行测试
  </n-button>
  <n-button m-2 @click="runWorkerPool()">
    运行workerPool
  </n-button>
  <n-button m-2 :loading="isLoading" @click="run()">
    上传
  </n-button>
  <span p-2 text-white bg-blue>
    {{ status }}
  </span>
  {{ state }}
  <ProgressForm ref="formRef" :multiple="!formState.isChunk" @cancel="onCancel" @files="onFiles" />
  <div v-if="formState.isChunk" flex="~ wrap" gap="3" w-120>
    <ProgressItem
      v-for="(item, idx) in pool.taskList"
      :key="idx" :item="item"
    />
  </div>
  <div v-else-if="progressEvent">
    <ProgressList name="tesdt" :loaded="progressEvent.loaded" :total="progressEvent.total" />
  </div>
</template>
