<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  cameraPosition: {
    x: 2,
    y: 2,
    z: 4,
  },
  mounted: ({ scene }, THREE) => {
    // console.log(config.time)
    const material = new THREE.MeshNormalMaterial({
      // wireframe: true,
    })

    // 地面
    const planeG = new THREE.PlaneGeometry(8, 6)
    const planeMesh = new THREE.Mesh(
      planeG,
      new THREE.MeshBasicMaterial({ color: 0xCCCCCC, side: THREE.DoubleSide }),
    )
    planeMesh.rotation.x = Math.PI / 2
    planeMesh.position.y = -0.6
    // 整个汽车
    const car = new THREE.Group()
    // 前轮
    const frontWheels = new THREE.Group()
    // 轮子1
    const wheel1 = new THREE.Group()
    const wheelG = new THREE.TorusGeometry(0.5, 0.1)
    const wheelMesh = new THREE.Mesh(wheelG, material)

    const n = 10
    for (let i = 0; i < n; i++) {
      const g = new THREE.CylinderGeometry(0.02, 0.02, 1)
      const mesh = new THREE.Mesh(g, material)
      mesh.rotation.z = 2 * Math.PI / n * i
      wheel1.add(mesh)
    }
    wheel1.add(wheelMesh)
    // 车轴
    const axleLen = 2
    const axleGeometry = new THREE.CylinderGeometry(0.05, 0.05, axleLen)
    const axleMesh = new THREE.Mesh(axleGeometry, material)
    axleMesh.rotation.x = Math.PI / 2

    wheel1.position.z = axleLen / 2

    // 车轮2
    const wheel2 = wheel1.clone()
    wheel2.position.z = -axleLen / 2

    frontWheels.add(wheel1, wheel2, axleMesh)
    frontWheels.position.y = -1
    // 后轮
    const backWheels = frontWheels.clone()
    backWheels.position.y = 1

    // 车身
    const body = new THREE.Group()
    const cubeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 3.4, 1.3),
      material,
    )
    // 车顶
    const roofMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 1, 3, 1, false, Math.PI, Math.PI),
      material,
    )
    roofMesh.rotation.x = Math.PI / 2

    body.add(cubeMesh, roofMesh)

    car.add(frontWheels, backWheels, body)
    car.rotation.z = Math.PI / 2
    car.rotation.x = -Math.PI

    scene.add(car, planeMesh)

    return ({ time }) => {
      // car.position.y = Math.cos(time.offset)
      car.position.x = -(time.offset % 4 - 2)
      frontWheels.rotation.z = -time.offset
      backWheels.rotation.z = -time.offset
    }
  },
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
