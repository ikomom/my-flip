import { compileFile } from './compiler/sfcCompliler'

export class OrchestratorFile {
  filename: string
  template: string
  script: string
  style: string

  compiled = {
    js: '',
    css: '',
    ssr: '',
  }

  constructor(
    filename: string,
    template?: string,
    script?: string,
    style?: string,
  ) {
    this.filename = filename
    this.template = template || ''
    this.script = script || ''
    this.style = style || ''
  }

  get code() {
    return `
      <script setup>
          ${this.script}
      </script>
      <template>
          ${this.template}
      </template>
    `
  }
}

export interface OrchestratorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

export interface Orchestrator {
  files: {
    [key: string]: OrchestratorFile
  }
  packages: OrchestratorPackage[]
  activeFilename: string
  errors: (string | Error)[]
  runtimeErrors: (string | Error)[]

  readonly activeFile: OrchestratorFile | undefined
  readonly importMap: string
}

/**
 * 文件系统协调管理 store
 */
export const orchestrator = reactive<Orchestrator>({
  files: {
    'App.vue': new OrchestratorFile('App.vue'),
  },
  packages: [],
  activeFilename: 'App.vue',
  errors: [],
  runtimeErrors: [],

  get activeFile(): OrchestratorFile | undefined {
    return orchestrator.files[this.activeFilename]
  },

  get importMap(): string {
    const imports = orchestrator.packages.map(({ name, url }) => `"${name}": "${url}"`)

    return `
      {
        "imports": {
          ${imports.join(',\n')}
        }
      }
    `
  },
})

watchEffect(() => {
  if (orchestrator.activeFile)
    compileFile(orchestrator.activeFile)
})
const initialPackages = [
  {
    name: 'vue-demi',
    source: 'unpkg',
    description: 'Vue Demi (half in French) is a developing utility allows you to write Universal Vue Libraries for Vue 2 & 3',
    url: 'https://unpkg.com/vue-demi/lib/index.mjs',
  },
  {
    name: '@vueuse/shared',
    source: 'unpkg',
    description: 'Shared VueUse utilities.',
    url: 'https://unpkg.com/@vueuse/shared@9.0.0/index.mjs',
  },
  {
    name: '@vueuse/core',
    source: 'unpkg',
    description: 'Collection of essential Vue Composition Utilities',
    url: 'https://unpkg.com/@vueuse/core@9.0.0/index.mjs',
  },
]
/**
 * Add a file to the orchestrator
 *
 * @param file File content
 */
export function addFile(file: OrchestratorFile) {
  orchestrator.files = {
    ...orchestrator.files,
    [file.filename]: file,
  }

  compileFile(orchestrator.files[file.filename])
}
const appTemplate = `
<div
  grid="~ flow-col gap-4"
  place="content-center items-center"
  h="screen"
  font="mono"
  >
  hello world
</div>
`
const appScript = `
import { useMouse } from '@vueuse/core'

const { x, y } = useMouse()
`

export function setActiveFile(name: string) {
  orchestrator.activeFilename = name
}

function loadInitialState() {
  orchestrator.packages = initialPackages
  addFile(new OrchestratorFile('App.vue', appTemplate.trim(), appScript.trim()))
  setActiveFile('App.vue')
}

loadInitialState()
