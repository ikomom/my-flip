<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import TabBar from './TabBar.vue'
import { compilerVue } from '~/composables/editor/compiler/vueCompiler'
import EditorFile from '~/composables/editor/EditorFile'
import { useEditorInject } from '~/composables/editor/EditorCore'

const {
  core,
  $actions,
  activeFile,
  onShouldUpdateContent,
} = useEditorInject()

const script = ref('')
const template = ref('')

onMounted(() => {
  $actions.addFile(new EditorFile('App.vue', '<div>{{helloWorld}}</div>', `import {ref} from 'vue'
const helloWorld = ref('helloWorld')
`, '', false))
  $actions.addFile(new EditorFile('App2.vue', '<div>2</div>', `import {ref} from 'vue'
const helloWorld2 = ref('helloWorld')
`))
  $actions.setActiveFile('App.vue')
})

onShouldUpdateContent(() => {
  if (activeFile.value) {
    console.log('update onShouldUpdateContent')
    script.value = activeFile.value.script
    template.value = activeFile.value.template
  }
})

const onCompiler = async () => {
  const code = await compilerVue(activeFile.value)
  activeFile.value.compiled.js = code
  console.log('file.code', { code })
}
</script>

<template>
  <div mb-2 text-end>
    <button btn @click="onCompiler">
      run     <i inline-block i-carbon-play-filled-alt w-4 h-4 top-1 relative />
    </button>
  </div>

  <splitpanes
    class="default-theme ediotr-content"
    :push-other-panes="false"
    style="height: 500px"
  >
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane>
          <tab-bar />
          <e-container style="height: calc(100% - 34px)" rounded-b-md title="scirpt setup" no-rounding>
            <e-editor
              :value="script" language="javascript"
              @change="content => activeFile && (activeFile.script = content)"
            />
          </e-container>
        </pane>
        <pane>
          <e-container title="templeta">
            <e-editor
              :value="template" language="html"
              @change="content => activeFile && (activeFile.template = content)"
            />
          </e-container>
        </pane>
      </splitpanes>
    </pane>
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane size="75">
          <e-container title="Output">
            <e-preview :code="activeFile ? activeFile.compiled.js : ''" />
          </e-container>
        </pane>
        <pane size="25">
          <e-container title="Console">
            templeta
          </e-container>
        </pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<style>

</style>

<style scoped lang="scss">
.ediotr-content {
  :deep(.splitpanes__pane) {
    @apply bg-transparent;
  }

  :deep(.splitpanes__splitter::after),
  :deep(.splitpanes__splitter::before) {
    @apply bg-dark-100 bg-opacity-50 dark:bg-light;
  }

  :deep(.splitpanes__splitter) {
    @apply bg-transparent border-transparent min-w-4 min-h-4;
  }
}
</style>
