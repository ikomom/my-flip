import path from 'node:path'
import { NaiveUiResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// import legacy from '@vitejs/plugin-legacy'
const cesiumSource = 'node_modules/cesium/Build/Cesium'
const cesiumBaseUrl = 'cesiumStatic'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },
  plugins: [
    // legacy({
    //   targets: ['defaults', 'not IE 11'],
    // }),
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
    vueJsx(),
    VueMacros({
      plugins: {
        vue: Vue({
          reactivityTransform: true,
        }),
      },
    }),
    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      exclude: ['**/modules/**', '**/components/**', '**/layout/**', '**/utils/**'],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: './types/auto-imports.d.ts',
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: './types/components.d.ts',
      resolvers: [NaiveUiResolver(), VueUseComponentsResolver()],
    }),
    vueSetupExtend(),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      hmrTopLevelAwait: false,
    }),
  ],
  build: {
    rollupOptions: {
      external: ['prettier'],
      output: {
        manualChunks: {
          // 分离为一个单独的 chunk
          'monaco-editor': ['monaco-editor'],
          'vue-use': ['@vueuse/core', '@vueuse/components'],
        },
      },
    },
  },
})
