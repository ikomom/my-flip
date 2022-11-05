<script setup lang="ts">

</script>

<template>
  <div class="box">
    <h1>01</h1>
  </div>
</template>

<style scoped lang="scss">
$width: 200px;
$bgColor: #0e1538;

.box {
  position: relative;
  width: $width;
  height: 200px;
  background: $bgColor;
  border-radius: 20px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  overflow: hidden;
  resize: both;

  &:before {
    content: '';
    top: -40%;
    left: 25%;
    position: absolute;
    width: 50%;
    height: 180%;
    background: linear-gradient(315deg,#00ccff,#d400d4);
    animation: animate 4s linear infinite;
    transform-origin: center;
  }

  &:after {
    content: '';
    position: absolute;
    inset : 6px;
    background: $bgColor;
    border-radius: 15px;
    z-index: 2;
  }
  h1 {
    position: relative;
    z-index: 4;
  }
}
@keyframes animate
{
  0%
  {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(180deg);
  }

  80% {
    transform: rotate(270deg);
  }

  100%
  {
    transform: rotate(360deg);
  }
}
</style>
