<script setup lang="ts">
import { createSingletonPromise } from '@vueuse/shared'
import SimpleWorker from '~/composables/simpleWorker/index.ts?worker'
import SimpleShareWorker from '~/composables/simpleWorker/ShareWorkerTest.ts?sharedworker'

const onTransitionEnd = (...args: any[]) => {
  console.log('Bar: onTransitionEnd', args)
}
const onTransitionStart = (...args: any[]) => {
  console.log('Bar: onTransitionStart', args)
}

const mockReq = () => {
  fetch('/login', {
    method: 'post',
  }).then(() => {
    fetch('/user')
  })
}

const f = async () => {
  let res: Response
  res = await fetch('/login', {
    method: 'post',
  })
  console.log('cc=cc')
  res = await fetch('/user')

  return res.json()
}

const fPromise = createSingletonPromise(f)
// 创建单例的promise, 之后调用直接返回结果, 不会重新运行逻辑
const testCreateSingletonPromise = async () => {
  console.log('createSingletonPromise', await fPromise())
  console.log('createSingletonPromise', await fPromise())
  console.log('createSingletonPromise', await fPromise())
  // console.log('async', await f())
}
let myWorker = $ref<any>()
const testSimpleWorker = () => {
  if (myWorker)
    myWorker.terminate()

  myWorker = new SimpleWorker()
  myWorker.onmessage = (e: any) => {
    console.log('Message received from worker', e)
  }
}
const postMsgWorker = () => {
  myWorker.postMessage('哈哈哈哈')
}

let myShareWorker = $ref<any>()
const testShareWorker = () => {
  if (myShareWorker) {
    console.log('已经开启')
    return
  }
  myShareWorker = new SimpleShareWorker()
  myShareWorker.port.onmessage = (e: any) => {
    console.log('shareWorker onmessage: ', e.data)
  }
  myShareWorker.port.onmessage = (e: any) => {
    console.log('shareWorker onmessage: ', e.data)
  }

  console.log('myShareWorker start', myShareWorker)
}
const postMsgShareWorker = () => {
  myShareWorker.port.postMessage({
    type: 'notifyTab',
    payload: {
      hello: 'world',
    },
  })
}

const shareWorkerClose = () => {
  if (myShareWorker) {
    myShareWorker.port.postMessage({
      type: 'CLOSE',
    })
    myShareWorker = undefined
  }
}

useEventListener('beforeunload', () => {
  shareWorkerClose()
})

onBeforeUnmount(() => {
  shareWorkerClose()
})
</script>

<template>
  <div
    flex="~ col"
    items-center
    @transitionstart="onTransitionStart"
    @transitionend="onTransitionEnd"
  >
    <div>Bar</div>
    <div class="space-x-1" mb-10>
      <button btn text-sm @click="mockReq">
        mock
      </button>
      <button btn text-sm @click="testCreateSingletonPromise">
        createSingletonPromise
      </button>
    </div>
    <div class="space-x-1" mb-10>
      <button btn text-sm @click="testSimpleWorker">
        simpleWorker
      </button>
      <button v-if="myWorker" btn text-sm @click="postMsgWorker">
        postMsgWorker
      </button>
    </div>

    <div class="space-x-1" mb-10>
      <button btn text-sm @click="testShareWorker">
        simpleShareWorker
      </button>
      <button v-if="myShareWorker" btn text-sm @click="postMsgShareWorker">
        postMsgWorker
      </button>
      <button v-if="myShareWorker" btn text-sm @click="shareWorkerClose">
        close
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
