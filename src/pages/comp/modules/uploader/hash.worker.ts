// https://stackoverflow.com/questions/56356655/structuring-a-typescript-project-with-workers

import SparkMD5 from 'spark-md5'

self.onmessage = function (e) {
  const { fileChunkList } = e.data
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()

  let count = 0
  fileReader.onload = function (e) {
    count++
    spark.append(e.target.result as ArrayBuffer) // Append array buffer
    console.log('append', count, spark)
    if (count === fileChunkList.length) {
      self.postMessage({
        hash: spark.end(),
      })
      count = 0
    }
    else {
      loadNext(count)
    }
  }
  fileReader.onerror = function () {
    console.warn('oops, something went wrong.')
  }

  function loadNext(index: number) {
    const chunkFile = fileChunkList[index]
    if (chunkFile)
      fileReader.readAsArrayBuffer(chunkFile.chunk)
  }
  loadNext(0)
}
