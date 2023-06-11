interface HashingRequest {
  blob: Blob
  resolve: (...d: any) => void
  reject: (...d: any) => void
}

export class FileParallelHasher {
  private _queue: HashingRequest[] // 运行队列
  private _hashWorker: Worker
  private _processing?: HashingRequest // 当前运行的请求
}
