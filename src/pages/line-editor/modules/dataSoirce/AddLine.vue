<script setup lang="ts">
import { omit } from 'lodash'
import type { FormInst } from 'naive-ui'
import { apiMockUrl } from '~/pages/line-editor/api'
import { defaultTransform, useDataSourceStore } from '~/pages/line-editor/data'
import type { DataSourceItem } from '~/pages/line-editor/data/types'

const [visible, toggleVisible] = useToggle()
const store = useDataSourceStore()

type mdlType = Omit<DataSourceItem, 'key'> | null

let mdl = $ref<mdlType>()
let type = $ref<'edit' | 'add'>('add')
let key: string | null

const formRef = ref<FormInst | null>(null)
const rules = {
  type: {
    required: true,
    message: '必填',
    trigger: 'change',
  },
  title: {
    required: true,
    message: '必填',
    trigger: 'blur',
  },
  stateKey: {
    required: true,
    message: '必填',
    trigger: 'blur',
  },
  fetchParams: {
    age: {
      required: true,
      message: '必填',
      trigger: 'blur',
    },
    method: {
      required: true,
      message: '必填',
      trigger: 'blur',
    },
  },
}

const add = () => {
  toggleVisible(true)
  type = 'add'
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

const edit = (data: DataSourceItem) => {
  toggleVisible(true)
  type = 'edit'
  key = data.key
  mdl = { ...omit(data, 'key') }
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

defineExpose({ add, edit })

const onCancel = () => {
  toggleVisible(false)
  mdl = null
}
const onOk = () => {
  formRef.value?.validate((errors) => {
    console.log('validate', errors)
    if (!errors) {
      if (type === 'add')
        store.addData(mdl)
      else
        store.editData(key, mdl)

      onCancel()
    }
    else {
      toast.error('need compelet basic info')
    }
  })
}
</script>

<template>
  <n-modal v-model:show="visible" title="edit or add" preset="dialog" style="width: 1000px">
    <n-form v-if="mdl" ref="formRef" :model="mdl" :rules="rules">
      <n-tabs>
        <n-tab-pane name="basic" tab="basic" display-directive="show">
          <n-form-item label="type" path="type" required>
            <n-select v-model:value="mdl.type" :options="typeOptions" />
          </n-form-item>
          <n-form-item label="title" path="title" required>
            <n-input v-model:value="mdl.title" />
          </n-form-item>
          <n-form-item label="stateKey" path="stateKey" required>
            <n-input v-model:value="mdl.stateKey" />
          </n-form-item>
          <n-form-item label="url" path="fetchParams.url" required>
            <n-input v-model:value="mdl.fetchParams.url" />
          </n-form-item>
          <n-form-item label="method" path="fetchParams.method" required>
            <n-select v-model:value="mdl.fetchParams.method" :options="options" />
          </n-form-item>
        </n-tab-pane>
        <n-tab-pane name="advance" label="advance" display-directive="show">
          <SCodeMirror v-model="mdl.transformRes" />
        </n-tab-pane>
      </n-tabs>
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
