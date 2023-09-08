<script setup lang="ts">
import Uploader from './modules/uploader/index.vue'
import Pool from './modules/pool/index.vue'
import SimpleUploader from './modules/simpleUploader/index.vue'
import GhostTextArea from './modules/ghostTextArea/index.vue'

function onCopy() {
  navigator.clipboard.writeText('xxx xxxxxxxxxxxx')
}
</script>

<template>
  <n-tabs>
    <n-tab-pane name="0" tab="ghost textArea">
      <GhostTextArea/>
    </n-tab-pane>
    <n-tab-pane name="1" tab="pool uploader">
      <Pool />
    </n-tab-pane>
    <n-tab-pane name="2" tab="old uploader">
      <Uploader />
    </n-tab-pane>
    <n-tab-pane name="3" tab="copy Test">
      <n-space mb-2>
        <button btn @click="onCopy">
          copy
        </button>
      </n-space>
    </n-tab-pane>
    <n-tab-pane name="4" tab="simple-uploader">
      <SimpleUploader />
    </n-tab-pane>
  </n-tabs>
</template>
