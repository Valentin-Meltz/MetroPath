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

export async function getTransferConnectionsRaw(stopId) {
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

export async function getMaxDate() {
  try {
    const result = await client.query(`SELECT MAX(end_date) AS max_date FROM calendar`);
    return result.rows[0].max_date;
  } catch (err) {
    console.error("Erreur lors de la récupération de la date max :", err);
    throw new Error("Erreur serveur.");
  }
}

export async function getTripsForDate(targetDate) {
    try {
        const query = `
            WITH target AS (
                SELECT $1::date AS date,
                       EXTRACT(DOW FROM $1::date) AS weekday
            ),
            calendar_services AS (
                SELECT service_id
                FROM calendar, target
                WHERE target.date BETWEEN start_date AND end_date
                  AND (
                       (target.weekday = 0 AND sunday) OR
                       (target.weekday = 1 AND monday) OR
                       (target.weekday = 2 AND tuesday) OR
                       (target.weekday = 3 AND wednesday) OR
                       (target.weekday = 4 AND thursday) OR
                       (target.weekday = 5 AND friday) OR
                       (target.weekday = 6 AND saturday)
                  )
            ),
            calendar_exceptions AS (
                SELECT service_id,
                       CASE exception_type
                            WHEN 1 THEN 'add'
                            WHEN 2 THEN 'remove'
                       END AS action
                FROM calendar_dates
                JOIN target ON target.date = calendar_dates.date::date
            ),
            valid_services AS (
                SELECT service_id FROM calendar_services
                UNION
                SELECT service_id FROM calendar_exceptions WHERE action = 'add'
                EXCEPT
                SELECT service_id FROM calendar_exceptions WHERE action = 'remove'
            )
            SELECT trip_id
            FROM trips
            WHERE service_id IN (SELECT service_id FROM valid_services);
        `;
        const result = await client.query(query, [targetDate]);
        console.log("✅ Trips actifs récupérés pour la date :", targetDate, "=>", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des trips actifs :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getStopTimesForDate(targetDate) {
    try {
        const query = `
            WITH target AS (
                SELECT $1::date AS date,
                       EXTRACT(DOW FROM $1::date) AS weekday
            ),
            calendar_services AS (
                SELECT service_id
                FROM calendar, target
                WHERE target.date BETWEEN start_date AND end_date
                  AND (
                       (target.weekday = 0 AND sunday) OR
                       (target.weekday = 1 AND monday) OR
                       (target.weekday = 2 AND tuesday) OR
                       (target.weekday = 3 AND wednesday) OR
                       (target.weekday = 4 AND thursday) OR
                       (target.weekday = 5 AND friday) OR
                       (target.weekday = 6 AND saturday)
                  )
            ),
            calendar_exceptions AS (
                SELECT service_id,
                       CASE exception_type
                            WHEN 1 THEN 'add'
                            WHEN 2 THEN 'remove'
                       END AS action
                FROM calendar_dates
                JOIN target ON target.date = calendar_dates.date::date
            ),
            valid_services AS (
                SELECT service_id FROM calendar_services
                UNION
                SELECT service_id FROM calendar_exceptions WHERE action = 'add'
                EXCEPT
                SELECT service_id FROM calendar_exceptions WHERE action = 'remove'
            ),
            active_trips AS (
                SELECT trip_id
                FROM trips
                WHERE service_id IN (SELECT service_id FROM valid_services)
            )
            SELECT
                st.trip_id,
                st.stop_id,
                st.stop_sequence,
                st.arrival_time,
                st.departure_time
            FROM stop_times st
            JOIN active_trips at ON at.trip_id = st.trip_id
            ORDER BY st.trip_id, st.stop_sequence;
        `;
        const result = await client.query(query, [targetDate]);
        console.log("✅ stop_times pour trips actifs récupérés :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des stop_times :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getIntraTripEdgesForDate(targetDate) {
    try {
        const query = `
            WITH target AS (
                SELECT $1::date AS date,
                       EXTRACT(DOW FROM $1::date) AS weekday
            ),
            calendar_services AS (
                SELECT service_id
                FROM calendar, target
                WHERE target.date BETWEEN start_date::date AND end_date::date
                  AND (
                       (target.weekday = 0 AND sunday = 1) OR
                       (target.weekday = 1 AND monday = 1) OR
                       (target.weekday = 2 AND tuesday = 1) OR
                       (target.weekday = 3 AND wednesday = 1) OR
                       (target.weekday = 4 AND thursday = 1) OR
                       (target.weekday = 5 AND friday = 1) OR
                       (target.weekday = 6 AND saturday = 1)
                  )
            ),
            calendar_exceptions AS (
                SELECT service_id,
                       CASE exception_type
                            WHEN 1 THEN 'add'
                            WHEN 2 THEN 'remove'
                       END AS action
                FROM calendar_dates
                JOIN target ON target.date = calendar_dates.date::date
            ),
            valid_services AS (
                SELECT service_id FROM calendar_services
                UNION
                SELECT service_id FROM calendar_exceptions WHERE action = 'add'
                EXCEPT
                SELECT service_id FROM calendar_exceptions WHERE action = 'remove'
            ),
            active_trips AS (
                SELECT trip_id
                FROM trips
                WHERE service_id IN (SELECT service_id FROM valid_services)
            ),
            ordered_stops AS (
                SELECT
                    st.trip_id,
                    st.stop_id,
                    st.stop_sequence,
                    st.arrival_time,
                    st.departure_time,
                    LEAD(st.stop_id) OVER (PARTITION BY st.trip_id ORDER BY st.stop_sequence) AS next_stop_id,
                    LEAD(st.arrival_time) OVER (PARTITION BY st.trip_id ORDER BY st.stop_sequence) AS next_arrival_time
                FROM stop_times st
                JOIN active_trips at ON at.trip_id = st.trip_id
            )
            SELECT
                trip_id,
                stop_id AS from_stop_id,
                next_stop_id AS to_stop_id,
                departure_time,
                next_arrival_time AS arrival_time
            FROM ordered_stops
            WHERE next_stop_id IS NOT NULL;
        `;
        const result = await client.query(query, [targetDate]);
        console.log("✅ Arêtes intra-trip générées :", result.rows.length);
        return result.rows;
    } catch (err) {
        console.error("❌ Erreur lors de la génération des arêtes intra-trip :", err);
        throw new Error("Erreur serveur.");
    }
}

export async function getTransferEdges() {
    try {
        const query = `
            SELECT from_stop_id, to_stop_id, COALESCE(min_transfer_time::integer, 0) AS min_transfer_time
            FROM transfers
        `;
        const result = await client.query(query);
        console.log("✅ Arêtes de transfert récupérées :", result.rows.length);

        return result.rows.map(row => ({
            from_stop: row.from_stop_id,
            to_stop: row.to_stop_id,
            departure_time: null,
            arrival_time: null,
            min_transfer_time: row.min_transfer_time,
            transfer: true
        }));
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des arêtes de transfert :", err);
        throw new Error("Erreur serveur.");
    }
}