<script setup lang="ts">
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore } from '~/pages/line-editor/data'
import AddLine from '~/pages/line-editor/modules/dataSoirce/AddLine.vue'
import EditLine from '~/pages/line-editor/modules/dataSoirce/EditLine.vue'

const addLine = ref()
const editLine = ref()
const store = useDataSourceStore()
</script>

<template>
  <div>
    <header class="mb-2 p-2 b-b-1">
      <button btn @click="addLine.show()">
        add
      </button>
    </header>
    <LineEditorList :data-source="store.dataSource" @edit="editLine.show($event.item)" @delete="store.deleteData($event.item)">
      <template #default="{ item }">
        <section flex>
          <div flex-1>
            <p>[{{ item.key }}] {{ item.type }}: {{ item.title }}</p>
            <p>mapKey: {{ item.stateKey }}</p>
            <p>fetchParams: {{ item.fetchParams }}</p>
          </div>
          <pre flex-1 v-text="item.transformRes.trim()" />
        </section>
      </template>
    </LineEditorList>
    <EditLine ref="editLine" />
    <AddLine ref="addLine" />
  </div>
</template>

<style scoped>

</style>
