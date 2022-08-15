import type { Ref } from 'vue'
import type { editor } from 'monaco-editor'
import darkTheme from 'theme-vitesse/themes/vitesse-dark.json'
import lightTheme from 'theme-vitesse/themes/vitesse-light.json'
import { watch } from 'vue'
import { editorPlugins } from '~/monaco/plugins/editor'
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
export type languageType = keyof typeof LANGUAGE

interface Options {
  code: string
  language: languageType
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

  const setContent = async (content: string) => {
    await until(isSetup).toBeTruthy()
    if (editor)
      editor.setValue(content)
  }

  const init = async () => {
    const { monaco } = await setupMonaco()

    monaco.editor.defineTheme(EDITOR_THEME.DARK, darkTheme as any)
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

      const plugins = editorPlugins.filter(({ language }) => language === options.language)

      editor.getModel()?.onDidChangeContent(() => {
        // console.log('onChangeContent', editor.getValue())
        changeEventHook.trigger(editor.getValue())
        plugins.forEach(({ onContentChanged }) => onContentChanged(editor))
      })

      console.log('use-monaco', {
        model,
        editor,
        plugins,
        uri,
      })
    }, {
      flush: 'post',
      immediate: true,
    })
  }
  init()

  tryOnUnmounted(() => stop())

  return {
    onChange: changeEventHook.on,
    setContent,
  }
}

export default useMonaco
