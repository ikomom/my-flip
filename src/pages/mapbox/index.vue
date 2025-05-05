<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css'

import mapboxgl from 'mapbox-gl' // or "const mapboxgl = require('mapbox-gl');"
import nycBike from './nyc-bike-parking-shelters.json'

mapboxgl.accessToken = 'pk.eyJ1IjoiaWtvbm9uMTExMSIsImEiOiJja2ZwNzF5NjUwODdyMnJzOWY3bDR3ejBnIn0.cX1bN-Mf-pSyG0tdWQe_ZA'

onMounted(() => {
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    // style: 'mapbox://styles/ikonon1111/ckfp7511c08vp19qvkave3bw7', // style URL
    center: [-73.98109555019138, 40.68985092532933], // starting position [lng, lat]
    zoom: 8, // starting zoom
    config: {
      // basemap: {
      //   lightPreset: 'dusk',
      //   showPointOfInterestLabels: false,
      // },
    },
  })

  map.on('style.load', () => {
    // map.addSource('openstreetmap', {
    //   type: 'raster',
    //   tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    //   tileSize: 256,
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // })

    map.addSource('dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    })
    // map.addLayer({
    //   id: 'maine',
    //   type: 'fill',
    //   source: 'maine',
    //   paint: {
    //     'fill-color': '#0080ff',
    //     'fill-opacity': 0.5,
    //   },
    // })

    map.addSource('nyc-bike', {
      type: 'geojson',
      data: nycBike as any,
    })

    console.log(map, map.getSource('nyc-bike'))

    map.addLayer({
      id: 'test-nyc',
      source: 'nyc-bike',
      type: 'circle',
      // filter: ['==', 'location', 'Grahan Ave & Metropolitan Ave'],
      paint: {
        'circle-radius': 6,
        'circle-color': '#FF0000',
      },
    })
  })
})
</script>

<template>
  <div id="map" style="height: 400px" />
</template>

<style scoped lang="scss">

</style>
