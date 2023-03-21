<script setup lang="ts">
import LineEditorList from '~/pages/line-editor/components/LineEditorList.vue'
import { useDataSourceStore } from '~/pages/line-editor/data'
import AddLine from '~/pages/line-editor/modules/dataSoirce/AddLine.vue'

const addLine = ref<InstanceType<typeof AddLine>>()
const store = useDataSourceStore()
</script>

<template>
  <div>
    dataSource管理数据源
    <header class="mb-2 p-2 b-b-1">
      <button btn @click="addLine.add()">
        add
      </button>
    </header>
    <LineEditorList
      :data-source="store.dataSource"
      @edit="addLine.edit($event.item)"
      @delete="store.deleteData($event.item)"
    >
      <template #default="{ item }">
        <section flex>
          <div flex-1>
            <p> {{ item.type }}: {{ item.title }}</p>
            <p>mapKey: {{ item.stateKey }}</p>
            <p v-if="item.fetchParams">
              fetchParams: {{ item.fetchParams }}
            </p>
          </div>
          <pre flex-1 v-text="item.transformRes.trim()" />
        </section>
      </template>
    </LineEditorList>
    <AddLine ref="addLine" />
  </div>
</template>
