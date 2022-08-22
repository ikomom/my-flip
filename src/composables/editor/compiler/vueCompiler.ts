import { MagicString, babelParse, compileScript, compileTemplate, parse, rewriteDefault } from 'vue/compiler-sfc'
import { walk } from 'estree-walker'
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
 * @param file
 * @param opt
 */
export const compilerVue = async (file: EditorFile, opt?: Partial<VueCompilerOptions>) => {
  const {
    code,
    filename,
  } = file
  const codeResult = []
  const { ssr } = { ...defaultOption, ...opt }
  const id = await hashId(filename)
  // ssr ? 'ssrRender' :
  const fnName = 'render'
  // 解析词法分析
  const { descriptor } = parse(code, {
    filename,
  })
  // console.log('1: descriptor', id, descriptor)
  // 编译<script></script>
  const compiledScript = compileScript(descriptor, {
    id,
    // inlineTemplate: true, // 内联template
    // templateOptions: { ssr, ssrCssVars: descriptor.cssVars },
  })
  // console.log('2: compiledScript', compiledScript)
  // export default 转为 const var =
  const rewriteCode = rewriteDefault(compiledScript.content, COMP_IDENTIFIER)
  // console.log('3: code', { content: compiledScript.content, rewriteCode })

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

  return codeResult.join('\n')
}
// TODO: 测试 转换
export async function parseModule({ code, filename }: EditorFile) {
  const { descriptor } = parse(code, {
    filename,
    sourceMap: true,
  })

  const compiledScript = compileScript(descriptor, {
    id: filename,
    inlineTemplate: true, // 内联template
    templateOptions: { ssr: false, ssrCssVars: descriptor.cssVars },
  })
  const rewriteCode = rewriteDefault(compiledScript.content, COMP_IDENTIFIER)
  console.log('compiledScript', {
    content: compiledScript.content,
    rewriteCode,
  })
  const s = new MagicString(rewriteCode)
  const ast = babelParse(rewriteCode, {
    sourceType: 'module',
    sourceFilename: filename,
  }).program.body

  // 1.

  walk(ast, {
    enter(node, parent, key, index) {
      console.log('enter', { node, parent, key, index })
      if (node.type === 'Import' && parent.type === 'CallExpression')
        console.log('enter', { node, parent, key, index })
    },
    // leave(node, parent, key, index) {
    //   console.log('leave', { node, parent, key, index })
    // },
  })

  console.log('parseModule', {
    s,
    ast,
  })
}

export const astTest = (file: EditorFile) => {
  const s = new MagicString(file.code.trim())
  // @ts-expect-error
  window.s = s
  console.log(s)
}
