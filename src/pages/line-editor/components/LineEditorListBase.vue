<script setup lang="ts">
const props = defineProps<{ dataSource: any[]; onDelete?: any; onEdit?: any }>()
const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div
    v-for="(item, index) in dataSource" :key="index"
    py-1 hover:bg-gray-50 dark:hover:bg-dark-50
  >
    <div s-layout-between select="none">
      <div>
        <span op50 mr-2>[{{ index + 1 }}]</span>
        <span v-if="item.key" op50>[{{ item.key }}]</span>
      </div>
      <span>
        <i
          v-if="props.onEdit"
          text="3" i-carbon-edit icon-btn mx-2
          @click="emit('edit', { item, index })"
        />
        <i
          v-if="props.onDelete"
          text="3" i-carbon-trash-can icon-btn hover:color-red
          @click="emit('delete', { item, index })"
        />
      </span>
    </div>
    <slot v-if="$slots.default" :index="index" :item="item" />
    <div v-else>
      {{ item }}
    </div>
  </div>
  <n-empty v-if="!dataSource.length" :show-icon="false" />
</template>
