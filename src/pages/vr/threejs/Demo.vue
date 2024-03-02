<script setup lang="ts">
import type { Camera, Renderer, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import type { ColorRepresentation } from 'three/src/math/Color'

const container = ref()
let scene: Scene, camera: Camera, renderer: Renderer, controls: OrbitControls, stats: Stats
const width = 1300
const height = 400
// cube.rotation.z = 45 / 180 * Math.PI // 角度转弧度公式，欧拉角
function createCube(color?: ColorRepresentation) {
  const d = 1 || Math.random()
  // 物体 = geometry(几何体） + material(材质）
  const geometry = new THREE.BoxGeometry(d, d, d)
  const material = new THREE.MeshBasicMaterial({
    color: color ?? 0xFFFFFF/* * Math.random() */,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(getRandom(), getRandom(), getRandom())
  return cube
}
function getRandom() {
  return (Math.random() - 0.5) * 4
}
function init() {
  // 场景
  scene = new THREE.Scene()

  // 镜头
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100)
  camera.lookAt(0, 0, 0)
  camera.position.set(0, 0, 4)
  // 坐标系
  const axes = new THREE.AxesHelper(2)
  scene.add(axes)

  const group = new THREE.Group()
  const group2 = new THREE.Group()
  // const cubes: Mesh[] = []

  group2.add(createCube('red'))
  group.add(group2)
  for (let i = 0; i < 3; i++)
    group.add(createCube())

  // cubes.forEach((cube) => {
  //   scene.add(cube)
  // })
  scene.add(group)

  // 渲染器
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)
  // fps
  stats = new Stats()
  // stats.dom.style.position = 'absolute'
  container.value.appendChild(stats.dom)

  // 镜头控制
  controls = new OrbitControls(camera, renderer.domElement)

  const clock = new THREE.Clock()
  function tick() {
    const time = clock.getElapsedTime()
    // 更改逻辑
    // 60HZ * 0.01 = 0.6
    // 120HZ + 0.01 = 1.2
    // 刷新率不同运动越快; 不同电脑刷新率不同那每两帧时间间隔不一样，deltaTime不一样了那不同电脑的动画不就不一样
    // cubes.forEach((cube, index) => {
    //   cube.rotation.z = time * 0.4 + index
    //   // cube.position.x = Math.sin(time)
    //   // cube.position.y = Math.cos(time)
    // })
    group.rotation.x = time * 0.4
    group2.rotation.x = time * 0.8

    // 渲染
    renderer.render(scene, camera)
    stats.update()
    // controls.update()
    requestAnimationFrame(tick)
  }
  tick()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
