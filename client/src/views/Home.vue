<template>
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


import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      stops: [],
      station: [],
      transfers: [],
      lines: [],
      matrice: [],
      transitions: []
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
        this.buildTransfersTransition();
        return true;
        //console.log("Transition :", this.transitions)
      } catch (error) {
        console.error("Erreur lors de la récupération des stops :", error);
      }
    },

    async fetchLines() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getLines`);
        this.lines = response.data.trips;
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

    buildTransfersTransition(){
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

    buildLinesTransition(){
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
    }
  },
  async mounted() {
    this.fetchStops();
    const transfersReady = await this.fetchTransfers();
    if (transfersReady) {
      await this.fetchLines(); // cela appellera ensuite buildGraph automatiquement
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