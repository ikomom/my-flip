import { createSingletonPromise } from '@vueuse/core'
import * as monaco from 'monaco-editor'
import vueuseTypes from '@vueuse/core/index.d.ts?raw'

const setupMonaco = createSingletonPromise(async () => {
  const monacoTypescriptJs = monaco.languages.typescript.javascriptDefaults
  // 设置ts编译选项
  monacoTypescriptJs.setCompilerOptions({
    ...monacoTypescriptJs.getCompilerOptions(),
    noUnusedLocals: false,
    noUnusedParameters: false,
    allowUnreachableCode: true,
    allowUnusedLabels: true,
    strict: false,
    allowJs: true,
  })

  const registered: string[] = ['vue', '@vueuse/core']
  // 添加外部定义 TODO: 注册第三方包
  monacoTypescriptJs.addExtraLib(`declare module '@vueuse/core' { ${vueuseTypes} }`, 'ts:vueuse')
  monacoTypescriptJs.addExtraLib(`declare module 'vue' { ${vueuseTypes} }`, 'ts:vue')

  await Promise.all([
    // worker线程
    (async () => {
      const [
        { default: EditorWorker },
        { default: HtmlWorker },
        { default: TsWorker },
      ] = await Promise.all([
        import('monaco-editor/esm/vs/editor/editor.worker?worker'),
        import('./languages/html/html.worker?worker'),
        import('monaco-editor/esm/vs/language/typescript/ts.worker?worker'),
      ])
      console.log('worker', { EditorWorker, HtmlWorker, TsWorker })
      // @ts-expect-error
      window.MonacoEnvironment = {
        getWorker(_: any, label: string) {
          console.log('MonacoEnvironment getWorker', { _, label })
          if (['html', 'handlebars', 'razor'].includes(label))
            return new HtmlWorker()
          if (['typescript', 'javascript'].includes(label))
            return new TsWorker()
          return new EditorWorker()
        },
      }
    })(),
  ])

  const injection_arg = monaco

  if (getCurrentInstance())
  // await new Promise<void>(resolve => onMounted(resolve))

    console.log('getCurrentInstance()', getCurrentInstance())

  return { monaco }
})

export default setupMonaco
