<script setup lang="ts">
import * as shapefile from 'shapefile'

const emits = defineEmits(['load'])

function loadShapeFile() {
  const geojsonArr = []
  shapefile.open('/map/福州市.shp', '/map/福州市.dbf', {
    encoding: 'utf-8',
  })
    .then((source) => {
      source.read().then(function log(result) {
        if (result.done) {
          // 解析完成
          emits('load', geojsonArr)
          return
        }

        const json = result.value
        geojsonArr.push(json)
        return source.read().then(log)
      })
    })
    .catch((error) => {
      console.error(error.stack)
    })
}
</script>

<template>
  <n-button btn size="small" @click="loadShapeFile">
    加载shapeFile
  </n-button>
</template>

<style scoped lang="scss">

</style>
