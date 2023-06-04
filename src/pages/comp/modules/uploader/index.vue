<script setup lang="ts">
import { TEST_UPLOADER, UPLOAD_CHUNK_FILE_API, UPLOAD_SINGLE_FILE_API } from '~/pages/comp/modules/uploader/constant'
import { ajax } from '~/pages/comp/modules/uploader/Request'
import Uploader from '~/pages/comp/modules/uploader/Uploader'

function getTest() {
  ajax({
    url: TEST_UPLOADER,
  })
}

function getTest2() {
  ajax({
    url: '/images/vr/img.png',
  })
}
type ModeType = 'SINGLE' | 'SLICE'
const mode = ref<ModeType>('SINGLE')
const formRef = ref<HTMLFormElement>()
const fileRef = ref<HTMLInputElement>()
const singleFileUploader = new Uploader(UPLOAD_SINGLE_FILE_API, { showProgress: true })
const sliceFileUploader = new Uploader(UPLOAD_CHUNK_FILE_API, { showProgress: true, enableSlice: true })

function onUploadClick(modeType: ModeType) {
  mode.value = modeType
  fileRef.value.click()
}

function onFileChange(e: Event) {
  const target = (e.target as HTMLInputElement)
  const originFile = target.files[0]

  console.log('onFileChange', originFile)
  if (originFile) {
    formRef.value.reset()
    switch (mode.value) {
      case 'SINGLE':
        uploadSingleFile(originFile)
        break
      case 'SLICE':
        uploadSliceFile(originFile)
        break
    }
  }
}

const loading = ref(false)
function uploadSingleFile(file: File) {
  loading.value = true
  return singleFileUploader
    .upload(file)
    .onProgress((e) => {
      console.log('upload', e)
    }).onComplete((e) => {
      console.log('onComplete', e)
      loading.value = false
    }).onError((e) => {
      console.log('onError', e)
      loading.value = false
    })
}
const sliceLoading = ref(false)
function uploadSliceFile(file: File) {
  return sliceFileUploader
    .upload(file)
    .onProgress((e) => {
      console.log('upload', e)
    }).onComplete((e) => {
      console.log('onComplete', e)
      sliceLoading.value = false
    }).onError((e) => {
      console.log('onError', e)
      sliceLoading.value = false
    })
}
</script>

<template>
  <n-space>
    <button btn @click="getTest">
      getTest
    </button>
    <button btn @click="getTest2">
      get image
    </button>
    <n-button :loading="loading" @click="onUploadClick('SINGLE')">
      upload File
    </n-button>
    <n-button :loading="sliceLoading" @click="onUploadClick('SLICE')">
      upload slice File
    </n-button>
    <form v-show="false" ref="formRef">
      <input ref="fileRef" type="file" multiple @change="onFileChange">
    </form>
  </n-space>
</template>

<style scoped>

</style>
