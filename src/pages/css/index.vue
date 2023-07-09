<script setup lang="ts">
import ArrowBtn from '~/pages/css/arrow-btn.vue'
import BfcTest from '~/pages/css/bfc-test.vue'
import BorderAnimate from '~/pages/css/border-animate.vue'
</script>

<template>
  <n-space>
    <BorderAnimate />
    <ArrowBtn />
    <div class="padLockWrapper_p1l06jvx sitesPadlockWrapper_sb60jvh" title="Lock Aspect Ratio" data-testid="padlock">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="70" class="padLockConnector_perhcmw"><path d="M 5.75 22 L 5.75 18.75 C 5.75 17.093 7.093 15.75 8.75 15.75 L 11 15.75" fill="transparent" stroke-width="1.5" stroke="var(--framer-fresco-padLockConnector-color, #dddddd)" stroke-linecap="round" stroke-linejoin="round" /><path d="M 5.75 47.75 L 5.75 51 C 5.75 52.657 7.093 54 8.75 54 L 11 54" fill="transparent" stroke-width="1.5" stroke="var(--framer-fresco-padLockConnector-color, #dddddd)" stroke-linecap="round" stroke-linejoin="round" /></svg><svg xmlns="http://www.w3.org/2000/svg" width="8" height="14"><path d="M 0 7 L 8 7 L 8 10 C 8 11.105 7.105 12 6 12 L 2 12 C 0.895 12 0 11.105 0 10 Z" fill="currentColor" class="lockPath_lzsjdah" /><path d="M 0.75 10 C 0.75 10 0.75 6.897 0.75 6 C 0.75 4.205 2.205 2.75 4 2.75 C 5.795 2.75 7.25 4.205 7.25 6 C 7.25 6.897 7.25 7 7.25 7" fill="transparent" stroke-width="1.5" stroke="currentColor" stroke-linecap="round" class="lockPath_lzsjdah translateUp_tqhwdgo" stroke-dasharray="15.211931228637695" stroke-dashoffset="4" /></svg>
    </div>
  </n-space>
  <BfcTest />
  <!--  <picture> -->
  <!--    <source media="(max-width: 599px)" srcset="/images/eval-fairy/elva-480w-close-portrait.png"> -->
  <!--    <source media="(min-width: 600px)" srcset="/images/eval-fairy/elva-800w.jpg"> -->
  <!--    <img src="/images/eval-fairy/elva-800w.jpg" alt="Chris standing up holding his daughter Elva"> -->
  <!--  </picture> -->
  <img
    srcset="/images/eval-fairy/elva-480w-close-portrait.png 480w, /images/eval-fairy/elva-fairy.png 800w"
    sizes="(max-width: 599px) 180px, 800px"
    src="/images/eval-fairy/elva-480w-close-portrait.png"
    alt="Elva dressed as a fairy"
    loading="lazy"
  >
</template>

<style scoped lang="scss">
</style>
