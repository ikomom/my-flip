<script setup lang="ts">
import type { WatchStopHandle } from 'vue'
import { PreviewProxy } from '~/composables/editor/PreviewProxy'
import PreviewPage from '~/composables/editor/template/Preview.html?raw'
import { exportKey, modulesKey, startProcessFile } from '~/composables/editor/compiler/vueCompiler'
import { MAIN_FILE, useEditorInject } from '~/composables/editor/EditorCore'

const { core, importMap } = useEditorInject()

const previewContainer = ref<HTMLDivElement>()

const runtimeError = ref()
const runtimeWarning = ref()

watch([runtimeError, runtimeWarning], () => {
  core.runtimeErrors = [runtimeError.value, runtimeWarning.value].filter(x => x)
})

let sandbox: HTMLIFrameElement
let proxy: PreviewProxy
let stopUpdateWatcher: WatchStopHandle
/**
 * 更新脚本和视图
 */
async function updateScripts() {
  runtimeError.value = null
  runtimeWarning.value = null
  try {
    const codeArr = startProcessFile(core)
    console.log(`成功编译 ${codeArr.length} 模块.`, codeArr)

    await proxy.eval([
      ...codeArr,
      `import { createApp } from 'vue'
       
       if (window.__app__) {
          window.__app__.unmount()
          document.getElementById('app').innerHTML = ''
        }
      
       const app = window.__app__ = createApp(${modulesKey}["${MAIN_FILE}"])
        app.config.errorHandler = e => console.error(e)
        app.mount('#app')
      `,
    ])
  }
  catch (e: any) {
    runtimeError.value = e.message
  }
}
/**
 * 创建沙盒
 */
function createSandBox() {
  if (sandbox) {
    console.log('destroy old')
    proxy.destroy()
    if (stopUpdateWatcher)
      stopUpdateWatcher()
    previewContainer.value.removeChild(sandbox)
  }
  sandbox = document.createElement('iframe')
  sandbox.width = '100%'
  sandbox.height = '100%'
  const previewHtml = PreviewPage
    .replace('/<!--IMPORT_MAP-->/', importMap.value)
    .replace('/<!--HEADER-SCRIPT-->/', `<script>
        window.${modulesKey} = {}
        window.${exportKey} = (mod, key, get) => {
          Object.defineProperty(mod, key, {
            enumerable: true,
            configurable: true,
            get
          })
        }
       <\/script>`)
  // console.log('previewHtml', previewHtml)
  // sandbox.src = createBlobURL(previewHtml, 'text/html')
  sandbox.srcdoc = previewHtml
  sandbox.setAttribute('sandbox', [
    'allow-forms',
    'allow-modals',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation-by-user-activation',
  ].join(' '))
  previewContainer.value.appendChild(sandbox)
  console.log('sandbox src', { src: sandbox.src, previewHtml })
  proxy = new PreviewProxy(sandbox, {
    onUnhandledRejection(event: any) {
      console.log('unhandledrejection', event)
    },
  })

  sandbox.addEventListener('load', () => {
    console.log(
      'sandbox loaded', sandbox, proxy,
    )
    stopUpdateWatcher = watchEffect(updateScripts)
  })
  sandbox.addEventListener('error', (e) => {
    console.error('sandbox err', e)
  })
}

onMounted(createSandBox)
watch(importMap, () => {
  createSandBox()
})

onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})
</script>

<template>
  <div ref="previewContainer" w-full h-full />
</template>
