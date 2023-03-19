import type { AxiosResponse } from 'axios'

export interface DataSourceFetchItem {
  type: 'fetch'
  fetchParams: {
    url: string
    headers?: Record<string, string>
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: Record<string, any>
  }
}

export type DataSourceItem = {
  key: string
  title: string
  stateKey: string
  transformRes: string
} & DataSourceFetchItem

export interface EditorTrait {
  mapSourceKey: string
  key: string
}

export interface EditorState {
  key: string
  name: string
  props: Record<string, unknown>
  traits: EditorTrait[]
}
