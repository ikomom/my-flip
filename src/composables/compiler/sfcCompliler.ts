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
  const compiler = SFCCompiler.parse(code, {
    filename,
    sourceMap: true,
  })
  console.log('compileFile', id, compiler)
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
