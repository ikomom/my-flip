<script lang="ts" setup>
import type { Extension } from '@codemirror/state'
import type { EditorView } from 'codemirror'
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps<{ modelValue?: string }>()
const emits = defineEmits(['update:modelValue'])

const log = console.log

const code = useVModel(props, 'modelValue', emits, { defaultValue: '' })
const extensions = computed<Extension>(() => {
  const extension: any[] = [javascript()]
  if (isDark.value)
    extension.push(oneDark)
  return extension
})

// Codemirror EditorView instance ref
const view = shallowRef<EditorView>()
const handleReady: InstanceType<typeof Codemirror>['onReady'] = (payload) => {
  view.value = payload.view
}

// const getCodemirrorStates = () => {
//   const state = view.value.state
//   const ranges = state.selection.ranges
//   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
//   const cursor = ranges[0].anchor
//   const length = state.doc.length
//   const lines = state.doc.lines
//
//   console.log({ selected, ranges, cursor, length, lines })
// }
</script>

<template>
  <div>
    <!--    <button btn @click="getCodemirrorStates()"> -->
    <!--      getCodemirrorStates -->
    <!--    </button> -->
    <Codemirror
      v-model="code"
      placeholder="Code goes here..."
      :style="{ height: '400px' }"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
      @change="log('change', $event)"
      @focus="log('focus', $event)"
      @blur="log('blur', $event)"
    />
  </div>
</template>
