<template>
  <LMap :zoom="zoom" :center="center" style="height: 500px; width: 100%;">
    <LTileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    <LMarker
      v-for="(point, index) in props.points"
      :key="index"
      :lat-lng="[point.lat, point.lng]"
    />
  </LMap>
</template>

<script setup>
import { ref } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  points: {
    type: Array,
    required: true
  }
});

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const zoom = ref(5);
const center = ref([48.8566, 2.3522]); // Exemple : Paris
</script>