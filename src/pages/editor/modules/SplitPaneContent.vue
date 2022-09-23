<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import TabBar from './TabBar.vue'
import EConsole from '~/components/editor-ui/EConsole.vue'
import { astTest, compilerVue, parseModule } from '~/composables/editor/compiler/vueCompiler'
import EditorFile from '~/composables/editor/EditorFile'
import { useEditorInject } from '~/composables/editor/EditorCore'

const {
  core,
  $actions,
  activeFile,
  onShouldUpdateContent,
  importMap,
} = useEditorInject()

const script = ref('')
const template = ref('')

onMounted(() => {
  $actions.addFile(new EditorFile('App.vue', '<div>{{helloWorld}} <Test/></div>', `import { ref } from 'vue';
import Test from './Test.vue'

const helloWorld = ref('helloWorld')
`, '', false))
  $actions.addFile(new EditorFile('Test.vue', '<span style="color: red">{{token}}</span>', `import { ref } from 'vue'
const token = ref('Test')
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
  // console.log('file.code', { code })
}
</script>

<template>
  <!--  <div mb-2 text-end> -->
  <!--    <button btn mx-2 @click="astTest(activeFile)"> -->
  <!--      run ast -->
  <!--    </button> -->
  <!--    <button btn mx-2 @click="parseModule(activeFile)"> -->
  <!--      run Parse -->
  <!--    </button> -->
  <!--    <button btn mx-2 @click="onCompiler"> -->
  <!--      run     <i inline-block i-carbon-play-filled-alt w-4 h-4 top-1 relative /> -->
  <!--    </button> -->
  <!--  </div> -->

  <Splitpanes
    class="default-theme ediotr-content"
    :push-other-panes="false"
    style="height: 500px"
  >
    <Pane>
      <Splitpanes horizontal :push-other-panes="false">
        <Pane>
          <TabBar />
          <e-container
            title="scirpt setup"
            style="height: calc(100% - 34px)"
            rounded-b-md
            no-rounding
          >
            <e-editor
              :value="script" language="javascript"
              @change="content => activeFile && (activeFile.script = content)"
            />
          </e-container>
        </Pane>
        <Pane>
          <e-container title="templeta">
            <e-editor
              :value="template" language="html"
              @change="content => activeFile && (activeFile.template = content)"
            />
          </e-container>
        </Pane>
      </Splitpanes>
    </Pane>
    <Pane>
      <Splitpanes horizontal :push-other-panes="false">
        <Pane size="75">
          <e-container title="Output">
            <e-preview />
          </e-container>
        </Pane>
        <Pane size="25">
          <e-container title="Console">
            <EConsole />
          </e-container>
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
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
