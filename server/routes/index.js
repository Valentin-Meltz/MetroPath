const { Stop } = require('../models/Stop');
const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.get('/buildGraph', async (req, res) => {
  try {
    const stops = await Stop.findAll();
    const graph = {};

    stops.forEach(stop => {
      graph[stop.stop_id] = []; // initialise chaque sommet sans arêtes
    });

    res.json({ message: 'Graph initialized with stops as vertices.', graph });
  } catch (error) {
    console.error('Erreur lors de la création du graphe :', error);
    res.status(500).json({ error: 'Erreur lors de la création du graphe.' });
  }
});

router.get('/stops', async (req, res) => {
  try {
    const stops = await Stop.findAll();
    res.json(stops);
  } catch (error) {
    console.error('Erreur lors de la récupération des stops :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des stops.' });
  }
});

module.exports = router;