import type { Ref } from 'vue'
import type { editor } from 'monaco-editor'
import darktheme from 'theme-vitesse/themes/vitesse-dark.json'
import lightTheme from 'theme-vitesse/themes/vitesse-light.json'
import { watch } from 'vue'
import setupMonaco from '~/monaco'

enum LANGUAGE {
  typescript = 'ts',
  javascript = 'js',
  html = 'html',
}

interface Options {
  code: string
  language: keyof typeof LANGUAGE
}

const useMonaco = (target: Ref, options: Options) => {
  const changeEventHook = createEventHook<string>()
  const isSetup = ref(false)

  let editor: editor.IStandaloneCodeEditor

  const init = async () => {
    const { monaco } = await setupMonaco()

    monaco.editor.defineTheme('vitesse-dark', darktheme as any)
    monaco.editor.defineTheme('vitesse-light', lightTheme as any)

    watch(target, () => {
      const el = unref(target)
      console.log('watch', el)
      if (!el)
        return
      const uri = monaco.Uri.parse(`file:///root/${Date.now()}.${LANGUAGE[options.language]}`)
      console.log('uri', uri)

      const model = monaco.editor.createModel(options.code, options.language, uri)
    }, {
      flush: 'post',
      immediate: true,
    })
  }
  init()
}

export default useMonaco
