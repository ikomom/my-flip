<script setup lang="ts">
import EditorPane from './EditorPane.vue'
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore, useEditorState } from '~/pages/line-editor/data'
import EditTraitModal from '~/pages/line-editor/modules/editor/EditTraitModal.vue'

const store = useDataSourceStore()
const editor = useEditorState()
const editTraitModal = ref<InstanceType<typeof EditTraitModal>>()

const onReset = () => {
  const s = confirm('reset all?')
  if (s) {
    store.$reset()
    editor.$reset()
  }
}
</script>

<template>
  editor 模拟组件预览和编辑
  <div flex>
    <div flex-1>
      <header>
        <button btn @click="onReset()">
          reset
        </button>
      </header>
      <main>
        <LineEditorList :data-source="editor.state" @edit="editTraitModal.show($event.item)">
          <template #default="{ item }">
            <b>name: {{ item.name }}</b>
            <div flex>
              <div flex-1>
                <div>props</div>
                <pre v-html="JSON.stringify(item.props, null, 2)" />
              </div>
              <div flex-1>
                <div>traits</div>
                <LineEditorList :data-source="item.traits">
                  <template #default="{ item: trait }">
                    {{ trait.mapSourceKey }} {{ trait.mapSourceTitle }}
                  </template>
                </LineEditorList>
              </div>
            </div>
          </template>
        </LineEditorList>
      </main>
      <EditTraitModal ref="editTraitModal" />
    </div>
    <div flex-1 b="1 gray-400/30">
      <EditorPane />
    </div>
  </div>
</template>
