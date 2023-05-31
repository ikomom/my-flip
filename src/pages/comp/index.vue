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

const fileRef = ref()
const singleFileUploader = new Uploader(UPLOAD_SINGLE_FILE_API, { showProgress: true })

function uploadSingleFile() {
  fileRef.value.click()
}

function onFileChange(e: Event) {
  const target = (e.target as HTMLInputElement)
  const originFile = target.files[0]

  console.log('onFileChange', target.files[0])
  singleFileUploader
    .upload(originFile)
    .onProgress((e) => {
      console.log('upload', e)
    }).onComplete((e) => {
      console.log('onComplete', e)
    }).onError((e) => {
      console.log('onError', e)
    })
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
    <button btn @click="uploadSingleFile">
      upload File
    </button>
    <input v-show="false" ref="fileRef" type="file" @change="onFileChange">
  </n-space>
</template>

<style scoped>

</style>
