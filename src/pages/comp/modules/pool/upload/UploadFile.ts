import filetypeinfo from 'magic-bytes.js'
import FileMD5Worker from './worker/fileMd5.worker?worker'
import { UploadFileChunk } from './UploadFileChunk'
import { MB_BIT, sliceRange } from '~/pages/comp/modules/pool/utils'

export interface UploadFileOptions {
  chunkSize: number // M
}

function calculateChunkList(
  chunkList: UploadFileChunk[],
  calculateChunkHash: boolean,
) {
  const fileMD5Worker = new FileMD5Worker()
  return new Promise<any>((resolve, reject) => {
    const start = new Date().getTime()
    fileMD5Worker.postMessage({ chunkList, calculateChunkHash, autoClose: true })
    fileMD5Worker.onmessage = (e) => {
      const end = new Date().getTime()
      if (e.data.success)
        resolve({ ...e.data.data, time: end - start })
      else
        reject(e.data.data)
    }
    fileMD5Worker.onerror = (e) => {
      reject(e)
    }
  })
}

export class UploadFile {
  loaded: number
  chunks: UploadFileChunk[]
  options: Partial<UploadFileOptions>

  constructor(public file: File, options?: Partial<UploadFileOptions>) {
    this.loaded = 0

    const chunks: UploadFileChunk[] = []
    if (options?.chunkSize > 0) {
      sliceRange(file.size, options?.chunkSize * MB_BIT, (start, end) => {
        chunks.push(new UploadFileChunk(shortId(), file.slice(start, end, file.type)))
      })
    }
    else {
      chunks.push(new UploadFileChunk(shortId(), file.slice(0, file.size, file.type)))
    }

    this.chunks = chunks
  }

  /**
   * TODO: 添加线程池管理代码
   */
  getHash(autoSetChunk = true) {
    const start = new Date().getTime()
    return Promise.all([
      calculateChunkList(this.chunks, false),
      calculateChunkList(this.chunks, true),
    ])
      .then(([allHashObj, chunkHashObj]) => {
        const end = new Date().getTime()
        if (autoSetChunk) {
          this.chunks.forEach((chunk, index) => {
            chunk.fileHash = allHashObj.hash
            chunk.chunkHash = chunkHashObj.chunkHash?.[index]
          })
        }
        return {
          allHashObj,
          chunkHashObj,
          time: end - start,
        }
      })
  }

  getTypeInfo() {
    return new Promise((resolve) => {
      this.file.slice(0, 30).arrayBuffer().then((res) => {
        resolve(filetypeinfo(new Uint8Array(res)))
      })
    })
  }
}
