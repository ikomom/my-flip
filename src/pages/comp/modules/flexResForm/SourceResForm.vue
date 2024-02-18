<script setup lang="ts">
const sliderWidth = ref(100)
</script>

<template>
  <n-slider v-model:value="sliderWidth" />
  <form :style="{ width: `${sliderWidth}vw` }">
    <input type="text" required placeholder="Name">
    <input type="email" required placeholder="Email Address">
    <input type="submit" value="Subscribe">
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-wrap: wrap;

  & > input {
    flex: 1 1 10ch;
    margin: .5rem;
    min-width: 0;

    &[type="email"] {
      flex: 3 1 30ch;
    }
  }
}

input {
  border: none;
  background: hsl(0 0% 93%);
  border-radius: .25rem;
  padding: .75rem 1rem;

  &[type="submit"] {
    background: hotpink;
    color: white;
    box-shadow: 0 .75rem .5rem -.5rem hsl(0 50% 80%);
  }
}
</style>
