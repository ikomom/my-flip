import { compileScript, compileTemplate, parse, rewriteDefault } from 'vue/compiler-sfc'

import type EditorFile from '~/composables/editor/EditorFile'
import { hashId } from '~/utils/utils'

interface VueCompilerOptions {
  ssr: boolean
}

const defaultOption: VueCompilerOptions = {
  ssr: false,
}

// 变量名
export const COMP_IDENTIFIER = '__sfc__'

/**
 * 编译vue代码
 *
 * @param code
 * @param filename
 * @param opt
 */
export const compilerVue = async ({ code, filename }: EditorFile, opt?: Partial<VueCompilerOptions>) => {
  const codeResult = []
  const { ssr } = { ...defaultOption, ...opt }
  const id = await hashId(filename)
  // ssr ? 'ssrRender' :
  const fnName = 'render'
  // 解析词法分析
  const { descriptor } = parse(code, {
    filename,
  })
  console.log('1: descriptor', id, descriptor)
  // 编译<script></script>
  const compiledScript = compileScript(descriptor, {
    id,
    // inlineTemplate: true, // 内联template
    // templateOptions: { ssr, ssrCssVars: descriptor.cssVars },
  })
  console.log('2: compiledScript', compiledScript)
  // export default 转为 const var =
  const rewriteCode = rewriteDefault(compiledScript.content, COMP_IDENTIFIER)
  console.log('3: code', { content: compiledScript.content, rewriteCode })

  codeResult.push(rewriteCode)
  // 编译<template></template>
  const compiledTemple = compileTemplate({
    source: descriptor.template.content,
    filename: descriptor.filename,
    id,
    isProd: false,
    // ssr,
    compilerOptions: {
      bindingMetadata: compiledScript.bindings,
    },
  })
  codeResult.push(
    compiledTemple.code.replace(/\nexport (function|const) (render|ssrRender)/,
      `$1 ${fnName}`),
  )
  codeResult.push(
    `${COMP_IDENTIFIER}.${fnName} = ${fnName}`,
  )
  console.log('4: compiledTemple', compiledTemple)

  return codeResult.join('\n')
}

