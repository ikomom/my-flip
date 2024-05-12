<script setup lang="ts">
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { useThreeJs } from '~/pages/vr/threejs/hooks'
import carPath from '~/assets/three/obj/BMW850/BMW850.obj?url'
import mtlPath from '~/assets/three/obj/BMW850/BMW850.mtl?url'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  showDefaultLight: true,
  showGUI: true,
  mounted: ({ scene }, THREE) => {
    const mtlLoader = new MTLLoader()

    mtlLoader.load(mtlPath, (materials) => {
      materials.preload()
      console.log({ materials })
      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials)
      objLoader.load(carPath, (obj) => {
        console.log({ obj })
        // obj.up = new THREE.Vector3(0, 1, 0)
        obj.position.set(10, 10, -100)
        scene.add(obj)
      })
    })

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
