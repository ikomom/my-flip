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

  const activeFile = computed(() => core.files[core.activeFilename] as EditorFile)

  const shouldUpdateContent = createEventHook()

  // https://github.com/WICG/import-maps
  const importMap = computed(() => `
    {
      "imports": {
        ${core.packages.map(item => `"${item.name}": "${item.url}"`).join(',\n')}
      }
    }
  `)

  watch(() => core.activeFilename, (val) => {
    console.log('activeFile trigger', val)
    shouldUpdateContent.trigger(null)
  }, { immediate: true })

  const actions = {
    setActiveFile(name: string) {
      core.activeFilename = name
    },
    removeFile(name: string) {
      delete core.files[name]
      setTimeout(() => actions.setActiveFile('App.vue'), 0)
    },
    addFileByName(filename: string) {
      actions.addFile(new EditorFile(filename))
    },
    addFile(file: EditorFile) {
      // if (core.files[file.filename]) {
      //   alert(`文件${file.filename}已存在`)
      //   return
      // }
      core.files = {
        ...core.files,
        [file.filename]: file,
      }
    },
  }

  return {
    activeFile,
    core,
    $actions: actions,
    onShouldUpdateContent: shouldUpdateContent.on,
    importMap,
  }
}

export const EEditorProvider = defineComponent({
  setup(_) {
    const slot = useSlots()

    const editor = useEditor({
      files: {},
      packages: [
        {
          name: 'vue',
          description: 'vue',
          source: 'unpkg',
          version: 'latest',
          url: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
        },
      ],
      activeFilename: null,
    })

    provide('editor', editor)

    console.log('slot', slot.default())

    return () => h('div', slot.default())
  },
})

export const useEditorInject = () => {
  const editor = inject('editor')
  // console.log('editor', editor)
  return editor as ReturnType<typeof useEditor>
}
