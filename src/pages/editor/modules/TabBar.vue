<script lang="ts" setup>
import { useEditorInject } from '~/composables/editor/EditorCore'
import Tab from '~/pages/editor/modules/Tab.vue'

const { core, $actions: { setActiveFile, addFileByName, removeFile } } = useEditorInject()

const onAddFile = () => {
  const name = prompt('请输入文件名')
  if (name) {
    const filename = name.endsWith('.vue') ? name : `${name}.vue`
    addFileByName(filename)
    setActiveFile(filename)
  }
}

const onClose = (filename: string) => {
  const res = confirm('关闭文件, 无法恢复')
  if (res)
    removeFile(filename)
}
</script>

<template>
  <div
    flex="~ nowrap"
    bg="light-500 dark:dark-800"
    overflow-x-auto overflow-y-hidden
    b="x-1 t-1 #dde1e3"
    rounded-t-md
  >
    <Tab
      v-for="file in core.files"
      :key="file.filename"
      :active="core.activeFilename === file.filename"
      @click="setActiveFile(file.filename)"
    >
      {{ file.filename }}
      <i v-if="file.closeable" w-4 h-4 relative top-1 inline-block icon-btn i-carbon-close @click.stop="onClose(file.filename)" />
    </Tab>
    <a icon-btn i-carbon-add w-5 h-5 top-1 relative @click="onAddFile" />
  </div>
</template>
