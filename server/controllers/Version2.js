import * as model from '../models/version2.js';

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

export async function shorterPath(req, res) {
    try {
        const data = req.query;
        const { start, end, heureDepart, sommets } = data;

        const distances = {};
        const previous = {};
        const visited = new Set();
        const queue = new Set();

        const firstTrips = await model.getFirstTrip(start, heureDepart);
        const tripMap = new Map();
        for (const trip of firstTrips) {
            tripMap.set(trip.stop_id, trip.trip_id);
        }

        distances[start] = 0;
        queue.add(start);

        while (queue.size > 0) {
            let current = null;
            let minDistance = Infinity;
            for (const node of queue) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    current = node;
                }
            }

            if (current === end) break;

            queue.delete(current);
            visited.add(current);

            const neighbors = await model.getAllConnectedStops(current);

            for (const neighbor of neighbors) {
                const nid = neighbor.stop_id;
                if (visited.has(nid)) continue;

                const currentTripId = tripMap.get(current);
                if (!currentTripId) continue;

                const currentTime = await model.getStopTime(currentTripId, current);
                const nextTime = await model.getStopTime(currentTripId, nid);

                if (!currentTime || !nextTime) continue;

                const departure = timeToSeconds(currentTime.departure_time);
                const arrival = timeToSeconds(nextTime.arrival_time);
                const duration = arrival - departure;

                if (duration < 0) continue;

                const alt = distances[current] + duration;

                if (!(nid in distances) || alt < distances[nid]) {
                    distances[nid] = alt;
                    previous[nid] = current;
                    queue.add(nid);
                    tripMap.set(nid, currentTripId);
                }
            }
        }

        if (!(end in previous)) {
            return res.status(404).json({
                path: [],
                time: null,
                start,
                end,
                error: "Aucun chemin trouvé"
            });
        }

        const way = [{ sommet: end }];
        for (let i in sommets) {
            if (sommets[i].num_sommet === end) {
                way[0]["nom"] = sommets[i].nom_sommet;
                way[0]["ligne"] = sommets[i].numéro_ligne;
                break;
            }
        }

        let summit = end;
        const time = distances[end];

        while (summit !== start) {
            summit = previous[summit];
            way.push({ sommet: summit });
        }

        way.reverse();

        for (let i in way) {
            for (let j in sommets) {
                if (sommets[j]["num_sommet"] === way[i].sommet) {
                    way[i]["nom"] = sommets[j].nom_sommet;
                    way[i]["ligne"] = sommets[j].numéro_ligne;
                    break;
                }
            }
        }

        return res.status(200).json({
            path: way,
            time,
            start,
            end
        });
    } catch (error) {
        console.error("❌ Erreur dans shorterPath :", error);
        return res.status(500).json({ error: "Erreur serveur." });
    }
}

function timeToSeconds(timeStr) {
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + s;
}
