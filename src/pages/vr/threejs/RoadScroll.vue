<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  showDefaultLight: true,
  showGUI: true,
  mounted: ({ scene }, THREE) => {
    // 地面 groundGroup
    const groundGroup = new THREE.Group()

    const groundH = 50
    const groundW = 50

    // 马路 roadGroup
    const roadGroup = new THREE.Group()

    const roadPlaneG = new THREE.PlaneGeometry(2, groundH)
    const roadPlaneM = new THREE.MeshStandardMaterial({ color: 0x4C4A4B })
    const roadPlane = new THREE.Mesh(roadPlaneG, roadPlaneM)

    const leftLine = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, groundH),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
    )
    leftLine.position.z = 0.0001
    leftLine.position.x = -0.8

    const rightLine = leftLine.clone()
    leftLine.position.x = 0.8
    // 虚线
    const dashLineGroup = new THREE.Group()
    const dashNum = 100
    for (let i = 0; i < dashNum; i++) {
      const m = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
      const g = new THREE.PlaneGeometry(0.1, 0.3)
      const mesh = new THREE.Mesh(g, m)
      mesh.position.z = 0.0001
      mesh.position.y = -groundH / 2 + 0.5 * i
      dashLineGroup.add(mesh)
    }

    roadGroup.add(roadPlane, leftLine, rightLine, dashLineGroup)

    scene.add(roadGroup)

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
