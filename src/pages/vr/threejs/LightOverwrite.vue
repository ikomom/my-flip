<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref<HTMLCanvasElement>()
const width = 1300
const height = 400

useThreeJs(container, {

  cameraPosition: {
    x: 2,
    y: 2,
    z: 6,
  },
  showGUI: true,
  mounted: ({ scene, renderer, gui, camera }, THREE) => {
    // camera.rotation.y = Math.PI / 3

    // Plane
    const planeM = new THREE.MeshPhongMaterial({ color: 0xCCCCCC })
    const planeG = new THREE.PlaneGeometry(10, 10)
    const plane = new THREE.Mesh(planeG, planeM)
    plane.rotation.x = -0.5 * Math.PI
    plane.receiveShadow = true
    scene.add(plane)

    // Sphere
    const material = new THREE.MeshStandardMaterial({ color: 0xFF00FF })
    const sphereG = new THREE.SphereGeometry(0.5)
    const sphere = new THREE.Mesh(sphereG, material)
    sphere.position.y = 0.5
    sphere.castShadow = true
    scene.add(sphere)

    // light
    const light = new THREE.SpotLight(0xFFFFFF)
    light.position.set(2, 2, 2)
    light.castShadow = true
    // light.shadow.mapSize
    light.angle = Math.PI / 6
    const opt = {
      angle: 60,
    }
    gui.add(opt, 'angle', 0, 360).onChange((value) => {
      light.angle = value / 180 * Math.PI
    })
    gui.add(light.position, 'x', -5, 5).name('灯光位置x')
    gui.add(light.position, 'y', -5, 5).name('灯光位置y')
    gui.add(light.position, 'z', -5, 5).name('灯光位置z')
    // scene.add(new THREE.SpotLightHelper(light))

    // scene.add(new THREE.AmbientLight(0xFFFFFF, 0.2))
    // scene.add(light)
    renderer.shadowMap.enabled = true

    // hemisphereLight skyColor groundColor
    const hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0x33FF00)
    scene.add(hemisphereLight)
    scene.add(new THREE.HemisphereLightHelper(hemisphereLight, 5))

    /* useEventListener('mousemove', (e) => {
      const cx = e.clientX - container.value.offsetLeft - 8
      const cy = e.clientY - container.value.offsetTop - 8
      if (
        (cx >= 0 && cx <= width)
        && (cy >= 0 && cy <= height)
      ) {
        const mousePosX = (cx / width - 0.5) * 2
        const mousePosY = Math.min(1 / ((cy / height)) - 1, 10)
        console.log(cx, cy, { mousePosX, mousePosY })
        camera.position.x = -mousePosX
        camera.position.y = mousePosY
      }
    })
*/
    return ({ time }) => {
      sphere.position.y = Math.sin(time.offset) + 1.5
    }
  },
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
