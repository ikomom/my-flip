<script lang="ts" setup>
import Panorama from '~/pages/vr/threejs/Panorama.vue'
import Demo from '~/pages/vr/threejs/Demo.vue'
import SimpleCar from '~/pages/vr/threejs/SimpleCar.vue'
import DetailCar from '~/pages/vr/threejs/DetailCar.vue'
import MaterialSet from '~/pages/vr/threejs/MaterialSet.vue'
import LightOverwrite from '~/pages/vr/threejs/LightOverwrite.vue'
import SplitDemo from '~/pages/vr/threejs/SplitDemo.vue'
import RoadScroll from '~/pages/vr/threejs/RoadScroll.vue'
</script>

<template>
  <n-tabs>
    <n-tab-pane name="RoadScroll" tab="RoadScroll">
      <RoadScroll />
    </n-tab-pane>
    <n-tab-pane name="SplitDemo" tab="SplitDemo">
      <SplitDemo />
    </n-tab-pane>
    <n-tab-pane name="LightOverwrite" tab="LightOverwrite">
      <LightOverwrite />
    </n-tab-pane>
    <n-tab-pane name="MaterialSet" tab="MaterialSet">
      <MaterialSet />
    </n-tab-pane>
    <n-tab-pane name="DetailCar" tab="DetailCar">
      <DetailCar />
    </n-tab-pane>
    <n-tab-pane name="SimpleCar" tab="SimpleCar">
      <SimpleCar />
    </n-tab-pane>
    <n-tab-pane name="demo" tab="demo">
      <Demo />
    </n-tab-pane>
    <n-tab-pane name="panorma" tab="panorma">
      <Panorama />
    </n-tab-pane>
  </n-tabs>
</template>
