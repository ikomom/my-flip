import { defineStore } from 'pinia'
import type { DataSourceItem, EditorState } from './types'
import { apiMockJson, apiMockUrl, apiMockUrl2 } from '~/pages/line-editor/api'
import { shortId } from '~/composables/common'

export const defaultTransform = `function(data) {
  return data
}`

export const getDefaultDataSource = (
  stateKey: string,
  title = 'apiMockReq',
  fetchParams = {
    url: apiMockUrl,
    method: 'GET',
  } as DataSourceItem['fetchParams'],
): DataSourceItem => ({
  title: `${title}:${stateKey}`,
  type: 'fetch',
  fetchParams,
  stateKey,
  transformRes: defaultTransform,
  key: shortId(),
})

export const useDataSourceStore = defineStore('dataSource', () => {
  const dataSource = ref<DataSourceItem[]>([
    getDefaultDataSource('testState1'),
    getDefaultDataSource('testState2', '嘎嘎嘎', {
      url: apiMockUrl2,
      method: 'GET',
    })],
  )

  const addData = (item: Omit<DataSourceItem, 'key'>) => {
    dataSource.value.push({ ...getDefaultDataSource(item.stateKey), ...item })
  }
  const deleteData = (item: DataSourceItem) => {
    dataSource.value = dataSource.value.filter(i => i !== item)
    console.log('dataSource', dataSource)
  }

  const findData = (key: string) => {
    const to = dataSource.value.find(item => item.key === key)
    if (to)
      return to

    throw new Error('not found data')
  }

  return {
    dataSource,
    addData,
    deleteData,
    findData,
  }
})

export const useEditorState = defineStore('editorState', () => {
  const state = ref<EditorState[]>([
    {
      name: 'text',
      props: {
        visible: true,
        run: false,
      },
      traits: [],
    },
  ])
  const findState = (name: string): EditorState => {
    const to = state.value.find(item => item.name === name)
    if (to)
      return to

    throw new Error('not found name')
  }

  const addTrait = (name: string, mapSourceKey: string) => {
    const to = findState(name)
    to.traits.push({
      mapSourceKey,
      key: shortId(),
    })
  }

  const deleteTrait = (name: string, key: string) => {
    const to = findState(name)
    to.traits = to.traits.filter(t => t.key !== key)
  }

  return {
    state,
    addTrait,
    deleteTrait,
    findState,
  }
})
