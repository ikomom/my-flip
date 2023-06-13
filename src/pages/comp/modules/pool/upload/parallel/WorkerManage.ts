interface WorkRequest {
  worker: Worker
  resolve: (...d: any) => void
  reject: (...d: any) => void
}

/**
 * TODO: 参考pool
 */
export class WorkerManage {
  private _queue: WorkRequest[] = []
  constructor() {
  }
}
