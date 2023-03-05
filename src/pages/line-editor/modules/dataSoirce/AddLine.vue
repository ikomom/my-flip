<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { apiMockUrl } from '~/pages/line-editor/api'
import { defaultTransform, useDataSourceStore } from '~/pages/line-editor/data'
import type { DataSourceItem } from '~/pages/line-editor/data/types'

const [visible, toggleVisible] = useToggle()
const store = useDataSourceStore()

let mdl = $ref<Omit<DataSourceItem, 'key'>>()

const formRef = ref<FormInst | null>(null)
const show = () => {
  toggleVisible(true)
  mdl = {
    title: undefined,
    type: 'fetch',
    fetchParams: {
      url: apiMockUrl,
      method: 'GET',
    },
    stateKey: undefined,
    transformRes: defaultTransform,
  }
}
const options = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PUT', value: 'PUT' },
]

const typeOptions = [
  { label: 'fetch', value: 'fetch' },
]

defineExpose({ show })

const onCancel = () => {
  toggleVisible(false)
}
const onOk = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      store.addData(mdl)
      onCancel()
    }
  })
}
</script>

<template>
  <n-modal v-model:show="visible" title="edit or add" preset="dialog" style="width: 1000px">
    <n-form v-if="mdl" ref="formRef">
      <n-form-item label="type" required>
        <n-select v-model:value="mdl.type" :options="typeOptions" />
      </n-form-item>
      <n-form-item label="title" required>
        <n-input v-model:value="mdl.title" />
      </n-form-item>
      <n-form-item label="stateKey" required>
        <n-input v-model:value="mdl.stateKey" />
      </n-form-item>
      <n-form-item label="url" required>
        <n-input v-model:value="mdl.fetchParams.url" />
      </n-form-item>
      <n-form-item label="method" required>
        <n-select v-model:value="mdl.fetchParams.method" :options="options" />
      </n-form-item>
      <n-form-item>
        <n-space class="justify-end! w-full">
          <n-button @click="onCancel">
            cancel
          </n-button>
          <n-button @click="onOk">
            ok
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<style scoped>

</style>
