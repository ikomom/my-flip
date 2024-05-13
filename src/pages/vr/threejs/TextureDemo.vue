<script setup lang="ts">
import { useThreeJs } from '~/pages/vr/threejs/hooks'

const container = ref()
const loaded = ref(0)
const total = ref(0)

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

    const loadManager = new THREE.LoadingManager()
    const loader = new THREE.TextureLoader(loadManager)

    const texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg')
    // texture.colorSpace = THREE.SRGBColorSpace
    const texture2 = loader.load('https://threejs.org/manual/resources/images/compressed-but-large-wood-texture.jpg')
    const fTexture1 = loader.load('https://threejs.org/manual/examples/resources/images/flower-1.jpg')
    const fTexture2 = loader.load('https://threejs.org/manual/examples/resources/images/flower-2.jpg')
    const fTexture3 = loader.load('https://threejs.org/manual/examples/resources/images/flower-3.jpg')
    const fTexture4 = loader.load('https://threejs.org/manual/examples/resources/images/flower-4.jpg')

    // console.log(loadManager.resolveURL('https://threejs.org/manual/examples/resources/images/flower-4.jpg'))
    loadManager.onProgress = (url, _loaded, _total) => {
      console.log(url, _loaded, _total)
      loaded.value = _loaded
      total.value = _total
    }
    loadManager.onLoad = () => {
      const polyObj = {
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 4,
      }

      const lionM = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: texture,
        ...polyObj,
        side: THREE.DoubleSide,
      })
      const gloorM = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: texture2,
        // ...polyObj,
        side: THREE.DoubleSide,
      })
      const fTextureM1 = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: fTexture1,
        ...polyObj,
        side: THREE.DoubleSide,
      })
      const fTextureM2 = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: fTexture2,
        ...polyObj,
        side: THREE.DoubleSide,
      })
      const fTextureM3 = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: fTexture3,
        ...polyObj,
        side: THREE.DoubleSide,
      })
      const fTextureM4 = new THREE.MeshBasicMaterial({
        // color: 0xFF0000,
        map: fTexture4,
        ...polyObj,
        side: THREE.DoubleSide,
      })

      // cube
      const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), [
        fTextureM1.clone(),
        lionM.clone(),
        fTextureM2.clone(),
        lionM.clone(),
        lionM.clone(),
        fTextureM3.clone(),
      ])
      cube.position.y = 0.5
      // cube.position.y = 0.5001
      scene.add(cube)
      // plane
      const planeG = new THREE.PlaneGeometry(4, 4)
      const planM = new THREE.Mesh(planeG, gloorM.clone())
      planM.rotation.x = Math.PI / 2
      scene.add(planM)

      // cone
      const coneGeometry = new THREE.ConeGeometry(1, 2, 8, 1, false, 3, 3)
      const cone = new THREE.Mesh(coneGeometry, [lionM.clone(), gloorM.clone(), fTextureM1.clone()])
      cone.position.set(1.5, 1, 1)
      scene.add(cone)
      // cylin
      const cylin = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 8, 1, false),
        [
          lionM.clone(),
          fTextureM2.clone(),
          fTextureM1.clone(),
        ],
      )
      cylin.position.set(-2, 1, 1)

      scene.add(cylin)
    }

    return ({ time }) => {

    }
  },
})
</script>

<template>
  {{ loaded }} / {{ total }}
  <div ref="container" relative b="1" dark:b="1 #fff" inline-block p-2 />
<!--  <div id="loading"> -->
<!--    <div class="progress"> -->
<!--      <div class="progressbar" /> -->
<!--    </div> -->
<!--  </div> -->
</template>

<style scoped lang="scss">
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  .progress {
    margin: 1.5em;
    border: 1px solid white;
    width: 50vw;
  }
  .progressbar {
    margin: 2px;
    background: white;
    height: 1em;
    transform-origin: top left;
    transform: scaleX(0);
  }
}
</style>
