<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

const container = ref<HTMLCanvasElement>()
const view1 = ref<HTMLDivElement>()
const view2 = ref<HTMLDivElement>()

// 场景
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')
// 坐标系
const axes = new THREE.AxesHelper(40)
scene.add(axes)
// 相机1（带辅助线）
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000)
const cameraHelper = new THREE.CameraHelper(camera)
scene.add(cameraHelper)
camera.position.set(0, 10, 30)

// 相机2
const camera2 = new THREE.PerspectiveCamera(
  60, // fov
  2, // aspect
  0.1, // near
  500, // far
)
camera2.position.set(40, 10, 30)
camera2.lookAt(0, 5, 0)

/**
 * resize时重置视图
 * @param renderer
 */
function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    console.log({ cw: canvas.width, ch: canvas.height, width, height })
    renderer.setSize(width, height, false)
  }
  return needResize
}

{
  // 地面
  const planeSize = 40
  const loader = new THREE.TextureLoader()
  const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.colorSpace = THREE.SRGBColorSpace
  const repeats = planeSize / 2
  texture.repeat.set(repeats, repeats)

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(planeGeo, planeMat)
  mesh.rotation.x = Math.PI * -0.5
  scene.add(mesh)
}

{
  // 立方体
  const cubeSize = 4
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
  const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
  const mesh = new THREE.Mesh(cubeGeo, cubeMat)
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
  scene.add(mesh)
}

{
  // 球
  const sphereRadius = 3
  const sphereWidthDivisions = 32
  const sphereHeightDivisions = 16
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
  const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
  const mesh = new THREE.Mesh(sphereGeo, sphereMat)
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
  scene.add(mesh)
}

{
  // 光线
  const color = 0xFFFFFF
  const intensity = 2
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(0, 10, 0)
  scene.add(light)
  // light.target.position.set(10, 0, 10)
  // scene.add(light.target)
  scene.add(new THREE.DirectionalLightHelper(light))

  const alight = new THREE.AmbientLight(color, 0.1)
  scene.add(alight)
}

onMounted(() => {
  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container.value })
  function setScissorForElement(elem: HTMLDivElement) {
    const canvasRect = container.value.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    // 计算canvas的尺寸
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)

    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)

    // 设置剪函数以仅渲染一部分场景
    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    // 返回aspect
    return width / height
  }

  // 控制器1
  const controls = new OrbitControls(camera, view1.value)
  controls.target.set(0, 5, 0)
  controls.update()
  // 控制器2
  const controls2 = new OrbitControls(camera2, view2.value)
  controls2.target.set(0, 5, 0)
  controls2.update();

  (function render() {
    resizeRendererToDisplaySize(renderer)

    renderer.setScissorTest(true)
    // 渲染原始相机
    {
      const aspect = setScissorForElement(view1.value)
      // 更新相机 比例
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()

      // 不要在原始视图中绘制相机助手
      cameraHelper.visible = false

      scene.background = new THREE.Color(0x000000)

      // render
      renderer.render(scene, camera)
    }
    // 渲染第二个相机
    {
      const aspect = setScissorForElement(view2.value)

      // 为此调整相机
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()

      // 在第2个视图中绘制相机助手
      cameraHelper.visible = true

      scene.background = new THREE.Color(0x000040)

      renderer.render(scene, camera2)
    }

    requestAnimationFrame(render)
  })()
})
</script>

<template>
  <div class="box">
    <canvas ref="container" />
    <div class="split">
      <div ref="view1" tabindex="1" b-1 />
      <div ref="view2" tabindex="2" b-1 />
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  position: relative;
  canvas {
    width: 100%;
    height: 400px;
  }
  .split {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    & > div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
