<script setup lang="ts">
import EMessage from '~/components/editor-ui/EMessage.vue'
import { useEditorInject } from '~/composables/editor/EditorCore'

const { core } = useEditorInject()
</script>

<template>
  <div overflow-auto>
    <EMessage v-for="err in core.errors" :key="err" type="error">
      {{ err.toString() }}
    </EMessage>
    <EMessage v-for="err in core.runtimeErrors" :key="err" type="error">
      {{ err.toString() }}
    </EMessage>
  </div>
</template>
