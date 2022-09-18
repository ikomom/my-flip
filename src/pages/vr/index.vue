<script lang="ts" setup>
import * as THREE from 'three'
import type { Camera, Material, Renderer, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const container = ref()

let scene: Scene, camera: Camera, renderer: Renderer, controls: OrbitControls
const width = 1200
const height = 500

function addBoxMaterials() {
  const materials: Material[] = []
  // 根据左右上下前后的顺序构建六个面的材质集
  const texture_left = new THREE.TextureLoader().load('/images/vr/right.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_left }))

  const texture_right = new THREE.TextureLoader().load('/images/vr/left.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_right }))

  const texture_top = new THREE.TextureLoader().load('/images/vr/top.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_top }))

  const texture_bottom = new THREE.TextureLoader().load('/images/vr/bottom.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_bottom }))

  const texture_front = new THREE.TextureLoader().load('/images/vr/front.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_front }))

  const texture_back = new THREE.TextureLoader().load('/images/vr/back.jpg')
  materials.push(new THREE.MeshBasicMaterial({ map: texture_back }))

  const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials)
  skyBox.geometry.scale(0.8, 0.8, -1)
  scene.add(skyBox)
}

function addSphereMaterials() {
  // 节点数量越大，需要计算的三角形就越多，影响性能sphereGeometry.scale(1, 1, -1);
  const sphereGeometry = new THREE.SphereGeometry(/* 半径 */1, /* 垂直节点数量 */50, /* 水平节点数量 */50)
  sphereGeometry.scale(1, 1, -1)

  const texture = new THREE.TextureLoader().load('/images/vr/img.png')
  const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture })

  const box = new THREE.BoxGeometry(1, 1, 1)
  box.scale(1, 1, -1)

  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  // sphere.material.wireframe = true// 用线框模式大家可以看得清楚是个球体而不是圆形
  scene.add(sphere)
}

function initThree() {
  // 场景
  scene = new THREE.Scene()
  // 镜头
  camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 100)
  // camera.position.set(1, 1, 0.01)
  camera.position.set(0, 0, 0.01)
  // 渲染器
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(width, height)
  container.value.appendChild(renderer.domElement)
  // 镜头控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.enablePan = false
  controls.enableDamping = true
  controls.rotateSpeed = -0.25

  // 加载3d物体
  // addBoxMaterials()
  addSphereMaterials()
}

// 帧同步重绘
function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}

onMounted(() => {
  initThree()
  loop()
})
</script>

<template>
  <div ref="container" b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped>

</style>
