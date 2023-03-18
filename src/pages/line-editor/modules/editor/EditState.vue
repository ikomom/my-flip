<script setup lang="ts">
import axios from 'axios'
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore, useEditorState } from '~/pages/line-editor/data'
import type { EditorState } from '~/pages/line-editor/data/types'

const [visible, toggleVisible] = useToggle()

let mdl = $ref<EditorState>()
const store = useDataSourceStore()
const state = useEditorState()

const show = (data: any) => {
  toggleVisible(true)
  console.log('show', toRaw(data))
  mdl = toRaw(data)
}
defineExpose({ show })

const options = computed(() => {
  return store.dataSource.map(item => ({ label: item.title, value: item.key }))
})
const [runLoading, setRunLoading] = useToggle()
const onRun = async () => {
  setRunLoading(true)
  for (const trait of mdl.traits) {
    try {
      const data = store.findData(trait.mapSourceKey)
      if (data.type === 'fetch') {
        const res = await axios(data.fetchParams)
        const resolved = await (new Function('data', `return ${data.transformRes}(data)`))(res.data)
        console.log('onRun', resolved)
        // TODO: to state
      }
    }
    catch (e: any) {
      toast.error(e?.message)
      console.error(e)
    }
  }
  setRunLoading(false)
}
</script>

<template>
  <n-modal v-model:show="visible" :title="mdl?.name" preset="dialog" style="width: 1000px">
    <n-space>
      <n-popselect :options="options" @update-value=" state.addTrait(mdl?.name, $event)">
        <button btn>
          add
        </button>
      </n-popselect>
      <n-button v-if="mdl?.traits.length" :loading="runLoading" @click="onRun">
        run
      </n-button>
    </n-space>
    <LineEditorList :data-source="mdl?.traits" @delete="state.deleteTrait(mdl?.name, $event.item.key)">
      <template #default="{ item }">
        {{ item }}
      </template>
    </LineEditorList>
  </n-modal>
</template>
