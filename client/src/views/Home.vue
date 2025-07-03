<template>
<<<<<<< HEAD
  <section>
    <section class="bg-gray-700 text-white py-20 px-6 md:px-16 lg:px-24 min-h-screen flex items-center">
      <div class="mx-auto grid md:grid-cols-2 gap-12 items-center">
        <!-- Texte à gauche -->
        <div>
          <h1 class="text-4xl md:text-5xl font-bold py-4 leading-tight">
            Optimisez vos trajets en métro facilement
          </h1>
          <p class="text-base md:text-lg py-5 text-gray-300">
            Bienvenue sur notre application web qui vous aide à trouver le meilleur trajet entre deux stations de métro. En quelques clics, découvrez le chemin le plus rapide et le plus efficace pour vos déplacements.
          </p>
          <div class="flex gap-4 py-4">
            <a href="#path" @click.prevent="scrollToPath" class="bg-white text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-100 transitio">Commencer</a>
          </div>
        </div>

        <!-- Image à droite (image générique pour le wireframe) -->
        <div class="flex justify-center">
          <div class="w-100 h-100 bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
            <span class="text-gray-400">
              <img class="" src="@/assets/TREATED-paris-metro-map.webp" alt="map_metro">
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section de calcul de trajet -->
    <section id="path" class="bg-white text-gray-900 py-20 px-6 md:px-16 lg:px-24 min-h-screen flex items-center">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p class="text-sm font-semibold uppercase pb-2">Rapidité</p>
          <h2 class="text-3xl md:text-4xl font-extrabold pb-6 leading-snug">
            Découvrez nos itinéraires<br />
            optimisés en temps réel
          </h2>
          <p class="text-base text-gray-700 pb-8">
            Notre application utilise des algorithmes avancés pour analyser les données de transport. Grâce aux mises à jour en temps réel, nous vous garantissons des itinéraires rapides et fiables.
          </p>

          <!-- Inputs simulés -->
          <div class="space-y-4 pb-8">
            <div class="flex items-center gap-3">
              <span class="text-xl">🚇</span>
              <input type="text" placeholder="Départ" list="stations" v-model="startStation" class="border-b border-gray-400 flex-1 outline-none py-1" />
              <datalist id = "stations">
                <option v-for = "station in filteredStartStations" :key="station" :value="station"></option>
              </datalist>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xl">⏱️</span>
              <input type="text" placeholder="Heure de départ" class="border-b border-gray-400 flex-1 outline-none py-1" />
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xl">📍</span>
              <input type="text" placeholder="Arrivée" v-model = "endStation" list = "stations-end" class="border-b border-gray-400 flex-1 outline-none py-1" />
              <datalist id = "stations-end">
                <option v-for = "station in filteredEndStations" :key="station" :value="station"></option>
              </datalist>
            </div>
          </div>

          <!-- Bouton -->
          <button @click="getPath" class="border border-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition">
            Calculer mon trajet
          </button>
        </div>

        <!-- Image à droite -->
        <div class="flex justify-center">
          <img src="@/assets/TREATED-paris-metro-map.webp" alt="Illustration trajet" class="w-full h-auto max-w-md rounded-lg shadow-md" />
        </div>
      </div>
    </section>
  </section>
</template>

<script>
=======
  <div class="min-h-screen bg-gradient-to-br from-blue-800 to-purple-700 text-white flex items-center justify-center px-6">
    <div class="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
      
      <!-- TEXTE -->
      <div class="space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
          Trouvez <span class="text-yellow-400">l’itinéraire optimal</span>
          <strong> à tout moment</strong>, vers n’importe quelle destination !
        </h1>
        <p class="text-lg text-gray-200">
          Notre technologie analyse la ville en <strong>temps réel</strong> pour vous proposer le trajet le plus rapide,
          le plus fluide, et le plus intelligent sans perte de temps.
        </p>
        <button @click="scrollToForm"
          class="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-300 transition transform hover:scale-105 duration-300 ease-in-out">
          🚀 Trouver mon itinéraire !
        </button>
      </div>

      <div class="hidden md:block overflow-hidden rounded-2xl shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-105">
          <img src="@/assets/plan.png"
          alt="Navigation map"
          class="w-full" />
      </div>
    </div>
  </div>
  <section ref="formSection" class="min-h-screen bg-gradient-to-br from-blue-800 to-purple-700 text-white flex items-center justify-center px-6">
    <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-gray-800">
      <div class="flex justify-center mb-6 gap-2">
        <button
          @click="activeTab = 'now'"
          :class="activeTab === 'now'
            ? 'bg-gray-300 border-black scale-105'
            : 'bg-white border-black hover:scale-105 hover:bg-gray-100'"
          class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1"
          type="button"
        >
          Partir maintenant
        </button>
        <button
          @click="activeTab = 'depart'"
          :class="activeTab === 'depart' 
            ? 'bg-gray-300 border-black scale-105'
            : 'bg-white border-black hover:scale-105 hover:bg-gray-100'"
          class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1"
          type="button"
        >
          Partir à
        </button>
        <button
          @click="activeTab = 'arrivee'"
          :class="activeTab === 'arrivee' 
            ? 'bg-gray-300 border-black scale-105'
            : 'bg-white border-black hover:scale-105 hover:bg-gray-100'"
          class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1"
          type="button" 
        >
          Arriver à
        </button>
      </div>
      <div 
        class="overflow-hidden ease-in-out"
        :class="activeTab !== '' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
      >
        <form class="space-y-4">
          <div v-show="activeTab === 'now'">
            <div class="mb-4">
              <input type="text" placeholder="Point de départ" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Destination" class="w-full p-2 border rounded" />
            </div>
          </div>
          <div v-show="activeTab === 'depart'">
            <div class="mb-4">
              <input type="text" placeholder="Date de depart" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Heure de depart" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Point de départ" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Destination" class="w-full p-2 border rounded" />
            </div>
          </div>
          <div v-show="activeTab === 'arrivee'">
            <div class="mb-4">
              <input type="text" placeholder="Date de depart" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Heure de depart" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Point de départ" class="w-full p-2 border rounded" />
            </div>
            <div class="mb-4">
              <input type="text" placeholder="Destination" class="w-full p-2 border rounded" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

>>>>>>> f8e4424 (new front)
/*
-- On récupère au chargement de la page la matrice depuis toutes les routes
-- On stock la matrice dans un json ainsi que toutes les stations (faudra faire un taf sur les duplications)
-- On get par input les stations choisis
-- On utilise la matrice pour calculer les chemins les plus court de tous les stop de départ vers tous les stop d'arriver
-- On prend le chemins le plus court parmis cette liste
-- On l'affiche

-- Avantage : 
    - On forme la matrice qu'une seul fois puisqu'après elle est stocké en JSON

-- Inconvénients
    - Beaucoup de calcul de chemin le plus cours à faire
*/
<<<<<<< HEAD


=======
<script setup>
import { ref, nextTick } from 'vue'

const activeTab = ref('now')
const started = ref(false)
const formSection = ref(null)

function scrollToForm() {
  started.value = true
  nextTick(() => {
    formSection.value?.scrollIntoView({ behavior: 'smooth' })
  })
}
</script>

<script>
>>>>>>> f8e4424 (new front)
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      stops: [],
      transfers: [],
      station: []
    };
  },
  methods: {
    async fetchStops() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getStops`);
        this.stops = response.data.stops;
        this.buildStation();
      } catch (error) {
        console.error("Erreur lors de la récupération des stops :", error);
      }
    },

    async fetchTransfers() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getTransfers`);
        this.transfers = response.data.transfers;
      } catch (error) {
        console.error("Erreur lors de la récupération des stops :", error);
      }
    },

    buildStation() {
      for (let i = 0; i < this.stops.length; i++) {
        const stop = this.stops[i];
        if (!this.station.includes(stop.stop_name)) {
          this.station.push(stop.stop_name);
        }
      }
     
    }
  },
  mounted() {
    this.fetchStops();
    this.fetchTransfers();
  },

  computed: {
    filteredStartStations() {
      return this.station;
    },
    filteredEndStations() {
      return this.station;
    }
  }
};

document.get
</script>