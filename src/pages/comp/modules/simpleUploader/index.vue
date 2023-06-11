<script>
import { nextTick, onMounted, ref } from 'vue'
import SUploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'

export default {
  components: { SUploader: SUploader.Uploader },
  setup() {
    const uploaderRef = ref(null)
    const options = {
      target: '/api/simple-upload', // '//jsonplaceholder.typicode.com/posts/',
      testChunks: false,
    }
    const attrs = {
      accept: 'image/*',
    }
    const statusText = {
      success: 'success',
      error: 'error',
      uploading: 'uploading',
      paused: 'paused',
      waiting: 'waiting',
    }
    const complete = (...args) => {
      console.log('complete', args)
    }
    const fileComplete = (...args) => {
      console.log('file complete', args)
    }
    onMounted(() => {
      nextTick(() => {
        window.uploader = uploaderRef.value.uploader
      })
    })
    return {
      uploaderRef,
      options,
      attrs,
      statusText,
      complete,
      fileComplete,
    }
  },
}
</script>

<template>
  <SUploader
    ref="uploaderRef"
    :options="options"
    :file-status-text="statusText"
    class="uploader-example"
    @file-complete="fileComplete"
    @complete="complete"
  >
    <!-- <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>Drop files here to upload or</p>
      <uploader-btn>select files</uploader-btn>
      <uploader-btn :attrs="attrs">select images</uploader-btn>
      <uploader-btn :directory="true">select folder</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list> -->
  </SUploader>
</template>

<style scoped>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
