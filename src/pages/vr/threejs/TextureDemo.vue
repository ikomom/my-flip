<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  cameraPosition: { x: 0, y: 3, z: 3 },
  mounted: ({ scene }, THREE) => {
  /*  const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1),
      new THREE.MeshBasicMaterial({
        color: 0xFF0000,
      }))
    const mesh0 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({
        color: 0x0000FF,
        polygonOffset: true,
        polygonOffsetFactor: 1.0,
        polygonOffsetUnits: 4.0,
      }))
    scene.add(mesh1)
    scene.add(mesh0) */

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 0.2), 3)
    const helper = new THREE.PlaneHelper(plane, 1, 0xFFFF00)
    scene.add(helper)

    const texture = new THREE.TextureLoader().load('https://threejs.org/manual/examples/resources/images/wall.jpg')
    const texture2 = new THREE.TextureLoader().load('https://threejs.org/manual/resources/images/compressed-but-large-wood-texture.jpg')

    // cube
    const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), new THREE.MeshBasicMaterial({
      // color: 0xFF0000,
      map: texture,
      polygonOffset: true,
      polygonOffsetFactor: 2,
      polygonOffsetUnits: 2,
    }))
    cube.position.y = 0.5
    // cube.position.y = 0.5001
    scene.add(cube)
    // plane
    const planeG = new THREE.PlaneGeometry(4, 4)
    const planM = new THREE.Mesh(planeG, new THREE.MeshBasicMaterial({
      // color: 0x0000FF,
      side: THREE.DoubleSide,
      map: texture2,
    }))
    planM.rotation.x = Math.PI / 2
    scene.add(planM)

    return ({ time }) => {

    }
  },
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
