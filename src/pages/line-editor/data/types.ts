export interface DataSourceFetchItem {
  type: 'fetch'
  fetchParams: {
    url: string
    headers?: Record<string, string>
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: Record<string, any>
  }
}

export interface DataSourceVariableItem {
  type: 'variable'
}

export type DataSourceItem = {
  key: string
  title: string
  stateKey: string
  transformRes: string
} & (DataSourceFetchItem | DataSourceVariableItem)

export interface EditorTrait {
  mapSourceKey: string
  mapSourceTitle: string
  key: string
}

export interface EditorState {
  key: string
  name: string
  props: Record<string, unknown>
  traits: EditorTrait[]
}
