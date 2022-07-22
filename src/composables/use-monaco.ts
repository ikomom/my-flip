import type { Ref } from 'vue'
import type { editor } from 'monaco-editor'

const useMonaco = (target: Ref, options: any) => {
  const changeEventHook = createEventHook<string>()
  const isSetup = ref(false)

  let editor: editor.IStandaloneCodeEditor

  const init = async () => {

  }
}

export default useMonaco
