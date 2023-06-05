/// <reference types="vitest" />

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
  plugins: [
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
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      resolvers: [NaiveUiResolver(), VueUseComponentsResolver()],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
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
  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
