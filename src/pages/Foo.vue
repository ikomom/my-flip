<script lang="ts" setup>
let size = $(useStorage('size', 100))

function enLarge() {
  size += 20
}

function reset() {
  size = 100
}
</script>

<template>
  <div flex="~ col" items-center>
    <div>Foo</div>
    <div class="space-x-1" mb-10>
      <RouterLink to="/" btn text-sm>
        back
      </RouterLink>
      <button btn text-sm @click="enLarge()">
        变大
      </button>
      <button btn text-sm @click="reset()">
        重置
      </button>
    </div>
    <div m10 flex="~ col sm:row">
      <float-proxy flex-shrink-0 rounded="1/2" :style="{ width: `${size}px`, height: `${size}px` }" />
      <p flex-auto>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      </p>
    </div>
  </div>
</template>
