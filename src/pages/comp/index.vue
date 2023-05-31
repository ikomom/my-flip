<script setup lang="ts">
import { TEST_UPLOADER, UPLOAD_SINGLE_FILE_API } from '~/pages/comp/modules/uploader/constant'
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

const formRef = ref<HTMLFormElement>()
const fileRef = ref<HTMLInputElement>()
const singleFileUploader = new Uploader(UPLOAD_SINGLE_FILE_API, { showProgress: true })

function uploadSingleFile() {
  fileRef.value.click()
}

const loading = ref(false)
function onFileChange(e: Event) {
  if (loading.value)
    return
  const target = (e.target as HTMLInputElement)
  const originFile = target.files[0]

  console.log('onFileChange', target.files)
  if (originFile) {
    loading.value = true
    formRef.value.reset()
    singleFileUploader
      .upload(originFile)
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
}
</script>

<template>
  <n-space>
    <button btn @click="getTest">
      getTest
    </button>
    <button btn @click="getTest2">
      getTest
    </button>
    <n-button :loading="loading" @click="uploadSingleFile">
      upload File
    </n-button>
    <form v-show="false" ref="formRef">
      <input ref="fileRef" type="file" multiple @change="onFileChange">
    </form>
  </n-space>
</template>

<style scoped>

</style>
