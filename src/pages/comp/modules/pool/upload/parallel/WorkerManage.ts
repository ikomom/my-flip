interface WorkRequest {
  worker: Worker
  resolve: (...d: any) => void
  reject: (...d: any) => void
}

export class WorkerManage {
  private _queue: WorkRequest[] = []
  constructor() {
  }
}
