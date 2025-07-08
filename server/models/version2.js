import * as requests from '../requests/requests.js';

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

export async function getAllConnectedStops(stopId) {
  const [nextStops, transferStops] = await Promise.all([
    requests.getNextStopsRaw(stopId),
    requests.getTransferConnectionsRaw(stopId)
  ]);

  const merged = [...new Map([...nextStops, ...transferStops].map(s => [s.stop_id, s])).values()];
  return merged;
}

export async function getFirstTrip(start, heureDepart) {
  const firstTrips = await requests.getFirstTrip(start, heureDepart);
  console.log("\n - (models) Premier trajet récupéré :", firstTrips.length);
  return firstTrips;
}

