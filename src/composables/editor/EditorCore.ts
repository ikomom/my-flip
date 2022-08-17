import EditorFile from './EditorFile'

export interface EditorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

export interface EditorCore {
  files: Record<string, EditorFile>
  packages: EditorPackage[]
  activeFilename: string | string
  errors: (string | Error)[]
  runtimeErrors: (string | Error)[]

}

const defaultParams: EditorCore = {
  files: {},
  packages: [],
  activeFilename: null,
  errors: [],
  runtimeErrors: [],
}

function useEditor(
  params: Pick<EditorCore, 'files' | 'packages' | 'activeFilename'>,
) {
  const _params = { ...defaultParams, ...params }

  const core = reactive<EditorCore>(_params)

  const activeFile = computed(() => core.files[core.activeFilename])

  // https://github.com/WICG/import-maps
  const importMap = computed(() => `
    {
      "imports": {
        ${core.packages.map(item => `"${item.name}": "${item.url}"`).join(',\n')}
      }
    }
  `)

  return {
    activeFile,
    core,
    importMap,
  }
}

export const EEditorProvider = defineComponent({
  setup(_) {
    const slot = useSlots()

    const editor = useEditor({
      files: {
        'App.vue': new EditorFile('App.vue'),
      },
      packages: [],
      activeFilename: 'App.vue',
    })

    provide('editor', editor)

    console.log('slot', slot.default())

    return () => h('div', slot.default())
  },
})

export const useEditorInject = () => {
  const editor = inject('editor')
  console.log('editor', editor)
  return editor as ReturnType<typeof useEditor>
}
