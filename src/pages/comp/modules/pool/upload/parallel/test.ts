// import WorkerUri from '../worker/fileMd5.worker?worker'
import workerpool from 'workerpool'

enum TaskStatus {
  READY,
  PENDING,
  SUCCESS,
  ERROR,
}

// 1. 许多耗时的异步任务
// 2. 把这些任务放到列表中
// 3. 限制最大运行的异步任务数，减小浏览器内存开销
// 4. 任务运行成功后或者新加任务后，检查队列，检查是否有需要运行的任务
class Task {
  private _ready = false
  private _status: TaskStatus = TaskStatus.READY

  constructor(public name: string) {
  }

  get status() {
    return this._status
  }

  setStatus(status: TaskStatus) {
    this._status = status
  }

  start() {
    this._ready = false
    const random = 1000 * Math.random()
    return fetch(`/api/echo?q=${random}`)

    // return new Promise((resolve) => {
    //   const random = 1000 * Math.random()
    //   setTimeout(() => {
    //     resolve(random)
    //   }, random)
    // })
  }

  terminal() {
    this._ready = true
  }
}

function proxyLog(obj: any) {
  return new Proxy<any>(obj, {
    get(target, property) {
      // console.log('[proxyLog get]', cloneDeep({ property }))
      return Reflect.get(target, property)
    },
    set(target, property, value, receiver) {
      // if (property !== 'length')
      //   console.log('[proxyLog set]', cloneDeep({ property, value }))

      Reflect.set(target, property, value, receiver)
      return true
    },
  })
}
function toPlain(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}
interface QueueItem { task: Task; resolve: any; reject: any; args: any[] }
function createPool({ max = 4 } = {}) {
  const queue: QueueItem[] = proxyLog([])
  let _max = max

  function taskFilter(s: QueueItem) {
    return s.task.status === TaskStatus.READY || s.task.status === TaskStatus.ERROR
  }

  function log(...args: any[]) {
    // console.log(...args)
  }

  function _processNext() {
    const readyCount = queue.filter(taskFilter).length
    const successCount = queue.filter(s => s.task.status === TaskStatus.SUCCESS).length
    log('_processNext', { _max, readyCount, successCount })
    // eslint-disable-next-line no-unmodified-loop-condition
    while (readyCount > 0 && _max > 0) {
      const item = queue.find(taskFilter)
      log(item, { _max, readyCount })
      if (!item)
        return
      // 释放通道
      _max--
      item.task.setStatus(TaskStatus.PENDING)
      item.task.start().then((res) => {
        item.task.setStatus(TaskStatus.SUCCESS)
        item.resolve(res)
      }).catch((e) => {
        item.task.setStatus(TaskStatus.ERROR)
        item.reject(e)
      }).finally(() => {
        log('next', toPlain(queue))
        // 增加通道
        _max++
        _processNext()
      })
    }
  }

  console.log({ queue })
  return {
    exec(task: Task, args: any[] = []) {
      return new Promise((resolve, reject) => {
        queue.push({
          task,
          args,
          resolve,
          reject,
        })
        _processNext()
      })
    },
  }
}

export function runTest() {
  const { exec } = createPool({ max: 6 })
  for (let i = 0; i < 1000; i++) {
    const task = new Task(`task_${i}`)
    exec(task, [i]).then((res) => {
      console.log(`res_${i}`, res)
    })
  }
}

const pool = workerpool.pool({
  // maxWorkers: 6,
  minWorkers: 2,
})
workerpool.pool({})
export function runWorkerPool() {
  function add(a: number, b: number) {
    return a + b
  }

  pool
    .exec(add, [3, 4])
    .then((result) => {
      console.log('result', result, workerpool) // outputs 7
    })
    .catch((err: Error) => {
      console.error(err)
    })
    .then(() => {
      setTimeout(() => {
        console.log('termiaml')
        pool.terminate()
      }, 5000)
    })
}
