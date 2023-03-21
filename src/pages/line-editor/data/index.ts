import { defineStore } from 'pinia'
import type { DataSourceItem, EditorState } from './types'
import { shortId } from '~/composables/common'
import { apiMockUrl } from '~/pages/line-editor/api'

export const defaultTransform = `function(data) {
  return data
}`
const defaultDataSource: DataSourceItem[] = [
  {
    title: '请求接口1',
    type: 'fetch',
    stateKey: 'fetchStateKey1',
    transformRes: defaultTransform,
    fetchParams: {
      url: apiMockUrl,
      method: 'GET',
    },
    key: shortId(),
  },
  {
    title: '请求接口2',
    type: 'fetch',
    stateKey: 'fetchStateKey2',
    transformRes: defaultTransform,
    key: shortId(),
    fetchParams: {
      url: apiMockUrl,
      method: 'GET',
    },
  },
  {
    title: '状态1',
    type: 'variable',
    stateKey: 'state1',
    transformRes: defaultTransform,
    key: shortId(),
  },
]

export const useDataSourceStore = defineStore('dataSource', () => {
  const dataSource = ref<DataSourceItem[]>([...defaultDataSource])

  const addData = (item: DataSourceItem) => {
    dataSource.value.push({ ...item })
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
  const editData = (key: string, item: DataSourceItem) => {
    const to = findData(key)
    Object.assign(to, item)
  }

  return {
    dataSource,
    addData,
    deleteData,
    findData,
    editData,
  }
})

export const useEditorState = defineStore('editorState', () => {
  const state = ref<EditorState[]>([
    {
      key: 'obqc2j1m',
      name: 'text',
      props: {
        visible: true,
        run: false,
      },
      traits: [],
    },
    {
      key: 'cfwz8i9a',
      name: 'img',
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

  const addTrait = (name: string, mapSourceKey: string, mapSourceTitle = mapSourceKey) => {
    const to = findState(name)
    to.traits.push({
      mapSourceKey,
      mapSourceTitle,
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
