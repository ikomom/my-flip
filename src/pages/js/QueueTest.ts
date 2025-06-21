import PQueue from 'p-queue'

// 创建一个队列实例，限制最大并发数为 2

// 模拟异步任务
export async function simulateAsyncTask(value, time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Task ${value} completed`)
      resolve(value)
    }, time)
  })
}

export function runQuene() {
  const queue = new PQueue({ concurrency: 1 })

  // 添加任务到队列
  for (let i = 0; i < 5; i++)
    queue.add(() => simulateAsyncTask(i, 1000 + i * 200))

  // 所有任务完成后输出
  queue.on('idle', () => {
    console.log('All tasks completed', queue)
  })
}
