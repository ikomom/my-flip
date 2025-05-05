<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

const menus = [
  { label: '文件', key: 'file' },
  { label: '编辑', key: 'edit' },
  { label: '格式', key: 'format' },
  { label: '查看', key: 'view' },
  { label: '帮助', key: 'help' },
]
const tabs = ref<{ label: string; key: string }[]>([])
</script>

<template>
  <n-row gutter="8">
    <n-col span="2">
      <div v-for="item in menus" :key="item.key" px-2 py-4 b-2 hover:bg-amber cursor-pointer @click="tabs.push({ ...item, key: shortId() })">
        {{ item.label }}
      </div>
    </n-col>
    <n-col span="22">
      <div v-if="tabs.length" h-full flex="~ col">
        <VueDraggable
          v-model="tabs"
          class="wrapper"
          animation="150"
          ghost-class="ghost"
          group="tabs"
        >
          <div v-for="tab in tabs" :key="tab.key" class="tab">
            {{ tab.label }} <a font-100 text-red cursor-pointer @click="tabs = tabs.filter(item => item.key !== tab.key)">关闭</a>
          </div>
        </VueDraggable>
        <div b-1 flex-1>
          placeholder
        </div>
      </div>
    </n-col>
  </n-row>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .tab {
    border: 1px solid #ccc;;
    padding: 6px 8px;
  }
}
</style>
