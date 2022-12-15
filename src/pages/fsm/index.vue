<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { promiseMachine } from './machine'

const { state, send, service } = useMachine(promiseMachine)
const { initialState } = promiseMachine

console.log('#', { service, state: toRaw(state.value) })

service.onTransition((state) => {
  console.log('#:onTransition', state)
}).start()
const matchText = ref()
const matched = ref(false)
watchEffect(() => {
  console.log('#wathc', matchText.value)
  matched.value = matchText.value ? state.value.matches(matchText.value) : false
})

const sendText = ref()
</script>

<template>
  <h1 text="5" font-bold m-2>
    fsm: xstate
  </h1>
  <div>
    changed: {{ state.changed ?? '-1' }}
    <div b="2 green" p="2" m-2>
      match({{ matched }}): <n-input v-model:value="matchText" placeholder="是否匹配" />
    </div>
    <div b="2 green" p="2" m-2>
      <n-input-group>
        send:
        <n-input v-model:value="sendText" :style="{ width: '50%' }" />
        <n-button type="primary" ghost @click="sendText && send(sendText)">
          发送
        </n-button>
      </n-input-group>
    </div>
    <div m-2>
      current: {{ state.value }} <br>
      route: {{ state.toStrings() }}<br>
      meta: {{ state.meta }}<br>

      <!-- <n-space>
        <button btn @click="service.start()">
          start
        </button>
        <button btn @click="service.stop()">
          stop
        </button>
      </n-space> -->
      <n-divider />
      <n-space>
        <button v-for="ev in state.nextEvents" :key="ev" btn @click="send(ev)">
          {{ ev }}
        </button>
      </n-space>
      {{ state.actions }}
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
