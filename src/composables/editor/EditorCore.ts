import EditorFile from './EditorFile'

export interface EditorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

// class EditorCore {
//   files: Record<string, EditorFile>
//   packages: EditorPackage[]
//   activeFilename: string
//   // errors: (string | Error)[]
//   // runtimeErrors: (string | Error)[]
//   // readonly activeFile: EditorFile | undefined
//   // readonly importMap: string

//   constructor(
//     files: Record<string, EditorFile> = {},
//     packages: EditorPackage[] = [],
//   ) {
//     this.files = reactive(files)
//     this.packages = reactive(packages)
//   }

// }

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

function getEditor(
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

function useEidtor() {
  const { core, activeFile, importMap } = getEditor({
    files: {
      'App.vue': new EditorFile('App.vue'),
    },
    packages: [],
    activeFilename: 'App.vue',
  })

  watchEffect(() => {

  })

  provide('editor', {
    core,
  })
}
