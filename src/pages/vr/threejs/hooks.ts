import type { PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as THREE from 'three'
import type { MaybeRef } from '@vueuse/core'
import { onBeforeUnmount } from 'vue'
import * as dat from 'dat.gui'
import type { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import MinMaxGUIHelper from '~/pages/vr/threejs/helper/MinMaxGUIHelper'

interface Props {
  width: number
  height: number
  showGUI: MaybeRef<boolean>
  showDefaultLight: MaybeRef<boolean>
  cameraPosition?: Partial<{ x: number; y: number; z: number }>
  mounted: (config: RenderConfig, three: typeof THREE) => (config: RenderConfig) => void
  unmounted: (config: RenderConfig, three: typeof THREE) => void
}
interface RenderConfig {
  time: {
    offset: number
    deltaTime: number
  }
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  gui: dat.GUI
}

const defaultProps: Props = {
  width: 1300,
  height: 400,
  showGUI: false,
  showDefaultLight: false,
  mounted: () => () => {
  },
  unmounted: () => {},
}
let id = 0
function createAndAppendDom() {
  const el = document.createElement('div')
  el.id = `appended-canvas-${++id}`
  document.body.appendChild(el)
  onBeforeUnmount(() => {
    document.body.removeChild(el)
  })
  return el
}
// cube.rotation.z = 45 / 180 * Math.PI // 角度转弧度公式，欧拉角
export function useThreeJs(ref: MaybeRef<HTMLElement>, props?: Partial<Props>) {
  let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls, stats: Stats

  const gui = new dat.GUI()

  const config = { ...defaultProps, ...props }
  let animateNumber: number

  watch(() => config.showGUI, (value) => {
    value ? gui.show() : gui.hide()
  }, {
    immediate: true,
  })

  function updateCamera() {
    camera.updateProjectionMatrix()
  }

  onMounted(() => {
    const dom = unref(ref)
      ? unref(ref)
      : createAndAppendDom()
    console.log('dom', dom)
    scene = new THREE.Scene()
    // 镜头
    // x: r(red), y: g(green), z: b(blue)
    camera = new THREE.PerspectiveCamera(75, config.width / config.height, 0.1, 1000)
    camera.lookAt(0, 0, 0)
    const { cameraPosition = {} } = config
    camera.position.set(cameraPosition.x ?? 0, cameraPosition.y ?? 0, cameraPosition.z ?? 2)
    const cameraFolder = gui.addFolder('camera')
    cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera)
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
    cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera)
    cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera)
    cameraFolder.open()
    // 灯光
    const light = new THREE.DirectionalLight(0xFFFFFF)// 平行光
    light.position.set(2, 2, 2)
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.2)// 环境光
    const lightFolder = gui.addFolder('灯光')
    lightFolder.add(light.position, 'x', -5, 5).name('灯光位置x')
    lightFolder.add(light.position, 'y', -5, 5).name('灯光位置y')
    lightFolder.add(light.position, 'z', -5, 5).name('灯光位置z')
    lightFolder.add(ambient, 'intensity', 0, 1).name('环境光照的强度')
    lightFolder.open()
    watch(() => config.showDefaultLight, (value) => {
      if (value) {
        scene.add(ambient, light)
        lightFolder.show()
      }
      else {
        scene.remove(ambient, light)
        lightFolder.hide()
      }
    }, {
      immediate: true,
    })

    // 坐标系
    const axes = new THREE.AxesHelper(4)
    scene.add(axes)
    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(config.width, config.height)

    dom.appendChild(renderer.domElement)

    // fps
    stats = new Stats()
    // stats.dom.style.position = 'absolute'
    dom.appendChild(stats.dom)
    // 镜头控制
    controls = new OrbitControls(camera, renderer.domElement)

    const render = config.mounted({ time: { deltaTime: 0, offset: 0 }, camera, gui, renderer, scene }, THREE)

    const clock = new THREE.Clock()
    function tick() {
      const time = {
        offset: clock.getElapsedTime(),
        deltaTime: clock.getDelta(),
      }
      render({ time, gui, camera, renderer, scene })
      // 渲染
      renderer.render(scene, camera)
      stats.update()
      // controls.update()
      animateNumber = requestAnimationFrame(tick)
    }

    tick()

    onBeforeUnmount(() => {
      gui.destroy()
      config.unmounted({
        time: {
          offset: clock.getElapsedTime(),
          deltaTime: clock.getDelta(),
        },
        gui,
        camera,
        renderer,
        scene,
      }, THREE)
    })
  })

  onBeforeUpdate(() => {
    console.warn('update')
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(animateNumber)
  })
}
