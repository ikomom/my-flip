<script setup lang="ts">
import { pick } from 'lodash-es'
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  showGUI: true,
  cameraPosition: {
    x: 1,
    y: 1,
    z: 2,
  },
  mounted: ({ scene, gui }, THREE) => {
    type guiItem =
      typeof THREE.MeshBasicMaterial
      | typeof THREE.MeshNormalMaterial
      | typeof THREE.MeshLambertMaterial
      | typeof THREE.MeshPhongMaterial
    type guiItemSource =
      THREE.MeshBasicMaterial
      | THREE.MeshNormalMaterial
      | THREE.MeshLambertMaterial
      | THREE.MeshPhongMaterial

    const guiOpt = {
      material: 'standard',
      wireframe: false,
      flatShading: false,
      visible: true,
      color: 0xFF00FF,
      shininess: 50,
      metalness: 1,
      roughness: 0.8,
    }

    const guiMap: Record<string, guiItem> = {
      basic: THREE.MeshBasicMaterial,
      normal: THREE.MeshNormalMaterial,
      // 需要灯光==start
      lambert: THREE.MeshLambertMaterial,
      phong: THREE.MeshPhongMaterial, // 比起lambert添加了镜面高光
      standard: THREE.MeshStandardMaterial,
      // 需要灯光==end
    }

    const sphereGeometry = new THREE.SphereGeometry(0.5)
    const material = new guiMap[guiOpt.material]()

    const mesh = new THREE.Mesh<THREE.SphereGeometry, guiItemSource>(sphereGeometry, material)
    const handleChangeValue = (value: KeyOf<typeof guiMap>) => {
      const MaterialCon = guiMap[value]
      mesh.material = new MaterialCon(pick(guiOpt, ['color', 'wireframe', 'flatShading', 'shininess', 'roughness', 'metalness']))
    }
    handleChangeValue(guiOpt.material)

    const folder = gui.addFolder('材质')

    folder.add(guiOpt, 'material', Object.keys(guiMap)).onChange((value) => {
      handleChangeValue(value)
    })

    folder.add(guiOpt, 'visible').onChange((value) => {
      mesh.visible = value
    })
    folder.addColor(guiOpt, 'color').onChange((value) => {
      mesh.material.setValues({ color: new THREE.Color(value) })
    })
    folder.add(guiOpt, 'wireframe').onChange((value) => {
      mesh.material.wireframe = value
    })

    folder.add(guiOpt, 'flatShading').onChange(() => {
      handleChangeValue(guiOpt.material)
    })
    folder.open()
    scene.add(mesh)

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
