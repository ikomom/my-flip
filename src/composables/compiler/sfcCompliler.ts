import * as defaultCompiler from '@vue/compiler-sfc'
import type { OrchestratorFile } from '../orchestrator'
import { orchestrator as store } from '../orchestrator'

const SFCCompiler: typeof defaultCompiler = defaultCompiler

/**
 * 编译文件
 * @param param0
 * @returns
 */
export async function compileFile({ filename, code, compiled }: OrchestratorFile) {
  if (!code.trim()) {
    store.errors = []
    return
  }

  if (!filename.endsWith('.vue')) {
    compiled.js = compiled.ssr = code
    store.errors = []
    return
  }

  const id = await hashId(filename)
  const { errors, descriptor } = SFCCompiler.parse(code, {
    filename,
    sourceMap: true,
  })
  console.log('compileFile', { filename, code, compiled, id }, { errors, descriptor })
  // 查看是否有预处理器
  if (
    (descriptor.script && descriptor.script.lang)
    || (descriptor.scriptSetup && descriptor.scriptSetup.lang)
    || descriptor.styles.some(s => s.lang)
    || (descriptor.template && descriptor.template.lang)
  ) {
    store.errors = [
      'lang="x" pre-processors are not supported in the in-browser playground.',
    ]
    return
  }
  const hasScoped = descriptor.styles.some(s => s.scoped)
  let clientCode = ''
  let ssrCode = ''

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }
  // const {errors, }
}

/**
 * 生成文件名的hash值
 *
 * @param filename
 * @returns
 */
async function hashId(filename: string) {
  const msgUint8 = new TextEncoder().encode(filename) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex.slice(0, 8)
}
