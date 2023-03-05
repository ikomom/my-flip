<script lang="ts" setup>
import EditDataSource from '~/pages/line-editor/modules/dataSoirce/index.vue'
import StateMange from '~/pages/line-editor/modules/state/index.vue'
import UseIndex from '~/pages/line-editor/modules/editor/index.vue'
</script>

<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="dataSource" tab="dataSource">
      <EditDataSource />
    </n-tab-pane>
    <n-tab-pane name="states" tab="states">
      <StateMange />
    </n-tab-pane>
    <n-tab-pane name="editor" tab="editor">
      <UseIndex />
    </n-tab-pane>
  </n-tabs>
</template>
