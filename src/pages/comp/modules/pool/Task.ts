// export type Task<Res> = () => Promise<Res>
import type { TaskStatus } from '~/pages/comp/modules/pool/constanst'

export class Task {
  status: TaskStatus = 'IDLE'
  promise: () => Promise<any>

  constructor(promise: () => Promise<any>) {
    this.promise = promise
    // this.status = ''
  }
}

export class TaskPool<TaskRes = any> {
  taskList: any[] = []
  max = 6
  min = 2

  constructor() {
  }

  add(item: any) {
    this.taskList.push(new Task(item))
  }

  clear() {
    this.taskList = []
  }

  start() {
    const { min, max, taskList } = this

    while (min <= taskList.length && taskList.length < max) {
      const task = this.taskList.pop()
      task.promise()
    }
  }
}
