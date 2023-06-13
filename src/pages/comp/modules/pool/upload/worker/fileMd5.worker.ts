// https://stackoverflow.com/questions/56356655/structuring-a-typescript-project-with-workers
import SparkMD5 from 'spark-md5'
import { Md5 } from 'ts-md5/src/md5'

/**
 * spark太慢了
 * @param chunkList
 * @param calculateChunkHash
 */
function hashBySpark(chunkList: any[], calculateChunkHash = false) {
  return new Promise((resolve, reject) => {
    const chunkHash: string[] = []
    const spark = new SparkMD5.ArrayBuffer()
    const sparkChunk = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    let count = 0
    fileReader.onload = function (e) {
      count++
      const res = new Uint8Array(e.target.result as ArrayBuffer)
      if (calculateChunkHash) {
        sparkChunk.append(res)
        chunkHash.push(sparkChunk.end())
      }
      else {
        spark.append(res)
      }
      // console.log('append', count, spark)

      if (count === chunkList.length) {
        const data: any = {}
        if (calculateChunkHash)
          data.chunkHash = chunkHash
        else
          data.hash = spark.end()
        count = 0
        resolve(data)
      }
      else {
        loadNext(count)
      }
    }
    fileReader.onerror = function (e) {
      console.warn('oops, something went wrong.')
      reject(e)
    }

    function loadNext(index: number) {
      calculateChunkHash && sparkChunk.reset()
      const chunkFile = chunkList[index]
      if (chunkFile)
        fileReader.readAsArrayBuffer(chunkFile.chunk)
    }
    loadNext(0)
  })
}

function hashByMd5(chunkList: any, calculateChunkHash = false) {
  return new Promise((resolve, reject) => {
    const md5 = new Md5()
    const md5Chunk = new Md5()
    const chunkHash: string[] = []
    const fileReader = new FileReader()

    let count = 0
    fileReader.onload = function (e) {
      count++
      const res = new Uint8Array(e.target.result as ArrayBuffer)
      if (calculateChunkHash) {
        md5Chunk.appendByteArray(res)
        chunkHash.push(md5Chunk.end() as string)
      }
      else {
        md5.appendByteArray(res)
      }

      if (count === chunkList.length) {
        const data: any = {}
        if (calculateChunkHash)
          data.chunkHash = chunkHash
        else
          data.hash = md5.end()
        count = 0
        resolve(data)
      }
      else {
        loadNext(count)
      }
    }
    fileReader.onerror = function (e) {
      console.warn('oops, something went wrong.')
      reject(e)
    }

    function loadNext(index: number) {
      // md5Chunk.start()
      const chunkFile = chunkList[index]
      if (chunkFile)
        fileReader.readAsArrayBuffer(chunkFile.chunk)
    }
    loadNext(0)
  })
}

self.onmessage = function (e) {
  const { chunkList, type, calculateChunkHash, autoClose } = e.data
  console.log('onmessage', chunkList);
  (type === 'spark' ? hashBySpark : hashByMd5)(chunkList, calculateChunkHash)
    .then((data) => {
      self.postMessage({ success: true, data })
    })
    .catch((e) => {
      self.postMessage({ success: false, data: e })
    })
    .finally(() => {
      if (autoClose)
        self.close()
    })
}
