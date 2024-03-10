<script setup lang="ts">
import { mode } from '~/composables'

const { state, next } = useCycleList(['light', 'dark', 'cafe', 'dark contrast'], { initialValue: mode })
watchEffect(() => mode.value = state.value as any)
</script>

<template>
  <div justify-center text-xl flex mt-6 gap-2>
    <button icon-btn @click="next()">
      <i v-if="state === 'dark'" i-carbon-moon inline-block />
      <i v-if="state === 'light'" i-carbon-sun inline-block />
      <i v-if="state === 'cafe'" i-carbon-cafe inline-block />
      <i v-if="state === 'dark contrast'" i-carbon-contrast inline-block />
    </button>
    <a
      icon-btn i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/ikomom/my-flip"
      target="_blank"
      title="GitHub"
    />
    <select v-model="$i18n.locale" class="bg-transparent text-4 relative top-[-0.2rem] cursor-pointer">
      <option value="en">
        en
      </option>
      <option value="zh">
        zh
      </option>
    </select>
  </div>
</template>
