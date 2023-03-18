<script lang="ts">
import LineEditorListBase from './LineEditorListBase.vue'

export type LineEditorListDataSourceItem<T = {}> = T

interface Props<T> {
  dataSource: LineEditorListDataSourceItem<T>[]
}

export interface EventParams<T> {
  item: LineEditorListDataSourceItem<T>
  index: number
}

type LineEditorList = new<T = {}>(props: Props<T>) => {
  $props: Props<T>
  $emit: {
    (e: 'edit', { item, index }: EventParams<T>): void
    (e: 'delete', { item, index }: EventParams<T>): void
  }
}

export default LineEditorListBase as LineEditorList
</script>
