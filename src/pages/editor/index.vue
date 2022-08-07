<script setup lang="ts">
import { languages } from 'monaco-editor'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { compileFile } from '~/composables/compiler/sfcCompliler'
import { orchestrator } from '~/composables/orchestrator'
const appTemplate = `
<div
  grid="~ flow-col gap-4"
  place="content-center items-center"
  h="screen"
  font="mono"
  >
  <Coordinate label="X" :value="x" />
  <Coordinate label="Y" :value="y" />
</div>
`
const appScript = `
import { useMouse } from '@vueuse/core'
import Coordinate from './Coordinate.vue'

const { x, y } = useMouse()
`

const initialScript = ref(appScript)
const initialTemplate = ref(appTemplate)

const onContentChanged = (source: string, content: string) => {
  console.log('onContentChanged', source, content)
}

// compileFile(orchestrator.activeFile)
</script>

<template>
  <splitpanes class="default-theme ediotr-content" :push-other-panes="false" style="height: 500px">
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane>
          <e-container title="scirpt setup">
            <e-editor :value="initialScript" language="javascript" @change="content => onContentChanged('script', content)" />
          </e-container>
        </pane>
        <pane>
          <e-container title="templeta">
            <e-editor :value="initialTemplate" language="html" @change="content => onContentChanged('template', content)" />
          </e-container>
        </pane>
      </splitpanes>
    </pane>
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane size="75">
          <e-container title="Output">
            templeta
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
