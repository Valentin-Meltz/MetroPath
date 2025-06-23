<template>
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
          <button class="bg-white text-gray-900 px-6 py-2 rounded shadow hover:bg-gray-100 transitio">
            Commencer
          </button>
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
  <section class="bg-white text-gray-900 py-20 px-6 md:px-16 lg:px-24">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
      <!-- Texte à gauche -->
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
            <input type="text" placeholder="Départ" class="border-b border-gray-400 flex-1 outline-none py-1" />
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⏱️</span>
            <input type="text" placeholder="Heure de départ" class="border-b border-gray-400 flex-1 outline-none py-1" />
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">📍</span>
            <input type="text" placeholder="Arrivée" class="border-b border-gray-400 flex-1 outline-none py-1" />
          </div>
        </div>

        <!-- Bouton -->
        <button class="border border-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition">
          Calculer mon trajet
        </button>
      </div>

      <!-- Image à droite -->
      <div class="flex justify-center">
        <img src="" alt="Illustration trajet" class="w-full h-auto max-w-md rounded-lg shadow-md" />
      </div>
    </div>
  </section>
</template>