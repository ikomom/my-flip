// import WorkerUri from '../worker/fileMd5.worker?worker'
import { cloneDeep } from 'lodash-es'
import workerpool from 'workerpool'

class Task {
  private _ready = false
  constructor(public name: string) {
  }

  start() {
    this._ready = false
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
      if (property !== 'length')
        console.log('[proxyLog set]', cloneDeep({ property, value }))

      Reflect.set(target, property, value, receiver)
      return true
    },
  })
}
function toPlain(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

function createPool({ max = 4 } = {}) {
  const queue: any[] = proxyLog([])
  const runningQueue: any[] = []

  // const workMap = new WeakMap<any, any>()
  //

  // workMap.set('1', () => {})
  // queue.push(worker1)
  // queue.push(worker2)

  function _processNext() {
    while (runningQueue.length < max) {
      const p = queue.pop()
      if (p)
        runningQueue.push(p)

      else
        break
    }
    // TODO: 运行队列，并等待返回
    console.log({ runningQueue, queue: toPlain(queue) })
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
  const { exec } = createPool()
  for (let i = 0; i < 6; i++) {
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
  async function add(a: number, b: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(a + b)
      }, Math.random() * 5000)
    })
  }

  pool
    .exec(add, [3, 4])
    .then((result: number) => {
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
