<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
</script>

<template>
  <splitpanes class="default-theme ediotr-content" :push-other-panes="false" style="height: 400px">
    <pane>
      <splitpanes horizontal :push-other-panes="false">
        <pane>
          <e-container title="scirpt setup">
            <e-editor />
          </e-container>
        </pane>
        <pane>
          <e-container title="templeta">
            templeta
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
