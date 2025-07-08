<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-800 to-purple-700 text-white flex items-center justify-center px-6">
    <div class="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
      <div class="space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold leading-tight">
          Trouvez <span class="text-yellow-400">l’itinéraire optimal</span><strong> à tout moment</strong>, vers n’importe quelle destination !
        </h1>
        <p class="text-lg text-gray-200">
          Notre technologie analyse la ville en <strong>temps réel</strong> pour vous proposer le trajet le plus rapide,
          le plus fluide, et le plus intelligent sans perte de temps.
        </p>
        <button @click="scrollToForm" class="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-300 transition transform hover:scale-105 duration-300 ease-in-out">
          🚀 Trouver mon itinéraire !
        </button>
      </div>

      <div class="hidden md:block overflow-hidden rounded-2xl shadow-xl transform transition-transform duration-300 ease-in-out hover:scale-105">
          <img src="@/assets/plan.png" alt="Navigation map" class="w-full"/>
      </div>
    </div>
  </div>
  <section ref="formSection" class="min-h-screen bg-gradient-to-tr from-blue-800 to-purple-700 text-white flex  items-center justify-center px-6">
    <div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md text-gray-800">
      <div class="flex justify-center mb-6 gap-2">
        <button @click="activeTab = 'now'" :class="activeTab === 'now' ? 'bg-gray-300 border-black scale-105' : 'bg-white border-black hover:scale-105 hover:bg-gray-100'" class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1" type="button">
          Partir maintenant
        </button>
        <button @click="activeTab = 'depart'" :class="activeTab === 'depart'  ? 'bg-gray-300 border-black scale-105' : 'bg-white border-black hover:scale-105 hover:bg-gray-100'" class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1" type="button">
          Partir à
        </button>
        <button @click="activeTab = 'arrivee'" :class="activeTab === 'arrivee'  ? 'bg-gray-300 border-black scale-105' : 'bg-white border-black hover:scale-105 hover:bg-gray-100'" class="flex-1 py-2 px-6 rounded-lg transition transform border whitespace-nowrap mx-1" type="button">
          Arriver à
        </button>
      </div>

      <div class="overflow-hidden ease-in-out" :class="activeTab !== '' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
        <form class="space-y-2">
          <div v-show="activeTab === 'now'">
            <div class="mb-4">
              <select v-model="selectedStart" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Point de départ</option>
                <option v-for="station in filteredStartStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <select v-model="selectedEnd" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Destination</option>
                <option v-for="station in filteredEndStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
          </div>

          <div v-show="activeTab === 'depart'">
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Date de départ</label>
              <input type="date" class="w-full p-2 border rounded" v-model="departureDate" :min="minDate" :max="maxDate"/>
            </div>
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Heure de départ</label>
              <div class="flex gap-2">
                <select v-model="departureHour" class="w-1/2 p-2 border rounded">
                  <option v-for="h in 24" :key="h" :value="String(h-1).padStart(2, '0')">
                    {{ String(h-1).padStart(2, '0') }}
                  </option>
                </select>
                <span>:</span>
                <select v-model="departureMinute" class="w-1/2 p-2 border rounded">
                  <option v-for="m in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="m" :value="String(m).padStart(2, '0')">
                    {{ String(m).padStart(2, '0') }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <select v-model="selectedStart" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Point de départ</option>
                <option v-for="station in filteredStartStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <select v-model="selectedEnd" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Destination</option>
                <option v-for="station in filteredEndStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
          </div>

          <div v-show="activeTab === 'arrivee'">
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Date d'arriver</label>
              <input type="date" class="w-full p-2 border rounded" v-model="arrivalDate" :min="minDate" :max="maxDate"/>
            </div>
            <div class="mb-4">
              <label class="block mb-1 text-sm font-medium">Heure d'arriver</label>
              <div class="flex gap-2">
                <select v-model="arrivalHour" class="w-1/2 p-2 border rounded">
                  <option v-for="h in 24" :key="h" :value="String(h).padStart(2, '0')">
                    {{ String(h).padStart(2, '0') }}
                  </option>
                </select>
                <span>:</span>
                <select v-model="arrivalMinute" class="w-1/2 p-2 border rounded">
                  <option v-for="m in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="m" :value="String(m).padStart(2, '0')">
                    {{ String(m).padStart(2, '0') }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <select v-model="selectedStart" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Point de départ</option>
                <option v-for="station in filteredStartStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <select v-model="selectedEnd" class="w-full p-2 border rounded">
                <option value="" disabled selected hidden>Destination</option>
                <option v-for="station in filteredEndStations" :key="station" :value="station">
                  {{ station }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex justify-center mt-2">
            <div @click="getPath" class="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-300 hover:cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out">
              🚀 Trouver mon itinéraire !
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
  <section class="min-h-screen bg-gradient-to-br from-blue-800 to-purple-700 text-white flex  items-center justify-center px-6">
    <div class="w-full max-w-4xl h-[500px] overflow-hidden shadow">
      <MapView :points="mapPoints" />
    </div>
  </section>
</template>

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
import axios from 'axios';
import MapView from '@/components/MapView.vue';

export default {
  name: 'Home',
  components: {
    MapView,
  },
  data() {
    return {
      /* Data pour le graphe */
      stops: [],
      station: [],
      transfers: [],
      lines: [],
      matrice: [],
      transitions: [],

      /* Data pour le front */
      minDate: "2023-12-31",
      maxDate: "2024-12-31",
      // Initialisation des dates et heures
      departureDate: new Date().toISOString().slice(0, 10),
      arrivalDate: new Date().toISOString().slice(0, 10),
      // Initialisation correcte des heures/minutes actuelles
      departureHour: String(new Date().getHours()).padStart(2, '0'),
      departureMinute: String(new Date().getMinutes()).padStart(2, '0'),

      selectedStart: '',
      selectedEnd: '',
      
      /* Points à afficher sur la carte */
      mapPoints: [],
    };
  },
  methods: {
    async fetchStops() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/stops`);
        this.stops = response.data;
        this.buildStation();
      } catch (error) {
        console.error("Erreur lors de la récupération des stops :", error);
      }
    },

    async fetchTransfers() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/transfers`);
        this.transfers = response.data;
        this.buildTransfersTransition();
        return true;
        //console.log("Transition :", this.transitions)
      } catch (error) {
        console.error("Erreur lors de la récupération des stops :", error);
      }
    },

    async fetchLines() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/lines`);
        this.lines = response.data;
        this.buildLinesTransition();

        // Appeler buildGraph ici, car transfers et lines sont maintenant chargés
        this.buildGraph();
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
      this.station.sort();
    },

    async getPath(){
      // Récupérer les IDs des stations sélectionnées à partir de leurs noms
      const startStation = this.stops.find(s => s.stop_name === this.selectedStart);
      const endStation = this.stops.find(s => s.stop_name === this.selectedEnd);

      if (!startStation || !endStation) {
        console.error("Station de départ ou d'arrivée introuvable.");
        return;
      }

      const startId = startStation.stop_id;
      const endId = endStation.stop_id;

      console.log("Départ :", startId, "Destination :", endId);

      console.log("Date :", this.departureDate, "Heure :", this.departureHour, ":", this.departureMinute);

      var date, time;
      date = this.departureDate;
      const h = this.departureHour;
      const m = this.departureMinute;
      time = `${h}:${m}:00`;
      console.log("Départ à :", time);

      if (!date || !time || !startId || !endId) {
        console.error("Champs requis manquants :", { date, time, startId, endId });
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/shorter-path`, {
          params: {
            from: startId,
            to: endId,
            date: date,
            time: time
          }
        });
        // Traite la réponse ici (par exemple, afficher le chemin sur la carte)
        console.log('Itinéraire reçu:', response.data);
        this.path = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'itinéraire :", error);
      }
    },

    buildGraph(){
      // Construction d'une map pour accès rapide aux coûts
      const costMap = new Map();

      for (const t of this.transitions) {
        const key1 = `${t.from_stop_id}-${t.to_stop_id}`;
        const key2 = `${t.to_stop_id}-${t.from_stop_id}`;
        costMap.set(key1, t.cost);
        costMap.set(key2, t.cost); // Graphe non orienté
      }

      this.matrice = [];

      for (let i = 0; i < this.stops.length; i++) {
        const row = [];
        const stop1 = this.stops[i].stop_id;

        for (let j = 0; j < this.stops.length; j++) {
          const stop2 = this.stops[j].stop_id;
          const cost = costMap.get(`${stop1}-${stop2}`) || 0;
          row.push(cost);
        }

        this.matrice.push(row);
      }
    },

    buildTransfersTransition() {
      // On parcourt notre liste de transfers
      for (let i = 0; i < this.transfers.length; i++){
        //On crée un objet et on l'ajoute à notre liste de transitions
        let transition = {
          from_stop_id: this.transfers[i].from_stop_id,
          to_stop_id: this.transfers[i].to_stop_id,
          cost: parseInt(this.transfers[i].min_transfer_time, 10)
        }
        this.transitions.push(transition);
      }
    },

    buildLinesTransition() {
      const timeStringToSeconds = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };

      // On crée notre dictionnaire
      var newTrips = new Map();
      for (let i = 0; i < this.lines.length; i++){
        if (!newTrips.has(this.lines[i].trip_id)){
          newTrips.set(this.lines[i].trip_id, []);
        }
        newTrips.get(this.lines[i].trip_id).push(this.lines[i]);
      }

      // On trie notre dictionnaire
      for (var [key, value] of newTrips) {
        value.sort((a, b) => a.stop_sequence - b.stop_sequence);
      }

      // On rempli les transitions
      for (var [key, value] of newTrips){
        for (let i = 0; i < (value.length - 1); i++){
          const departure = timeStringToSeconds(value[i].departure_time);
          const arrival = timeStringToSeconds(value[i+1].arrival_time);
          const cost = arrival - departure;

          let transition = {
            from_stop_id: value[i].stop_id,
            to_stop_id: value[i+1].stop_id,
            cost: cost
          };
          this.transitions.push(transition);
        }
      }
    },
  },
  async mounted() {
    this.fetchStops();
    const transfersReady = await this.fetchTransfers();
    if (transfersReady) {
      await this.fetchLines(); // cela appellera ensuite buildGraph automatiquement
    }
    // Ajout temporaire de points pour la carte
    this.mapPoints = [
      { lat: 48.8566, lng: 2.3522 },
      { lat: 48.8738, lng: 2.2950 },
      { lat: 48.8584, lng: 2.2945 }
    ];

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/max-date`);
      this.maxDate = response.data.maxDate;
    } catch (err) {
      console.error("Erreur lors de la récupération de la date max :", err);
    }
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