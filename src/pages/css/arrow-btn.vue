<script setup lang="ts">

</script>

<template>
  <a class="arrow-btn" href="#"><i /><span>EXPLORE</span></a>
</template>

<style scoped lang="scss">
.arrow-btn {
  background: #333;
  color: rgba(255, 255, 225, 0.8);
  padding: 8px 16px;
  letter-spacing: 2px;
  font-weight: 500;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #359ad8;
    transform: scaleX(0);
    transition: transform 0.5s ease-in-out;
    transform-origin: right;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  span {
    display: inline-block;
    z-index: 2;
    position: relative;
    transition: 0.5s ease-in-out;
  }

  &:hover span {
    color: #333;
  }

  i {
    position: relative;
    display: inline-block;
    width: 2px;
    height: 18px;
    margin-right: 10px;
    background: #d3d636;
    transition: 0s, width 0.5s, height 0.5s;
    transition-delay: 0s, 0.5s, 0.8s;

    // 箭头
    &::before {
      content: '';
      position: absolute;
      top: 0.5px;
      right: 0;
      width: 10px;
      height: 1.5px;
      background: transparent;
      rotate: 0;
      transition: 1s;
      transform-origin: right;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0.5px;
      right: 0;
      width: 10px;
      height: 1.5px;
      background: transparent;
      rotate: 0;
      transition: 1s;
      transform-origin: right;
    }
  }

  &:hover i {
    width: 24px;
    height: 2px;
    transition-delay: 0s, 0.8s, 0.5s;
    background: #333;

    &::before {
      background: #333;
      rotate: 45deg;
      transition-delay: .8s;
    }
    &::after {
      background: #333;
      rotate: -45deg;
      transition-delay: .8s;
    }
  }
}
</style>
