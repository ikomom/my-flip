<script setup lang="ts">
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import type { Object3D } from 'three/src/core/Object3D'
import { useThreeJs } from '~/pages/vr/threejs/hooks'
import gltfPath from '~/assets/three/obj/cartoon_city/scene.gltf?url'

const container = ref()
function dumpObject(obj: Object3D<any>, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─'
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
  const newPrefix = prefix + (isLast ? '  ' : '│ ')
  const lastNdx = obj.children.length - 1
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx
    dumpObject(child, lines, isLast, newPrefix)
  })
  return lines
}
useThreeJs(container, {
  width: 1300,
  height: 400,
  showDefaultLight: true,
  showGUI: true,
  maxFar: 5000,
  cameraPosition: { x: 1000, y: 1000, z: 1000 },
  mounted: ({ scene, camera }, THREE) => {
    // camera.lookAt(1000, 1000, 1000)
    const loader = new GLTFLoader()
    const cars = []
    loader.load(gltfPath, (gltf) => {
      const root = gltf.scene
      scene.add(root)
      console.log({ gltf })
      // console.log(dumpObject(root).join('\n'))
      const loadedCars = root.getObjectByName('Cars')
      console.log(loadedCars)
      const fixes = [
        { prefix: 'Car_08', rot: [Math.PI * 0.5, 0, Math.PI * 0.5] },
        { prefix: 'CAR_03', rot: [0, Math.PI, 0] },
        { prefix: 'Car_04', rot: [0, Math.PI, 0] },
      ]
      root.updateMatrixWorld()
      for (const car of loadedCars.children.slice()) {
        const fix = fixes.find(fix => car.name.startsWith(fix.prefix))
        const obj = new THREE.Object3D()
        car.getWorldPosition(obj.position)
        car.position.set(0, 0, 0)
        car.rotation.set(...fix.rot)
        obj.add(car)
        scene.add(obj)
        cars.push(obj)
      }
    })

    return ({ time }) => {
      if (cars) {
        for (const car of cars)
          car.rotation.y = time.offset
      }
    }
  },
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
