<script setup lang="ts">
import {
  Cartesian2,
  Cartesian3,
  Math as CesiumMath,
  Ion, SceneTransforms, Terrain, Viewer, GeoJsonDataSource, HeadingPitchRoll, Transforms,
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import ShapeFile from "~/pages/cesium/ShapeFile.vue";

// @ts-expect-error
window.CESIUM_BASE_URL = '/cesiumStatic'

// Your access token can be found at: https://ion.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiY2Y3NjI1Yy0zOTIzLTRjZDktOTM1Yi05MDRlOWQwY2JiNGMiLCJpZCI6MzUzMTEsImlhdCI6MTYwMTc5Mzg5N30.NYw_Ok48KI4wlQEo3-PPk2wpoLanGGLBArLsZERh_Qk'
let viewer: Viewer

onMounted(async () => {
  // 使用 'cesiumContainer' ID 初始化 HTML 元素中的 Cesium Viewer。
  viewer = new Viewer('cesiumContainer', {
    terrain: Terrain.fromWorldTerrain(),
  })
  const position = Cartesian3.fromDegrees(121, 24, 50000)
  // 在给定的经度、纬度和高度处将相机飞到旧金山。
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: CesiumMath.toRadians(0.0),
      pitch: CesiumMath.toRadians(-90.0),
    },
  })

  const heading = CesiumMath.toRadians(135);
  const pitch = 0;
  const roll = 0;
  const hpr = new HeadingPitchRoll(heading, pitch, roll);
  const orientation =Transforms.headingPitchRollQuaternion(
    position,
    hpr
  );

  const entity = viewer.entities.add({
    name: "Cesium_Air",
    position: position,
    orientation: orientation,
    model: {
      uri: "/map/Cesium_Air.glb",
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
  });
  viewer.trackedEntity = entity;

  // function addDynamicLabel({ position, title = '文本标记', id = 'label-0' }) {
  //   const div = document.createElement('div')
  //   div.id = id
  //   div.style.position = 'absolute'
  //   div.style.width = '100px'
  //   div.style.height = '30px'
  //
  //   const divHTML = `<div style="width:100px;height:30px;background:rgba(255,122,0,0.4)">${title}</div> `
  //   div.innerHTML = divHTML
  //   viewer.cesiumWidget.container.appendChild(div)
  //
  //   const vmPosition = Cartesian3.fromDegrees(
  //     position[0],
  //     position[1],
  //     500,
  //   )
  //   viewer.scene.postRender.addEventListener((e) => {
  //     // console.log('postRender')
  //     const canvasHeight = viewer.scene.canvas.height
  //     const windowPosition = new Cartesian2()
  //     SceneTransforms.wgs84ToWindowCoordinates(
  //       viewer.scene,
  //       vmPosition,
  //       windowPosition,
  //     )
  //     div.style.bottom = `${canvasHeight - windowPosition.y}px`
  //     const elWidth = div.offsetWidth
  //     div.style.left = `${windowPosition.x - elWidth / 2}px`
  //   })
  // }
  // addDynamicLabel({ position: [121, 24] })
  // const wmtsImageryProvider = new WebMapTileServiceImageryProvider({
  //   // url: 'http://localhost:8080/iserver/services/agscachev-Layers/wmts',
  //   url: 'https://api.mapbox.com/v4/mapbox.satellite/11/1719/875.webp?sku=101iWfSXNEtoQ&access_token=pk.eyJ1IjoidHlwZWJyb29rIiwiYSI6ImNqNHVyaTc5dDBuazczMm1jenl3cG8wb3IifQ.2UEZ-jiHgHvYYqVirXhgpw\n',
  //   layer: 'Layers', // 图层名称，如：'tasmania'
  //   style: 'default',
  //   format: 'image/png',
  //   tileMatrixSetID: 'ChinaPublicServices_Layers',
  //   tileMatrixLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
  //   tilingScheme: new GeographicTilingScheme({
  //     numberOfLevelZeroTilesX: 2,
  //     numberOfLevelZeroTilesY: 1,
  //   }),
  // })
  // viewer.imageryLayers.addImageryProvider(wmtsImageryProvider)

  // 添加 Cesium OSM Buildings，这是一个全局 3D 建筑图层。
  // const buildingTileset = await createOsmBuildingsAsync()
  // viewer.scene.primitives.add(buildingTileset)
})
const geoJsonData = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [121.0, 24.0, 999999]
  },
  properties: {
    name: "Null Island",
    population: 4000,
    rainfall: 0.3
  }
};
const onload = result => {
  console.log('load', result)

  // viewer.dataSources.add(GeoJsonDataSource.load(geoJsonData))
  //TODO： 图形会被遮盖的话，需要往坐标最后加个高程值，类似上面的 999999
  viewer.dataSources.add(GeoJsonDataSource.load({
    type: 'FeatureCollection',
    features: result
  }, {
  }))
}
</script>

<template>
  <ShapeFile @load="onload"/>
  <n-divider/>
  <div id="cesiumContainer" />
</template>
