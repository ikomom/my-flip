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

enum EDITOR_THEME {
  LIGHT = 'vitesse-light',
  DARK = 'vitesse-dark',
}

interface Options {
  code: string
  language: keyof typeof LANGUAGE
}

/**
 * 解耦monaco
 * @param target
 * @param options
 */
const useMonaco = (target: Ref, options: Options) => {
  const changeEventHook = createEventHook<string>()
  const isSetup = ref(false)

  let editor: editor.IStandaloneCodeEditor

  const init = async () => {
    const { monaco } = await setupMonaco()

    monaco.editor.defineTheme(EDITOR_THEME.DARK, darktheme as any)
    monaco.editor.defineTheme(EDITOR_THEME.LIGHT, lightTheme as any)

    watch(target, () => {
      const el = unref(target)
      console.log('watch', el)
      if (!el)
        return
      const uri = monaco.Uri.parse(`file:///root/${Date.now()}.${LANGUAGE[options.language]}`)

      const model = monaco.editor.createModel(options.code, options.language, uri)
      editor = monaco.editor.create(el, {
        model,
        tabSize: 2,
        insertSpaces: true,
        autoClosingQuotes: 'always',
        detectIndentation: false,
        folding: true,
        automaticLayout: true,
        theme: EDITOR_THEME.LIGHT,
        minimap: {
          enabled: false,
        },
      })
      isSetup.value = true

      watch(isDark, () => {
        monaco.editor.setTheme(isDark.value ? EDITOR_THEME.DARK : EDITOR_THEME.LIGHT)
      }, { immediate: true })

      console.log('use-monaco', {
        model,
        editor,
        uri,
      })
    }, {
      flush: 'post',
      immediate: true,
    })
  }
  init()

  tryOnUnmounted(() => stop())

  return {}
}

export default useMonaco
