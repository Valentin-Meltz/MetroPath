import * as model from '../models/version2M.js';

export async function getStops(req, res) {
    try {
        const stops = await model.getStops();
        console.log("\n - (controllers) Arrêts récupérés :", stops.length);
        res.status(200).json(stops);
    } catch (error) {
        console.error("Erreur lors de la récupération des arrêts :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

export async function getTransfers(req, res) {
    try {
        const transfers = await model.getTransfers();
        console.log("\n - (controllers) Transferts récupérés :", transfers.length);
        res.status(200).json(transfers);
    } catch (error) {
        console.error("Erreur lors de la récupération des transferts :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

export async function getLines(req, res) {
    try {
        const lines = await model.getLines();
        console.log("\n - (controllers) Lignes récupérées :", lines.length);
        res.status(200).json(lines);
    } catch (error) {
        console.error("Erreur lors de la récupération des lignes :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
}

export async function maxDate(req, res) {
  try {
    const date = await model.maxDate();
    res.status(200).json({ maxDate: date });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

export async function shorterPath(req, res) {
  const { from, to, date, time } = req.query;
  try {
    const timeGraph = await getTimeGraph(date, time);
    if (!timeGraph || !timeGraph.graph) {
      return res.status(500).json({ error: "Erreur lors de la génération du graphe" });
    }
    const path = model.findFastestPath(timeGraph.graph, from, to, time);

    if (!path) {
      return res.status(404).json({ message: "Aucun chemin trouvé" });
    }

    res.status(200).json(path);
  } catch (err) {
    console.error("Erreur de calcul du plus court chemin :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

async function getTimeGraph(date, time) {
    try {
        // 1. Récupérer les arêtes pour la date
        const [intraEdges, transferEdges] = await Promise.all([
            model.getIntraTripEdgesForDate(date),
            model.getTransferEdges()
        ]);

        const allEdges = [...intraEdges, ...transferEdges];

        // 2. Convertir l’heure de départ en secondes
        const [hh, mm, ss] = time.split(':').map(Number);
        const departureLimit = hh * 3600 + mm * 60 + ss;

        // 3. Filtrer les arêtes selon l’heure
        const filteredEdges = allEdges.filter(e => {
            if (e.departure_time === null) return true;
            const [h, m, s] = e.departure_time.split(':').map(Number);
            return h * 3600 + m * 60 + s >= departureLimit;
        });

        console.log("🔍 Total avant filtrage :", allEdges.length);
        console.log("⏰ Après filtrage :", filteredEdges.length);

        // 4. Construire le graphe
        const graph = model.buildGraph(filteredEdges);
        
        console.log("🎯 Sommets du graphe (from_stops):", [...graph.keys()]);

        // 5. plus court chemin
        return {
            nodes: graph.size,
            graph
        };

    } catch (error) {
        console.error("Erreur lors de la récupération des arêtes :", error);
        return error;
    }
}