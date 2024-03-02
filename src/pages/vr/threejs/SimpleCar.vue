<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()

useThreeJs(container, {
  width: 1300,
  height: 400,
  mounted: ({ scene }, THREE) => {
    // console.log(config.time)
    const material = new THREE.MeshNormalMaterial({
      wireframe: true,
    })

    // 整个汽车
    const car = new THREE.Group()
    // 车身
    const carBody = new THREE.Group()
    const bodyCube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 0.5, 1, 1, 1),
      material,
    )
    const bodyCube2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial(),
    )
    bodyCube2.position.z = 0.5

    carBody.add(bodyCube1)
    carBody.add(bodyCube2)

    car.add(carBody)

    // 轮子1
    const wheelGroup1 = new THREE.Group()
    const wheel1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.7, 0.7),
      material,
    )
    wheelGroup1.position.set(-0.65, 0.6, 0)
    wheelGroup1.add(wheel1)
    car.add(wheelGroup1)

    // 轮胎
    const n = 20
    const r = 0.5 // 半径
    const circle = new THREE.Group()
    for (let i = 0; i < n; i++) {
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.2)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = r * Math.cos(Math.PI * 2 / n * i)
      mesh.position.y = r * Math.sin(Math.PI * 2 / n * i)
      circle.add(mesh)
    }
    circle.rotation.y = 0.5 * Math.PI
    // 添加
    wheelGroup1.add(circle)
    // 轮子2
    const wheelGroup2 = wheelGroup1.clone()
    wheelGroup2.position.y = -wheelGroup2.position.y
    car.add(wheelGroup2)

    // 轮子3
    const wheelGroup3 = wheelGroup1.clone()
    wheelGroup3.position.x = -wheelGroup3.position.x
    car.add(wheelGroup3)

    // 轮子4
    const wheelGroup4 = wheelGroup1.clone()
    wheelGroup4.position.x = -wheelGroup4.position.x
    wheelGroup4.position.y = -wheelGroup4.position.y
    car.add(wheelGroup4)

    scene.add(car)

    return ({ time }) => {
      // car.position.y = Math.cos(time.offset)
      // car.position.y = time.offset % 4 - 2

      wheelGroup1.rotation.x = -time.offset
      wheelGroup2.rotation.x = -time.offset
      wheelGroup3.rotation.x = -time.offset
      wheelGroup4.rotation.x = -time.offset
    }
  },
})
</script>

<template>
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
</template>

<style scoped lang="scss">

</style>
