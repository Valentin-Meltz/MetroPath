import * as requests from '../requests/requests.js';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

export async function getStops() {
  const stops = await requests.Stops();
  console.log("\n - (models) Arrêts récupérés :", stops.length);
  return stops;
}

export async function getTransfers() {
  const transfers = await requests.getTransfers();
  console.log("\n - (models) Transferts récupérés :", transfers.length);
  return transfers;
}

export async function getLines() {
  const lines = await requests.getLines();
  console.log("\n - (models) Lignes récupérées :", lines.length);
  return lines;
}

export async function maxDate() {
  try {
    const date = await requests.getMaxDate();
    return date;
  } catch (error) {
    return error;
  }
}

export async function getTripsForDate(date) {
  const trips = await requests.getTripsForDate(date);
  console.log("\n - (models) Trips récupérés :", trips.length);
  return trips;
}

export async function getStopTimesForDate(date) {
  const stopTimes = await requests.getStopTimesForDate(date);
  console.log("\n - (models) stop_times récupérés :", stopTimes.length);
  return stopTimes;
}

export async function getIntraTripEdgesForDate(date) {
  const edges = await requests.getIntraTripEdgesForDate(date);
  console.log("\n - (models) Arêtes intra-trip générées :", edges.length);
  return edges;
}

export async function getTransferEdges() {
  const edges = await requests.getTransferEdges();
  console.log("\n - (models) Arêtes de transfert récupérées :", edges.length);
  return edges;
}

export function buildGraph(edges) {
  const graph = new Map();
  for (const edge of edges) {
    const key = edge.from_stop;
    if (!graph.has(key)) {
      graph.set(key, []);
    }
    graph.get(key).push(edge);
  }
  console.log("\n - (models) Graphe construit avec", graph.size, "sommets.");
  return graph;
}

export function findFastestPath(graph, startStop, endStop, departureTimeStr) {
  const [h, m, s] = departureTimeStr.split(":").map(Number);
  const departureSeconds = h * 3600 + m * 60 + s;

  const pq = new MinPriorityQueue(({ time }) => time);
  pq.enqueue({ stop: startStop, time: departureSeconds, path: [] });

  const visited = new Map();

  while (!pq.isEmpty()) {
    const { stop, time, path } = pq.dequeue().element;

    if (visited.has(stop) && visited.get(stop) <= time) continue;
    visited.set(stop, time);

    if (stop === endStop) {
      return path;
    }

    const neighbors = graph.get(stop) || [];
    for (const edge of neighbors) {
      let nextTime = null;

      if (edge.departure_time && edge.arrival_time) {
        const [dh, dm, ds] = edge.departure_time.split(":").map(Number);
        const [ah, am, as] = edge.arrival_time.split(":").map(Number);
        const dep = dh * 3600 + dm * 60 + ds;
        const arr = ah * 3600 + am * 60 + as;

        if (dep >= time) {
          nextTime = arr;
        }
      } else if (edge.min_transfer_time != null) {
        nextTime = time + edge.min_transfer_time;
      }

      if (nextTime !== null) {
        pq.enqueue({
          stop: edge.to_stop,
          time: nextTime,
          path: [...path, {
            from: stop,
            to: edge.to_stop,
            departure_time: edge.departure_time,
            arrival_time: edge.arrival_time,
            trip_id: edge.trip_id || null
          }]
        });
      }
    }
  }

  return null;
}