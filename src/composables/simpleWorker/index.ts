self.onmessage = function (e) {
  console.log('Message received from main script')
  const workerResult = `Result: 【${e.data}】`
  const w = new Worker('./subWorker')
  console.log('Posting message back to main script', w)
  postMessage(workerResult)
}
