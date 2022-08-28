import { MagicString, babelParse, compileScript, compileTemplate, parse, rewriteDefault, walkIdentifiers } from 'vue/compiler-sfc'
import { walk } from 'estree-walker'
import type { ExportSpecifier, Identifier, ImportDeclaration, Node, ObjectProperty } from '@babel/types'
import { cloneDeep } from 'lodash-es'
import type EditorFile from '~/composables/editor/EditorFile'
import { hashId } from '~/utils/utils'
import type { EditorCore } from '~/composables/editor/EditorCore'

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
/**
 * 是否是静态属性
 * 动态属性 a[b] 时 computed true
 *
 * @param node
 */
const isStaticProperty = (node: Node): node is ObjectProperty =>
  node.type === 'ObjectProperty' && !node.computed

const modulesKey = '__modules__'
const moduleKey = '__module__'
const exportKey = '__export__'
const dynamicImportKey = '__dynamic_import__'

/**
 * 转换module
 * @param code
 * @param filename
 * @param core
 */
export async function parseModule({ code, filename }: EditorFile, core: EditorCore) {
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
  // console.log('compiledScript', {
  //   content: compiledScript.content,
  //   rewriteCode,
  // })
  const s = new MagicString(rewriteCode)
  const ast = babelParse(rewriteCode, {
    sourceType: 'module',
    sourceFilename: filename,
  }).program.body

  // 已经导入的文件
  const importedFiles = new Set<string>()
  // 文件名与Id的映射
  const importToIdMap = new Map<string, string>()
  // 变量引入名与实际引入地址间的映射
  const idToImportMap = new Map<string, string>()

  /**
   * 自定义import
   * @param node
   */
  function defineImport(node: ImportDeclaration) {
    const _filename = node.source.value.replace(/^\.\/+/, '')
    // 检查文件是否存在
    // if (!(_filename in core.files))
    //   throw new Error(`File "${_filename}" does not exist.`)
    // 只需要导入一次
    if (importedFiles.has(_filename))
      return importToIdMap.get(_filename)

    importedFiles.add(_filename)
    // 自增id
    const id = `__import_${importedFiles.size}__`
    importToIdMap.set(_filename, id)
    // 头部添加引用
    s.appendLeft(node.start, `const ${id} = ${modulesKey}[${JSON.stringify(_filename)}]`)

    return id
  }

  // 0. 引入当前文件的module
  s.prepend(`const ${moduleKey} = ${modulesKey}[${JSON.stringify(filename)}]\n`)

  for (const node of ast) {
    // 1. 检查所有导入并且记录id
    if (node.type === 'ImportDeclaration') {
      const source = node.source.value
      // 只考虑本地模块处理，非本地模块使用import-maps导入
      if (source.startsWith('./')) {
        const importId = defineImport(node as ImportDeclaration)
        console.log('node', { value: node.source.value, importId })
        for (const spec of node.specifiers) {
          console.log('spec', spec.type, spec.local.name)
          // 根据不同导入做映射
          switch (spec.type) {
            //  import foo from 'foo'
            case 'ImportDefaultSpecifier':
              idToImportMap.set(spec.local.name, `${importId}.default`)
              break
            // import { baz } from 'foo'
            case 'ImportSpecifier':
              idToImportMap.set(spec.local.name, `${importId}.${(spec.imported as Identifier).name}`)
              break
            // import * as ok from 'foo'
            case 'ImportNamespaceSpecifier':
              idToImportMap.set(spec.local.name, `${importId}`)
              break
          }

          s.remove(node.start, node.end)
        }
      }
    }

    // 2. 检查所有导出
    // 命名导出
    if (node.type === 'ExportNamedDeclaration') {}
    // 默认导出
    if (node.type === 'ExportDefaultDeclaration') {}
    // 导出全部 export * from './foo'
    if (node.type === 'ExportAllDeclaration') {}
  }
  // 3. 对替换后的引用进行转换
  for (const node of ast) {
    if (node.type === 'ImportDeclaration')
      continue
    walkIdentifiers(node, (id, parent, parentStack) => {
      const binding = idToImportMap.get(id.name)
      if (!binding)
        return
      // shorthand: const a = {b} ; b 就是 shorthand es6新特性，简写
      if (isStaticProperty(parent) && parent.shorthand) {

      }

      console.log('WalkIdentifiers', cloneDeep({ name: id.name, binding, id, parent, parentStack }))
    })
  }

  // walk(ast, {
  //   enter(node, parent, key, index) {
  //     // console.log('enter', { node, parent, key, index })
  //     if (node.type === 'Import' && parent.type === 'CallExpression')
  //       console.log('enter', { node, parent, key, index })
  //   },
  //   // leave(node, parent, key, index) {
  //   //   console.log('leave', { node, parent, key, index })
  //   // },
  // })

  console.log('parseModule', {
    s,
    code: s.toString(),
    ast,
    importedFiles,
    importToIdMap,
    idToImportMap,
  })
}

export const astTest = (file: EditorFile) => {
  const s = new MagicString(file.code.trim())
  // @ts-expect-error
  window.s = s
  console.log(s)
}
