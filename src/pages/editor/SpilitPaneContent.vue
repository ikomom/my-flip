<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import TabBar from './TabBar.vue'
import { useEditorInject } from '~/composables/editor/EditorCore'
import EditorFile from '~/composables/editor/EditorFile'
import { compilerVue } from '~/composables/editor/compiler/vueCompiler'

const { core, activeFile } = useEditorInject()

const onCompiler = async () => {
  // const file = new EditorFile('App.vue', appTemplate, appScript)
  // const code = await compilerVue(file)
  //
  // console.log('file.code', code)
}

const onContentChanged = (source: string, content: string) => {
  console.log('onContentChanged', source, content)
}
</script>

<template>
  <div mb-2>
    <button btn @click="onCompiler">
      compilerVue
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
            <e-editor :value="activeFile.script" language="javascript" @change="content => activeFile.script = content" />
          </e-container>
        </pane>
        <pane>
          <e-container title="templeta">
            <e-editor :value="activeFile.template" language="html" @change="content => onContentChanged('template', content)" />
          </e-container>
        </pane>
      </splitpanes>
    </pane>
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane size="75">
          <e-container title="Output">
            <e-preview />
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
