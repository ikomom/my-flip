<script setup lang="ts">
import EMessage from '~/components/editor-ui/EMessage.vue'
import { useEditorInject } from '~/composables/editor/EditorCore'

const { core } = useEditorInject()
</script>

<template>
  <div overflow-auto>
    <EMessage v-for="(err, idx) in core.errors" :key="idx" type="error" :message=" err.toString()" />
    <EMessage v-for="(err, idx) in core.runtimeErrors" :key="idx" type="error" :message="err.toString()" />
  </div>
</template>
