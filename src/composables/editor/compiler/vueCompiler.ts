import {
  MagicString,
  babelParse,
  compileScript,
  compileTemplate,
  extractIdentifiers,
  isInDestructureAssignment,
  isStaticProperty,
  parse,
  rewriteDefault,
  walkIdentifiers,
} from 'vue/compiler-sfc'
import { walk } from 'estree-walker'
import type { ExportSpecifier, Identifier, ImportDeclaration, Node, ObjectProperty } from '@babel/types'
import { cloneDeep } from 'lodash-es'
import type EditorFile from '~/composables/editor/EditorFile'
import { hashId } from '~/utils/utils'
import type { EditorCore } from '~/composables/editor/EditorCore'
import { MAIN_FILE } from '~/composables/editor/EditorCore'

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

export const modulesKey = '__modules__'
const moduleKey = '__module__'
export const exportKey = '__export__'
const dynamicImportKey = '__dynamic_import__'

/**
 * 从node中提取标识名
 * @param node
 */
function extractNames(node: Node): string[] {
  return extractIdentifiers(node).map(id => id.name)
}

/**
 * 转换module
 * @param code
 * @param filename
 * @param core
 */
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
  // console.log('compiledScript', {
  //   content: compiledScript.content,
  //   rewriteCode,
  // })

  return `${rewriteCode}\n${modulesKey}["${filename}"] = ${COMP_IDENTIFIER}`
}

/**
 * 连接多文件代码, 编译css
 * @param core
 */
export const startProcessFile = (core: EditorCore) => {
  const processFile = (file: EditorFile) => {
    const { filename, compiled } = file
    const s = new MagicString(compiled.js)
    const ast = babelParse(compiled.js, {
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
      if (!(_filename in core.files))
        throw new Error(`File "${_filename}" does not exist.`)
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

    /**
     * 定义导出
     *
     * @param name
     * @param local
     */
    function definedExport(name: string, local = name) {
      s.append(`\n${exportKey}(${moduleKey}, "${name}", () => ${local})`)
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
          // console.log('node', { value: node.source.value, importId })
          for (const spec of node.specifiers) {
            // console.log('spec', spec.type, spec.local.name)
            // 根据不同导入做映射
            switch (spec.type) {
              //  import foo from 'foo'
              case 'ImportDefaultSpecifier':
                // TODO: 暂时去掉.default
                idToImportMap.set(spec.local.name, `${importId}`)
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

      // 2. 检查所有导出: TODO
      /*   // export
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration) {
          switch (node.declaration.type) {
            case 'FunctionDeclaration':
            case 'ClassDeclaration':
              definedExport(node.declaration.id.name)
              break
            case 'VariableDeclaration':
              for (const decl of node.declaration.declarations) {
                const names = extractNames(decl)
                console.log('names', names)
              }
              break
          }
        }
      }
      // export default
      if (node.type === 'ExportDefaultDeclaration') {
      }
      // export * from './foo'
      if (node.type === 'ExportAllDeclaration') {
      } */
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
          // 转换shorthand a = {b: __import__.b}
          if (
            // 跳过解构赋值
            !(parent as any).inPattern
            || isInDestructureAssignment(parent, parentStack)
          )
            s.appendLeft(id.end, `: ${binding}`)
        }
        else {
          // 替换标识符
          s.overwrite(id.start, id.end, binding)
        }

        // console.log('WalkIdentifiers', cloneDeep({ name: id.name, binding, id, parent, parentStack }))
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

    s.prepend(`console.log("${filename} loaded", JSON.stringify(__modules__));\n`)

    const processed = [s.toString()]
    if (importedFiles.size) {
      for (const imported of importedFiles)
        processed.push(...processFile(core.files[imported]))
    }
    //
    // console.log('parseModule', {
    //   s,
    //   code: s.toString(),
    //   ast,
    //   importedFiles,
    //   importToIdMap,
    //   idToImportMap,
    //   processed,
    // })
    return processed
  }

  if (core.files[MAIN_FILE])
    return processFile(core.files[MAIN_FILE]).reverse()
  else
    return []
}

export const astTest = (file: EditorFile) => {
  const s = new MagicString(file.code.trim())
  // @ts-expect-error
  window.s = s
  console.log(s)
}
