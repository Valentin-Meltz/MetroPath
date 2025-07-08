import client from '../db.js';

export async function Stops() {
    try {
        const stops = await client.query("SELECT stop_id, stop_name FROM stops");
        console.log("\n - (requests) Arrêts récupérés :", stops.rows.length);
        return stops.rows.map(stop => ({
        stop_id: stop.stop_id,
        stop_name: stop.stop_name
        }));
    } catch (err) {
        console.error("Erreur lors de la récupération des arrêts :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getTransfers() {
    try {
        const transfers = await client.query("SELECT from_stop_id, to_stop_id, min_transfer_time FROM transfers");
        console.log("✅ Récupération des transferts terminée.");
        console.log("\n - (requests) Transferts récupérés :", transfers.rows.length);
        return transfers.rows.map(t => ({
            from_stop_id: t.from_stop_id,
            to_stop_id: t.to_stop_id,
            min_transfer_time: t.min_transfer_time
        }));
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des transferts :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getLines() {
    try {
        const lines = await client.query("SELECT trip_id, stop_id, arrival_time, departure_time, stop_sequence FROM selected_stop_times");
        console.log("✅ Récupération des lignes terminée.");
        console.log("\n - (requests) Lignes récupérées :", lines.rows.length);
        return lines.rows.map(t => ({
            trip_id: t.trip_id,
            stop_id: t.stop_id,
            arrival_time: t.arrival_time,
            departure_time: t.departure_time,
            stop_sequence: t.stop_sequence
        }));
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des lignes :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getNextStops(stopId) {
    try {
        const query = `
            SELECT DISTINCT s2.stop_id, s2.stop_name
            FROM stop_times st1
            JOIN stop_times st2
              ON st1.trip_id = st2.trip_id
              AND CAST(st2.stop_sequence AS INTEGER) = CAST(st1.stop_sequence AS INTEGER) + 1
            JOIN stops s2 ON s2.stop_id = st2.stop_id
            WHERE st1.stop_id = $1
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Arrêts suivants récupérés :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des arrêts suivants :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getPreviousStops(stopId) {
    try {
        const query = `
            SELECT DISTINCT s2.stop_id, s2.stop_name
            FROM stop_times st1
            JOIN stop_times st2
              ON st1.trip_id = st2.trip_id
              AND CAST(st2.stop_sequence AS INTEGER) = CAST(st1.stop_sequence AS INTEGER) - 1
            JOIN stops s2 ON s2.stop_id = st2.stop_id
            WHERE st1.stop_id = $1
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Arrêts précédents récupérés :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des arrêts précédents :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getTransferConnections(stopId) {
    try {
        const query = `
            SELECT s.stop_id, s.stop_name
            FROM transfers t
            JOIN stops s ON s.stop_id = t.to_stop_id
            WHERE t.from_stop_id = $1
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Correspondances récupérées :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des correspondances :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getSameStationStops(stopId) {
    try {
        const query = `
            SELECT s2.stop_id, s2.stop_name
            FROM stops s1
            JOIN stops s2 ON s1.parent_station = s2.parent_station
            WHERE s1.stop_id = $1 AND s1.parent_station IS NOT NULL AND s1.stop_id != s2.stop_id
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Arrêts dans la même station récupérés :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des arrêts liés par station :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getStopsOnSameLines(stopId) {
    try {
        const query = `
            SELECT DISTINCT s.stop_id, s.stop_name
            FROM trips t
            JOIN stop_times st ON st.trip_id = t.trip_id
            JOIN stops s ON s.stop_id = st.stop_id
            WHERE t.route_id IN (
              SELECT t2.route_id
              FROM trips t2
              JOIN stop_times st2 ON st2.trip_id = t2.trip_id
              WHERE st2.stop_id = $1
            )
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Arrêts sur les mêmes lignes récupérés :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des arrêts de même ligne :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getLinesServingStop(stopId) {
    try {
        const query = `
            SELECT DISTINCT r.route_id, r.route_short_name, r.route_long_name
            FROM routes r
            JOIN trips t ON t.route_id = r.route_id
            JOIN stop_times st ON st.trip_id = t.trip_id
            WHERE st.stop_id = $1
        `;
        const result = await client.query(query, [stopId]);
        console.log("✅ Lignes desservant l'arrêt récupérées :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des lignes :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getFirstTrip(stopId, datetime) {
    try {
        // Étape 1 : récupérer le parent_station du stop de départ
        const parentQuery = `
            SELECT parent_station
            FROM stops
            WHERE stop_id = $1
        `;
        const parentResult = await client.query(parentQuery, [stopId]);

        if (parentResult.rows.length === 0 || !parentResult.rows[0].parent_station) {
            throw new Error("Station inconnue ou sans correspondance.");
        }

        const parentStation = parentResult.rows[0].parent_station;

        // Étape 2 : récupérer tous les stop_id dans cette même station
        const stopsQuery = `
            SELECT stop_id
            FROM stops
            WHERE parent_station = $1
        `;
        const stopsResult = await client.query(stopsQuery, [parentStation]);
        const stopIds = stopsResult.rows.map(r => r.stop_id);

        const tripsMap = new Map();

        // Étape 3 : pour chaque quai (stop_id), chercher les trips valides
        for (const stop of stopIds) {
            const tripQuery = `
                SELECT t.trip_id, t.route_id, t.direction_id, st.departure_time
                FROM stop_times st
                JOIN trips t ON t.trip_id = st.trip_id
                WHERE st.stop_id = $1
                  AND st.departure_time >= $2
                ORDER BY st.departure_time ASC
            `;
            const tripResult = await client.query(tripQuery, [stop, datetime]);

            for (const row of tripResult.rows) {
                const key = `${row.route_id}_${row.direction_id}`;
                if (!tripsMap.has(key)) {
                    tripsMap.set(key, {
                        route_id: row.route_id,
                        direction: row.direction_id,
                        trip_id: row.trip_id,
                        stop_id: stop,
                        departure_time: row.departure_time
                    });
                }
            }
        }

        console.log("✅ First trips (dans la même station) trouvés :", tripsMap.size);
        return Array.from(tripsMap.values());

    } catch (err) {
        console.error("❌ Erreur dans getFirstTrip :", err);
        throw new Error("Erreur lors de la récupération des premiers trips par station.");
    }
}

export async function getStopTime(tripId, stopId) {
    try {
        const query = `
            SELECT arrival_time, departure_time, stop_sequence
            FROM stop_times
            WHERE trip_id = $1 AND stop_id = $2
        `;
        const result = await client.query(query, [tripId, stopId]);

        if (result.rows.length === 0) {
            console.log(`⚠️ Aucun horaire trouvé pour trip ${tripId} à l'arrêt ${stopId}`);
            return null;
        }

        const row = result.rows[0];
        console.log(`✅ Horaire trouvé pour trip ${tripId} à l'arrêt ${stopId} :`, row);
        return {
            arrival_time: row.arrival_time,
            departure_time: row.departure_time,
            stop_sequence: row.stop_sequence
        };
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des horaires du trip :", err);
        throw new Error("Erreur serveur.");
    }
}
