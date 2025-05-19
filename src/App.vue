<script setup lang="ts">
import { darkTheme, lightTheme, zhCN } from 'naive-ui'
import { TheImageContainer } from '~/composables/image'

const theme = computed(() => isDark.value ? darkTheme : lightTheme)
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
    <n-message-provider>
      <the-nav />
      <main font-sans p="x-4 y-10" text="gray-700 dark:gray-200">
        <router-view v-slot="{ Component }">
          <template v-if="Component">
            <Transition mode="out-in">
              <Suspense>
                <div><component :is="Component" /></div>
                <template #fallback>
                  <div text-center op-99>
                    加载中。。。
                  </div>
                </template>
              </Suspense>
            </Transition>
          </template>
        </router-view>
        <TheImageContainer />
        <Footer />
      </main>
    </n-message-provider>
  </n-config-provider>
</template>
