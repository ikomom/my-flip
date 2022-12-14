<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { promiseMachine } from './machine'

const { state, send, service } = useMachine(promiseMachine)

console.log('#', { service, state: toRaw(state.value) })

service.onTransition((state) => {
  console.log('#:onTransition', state)
}).start()
</script>

<template>
  <div>
    fsm: xstate
    <div>
      current: {{ state.value }}

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
