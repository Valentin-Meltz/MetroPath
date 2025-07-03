import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export function fetchJson(path) {
    const fichier = fs.readFileSync(path);
    return JSON.parse(fichier);
}

export function isConnexe(matrix){
    let prev_matrix = matrix
    let new_matrix = matrix
    do{
        prev_matrix = new_matrix

        //parcours des sommets

        for (let i in prev_matrix){

            //parcours des arrêtes

            for (let j in prev_matrix[i]){
                if (prev_matrix[i][j] != 0){

                    //ajout de l'arrête sur les prédécésseurs du sommet

                    for (let k in new_matrix){
                        if(new_matrix[k][i] != 0){
                            new_matrix [k][j] = prev_matrix[i][j]
                        }
                    }
                }
            }
        }
    } while (!equalMatrix(prev_matrix, new_matrix))

    //test de connexité

    for (let i in prev_matrix){
        for (let j in prev_matrix[i]){
            if (new_matrix[i][j] == 0){
                return false
            }
        }
    }
    return true
}

export function equalMatrix(a, b) {
    if (a.length !== b.length) return false;

    for (let i in a) {
        if (a[i].length !== b[i].length) return false;

        for (let j in a[i]) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }

    return true;
}

export function createMatrix(sommets, arretes) {
    const n = sommets.length;
    const adj_matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (const arrete of arretes) {
        const i = arrete.num_sommet1;
        const j = arrete.num_sommet2;
        const t = arrete.temps_en_secondes;

        adj_matrix[i][j] = t;
        adj_matrix[j][i] = t; // si le graphe est non orienté
    }

    return adj_matrix;
}

export function kruskal(sommets, arretes){
    graph = new Array(sommets.length).fill(0)
    ordered = fusionOrder(arretes)
    for (let i in ordered){
        graph[ordered[i]["num_sommet1"]][ordered[i]["num_sommet2"]] = ordered[i]["temps_en_secondes"]
        if (isCycle(graph)){
            graph[ordered[i]["num_sommet1"]][ordered[i]["num_sommet2"]] = 0
        }
    }
    return graph
}

export function isCycle(graph) {
    //function found on internet

    const n = graph.length;
    const visited = new Array(n).fill(false);
    const parent = new Array(n).fill(-1);

    for (let u = 0; u < n; u++) {
        if (!visited[u]) {
            const line = [];
            line.push(u);
            visited[u] = true;
            parent[u] = u;

            while (line.length > 0) {
                const curent = line.shift();

                for (let i = 0; i < n; i++) {
                    if (graph[curent][i] > 0 && !visited[i]) {
                        line.push(i);
                        visited[i] = true;
                        parent[i] = curent;
                    } else if (graph[curent][i] > 0 && visited[i] && parent[curent] !== i) {
                        return true;
                    }
                }
            }
        }
    }
    return false
}

export function fusionOrder(arretes) {
    if (arretes.length <= 1) {
        return arretes;
    }

    const mid = Math.floor(arretes.length / 2);
    const left = fusionOrder(arretes.slice(0, mid));
    const right = fusionOrder(arretes.slice(mid));

    return merge(left, right);
}

export function merge(left, right) {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i]["temps_en_secondes"] <= right[j]["temps_en_secondes"]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

export function dijkstra(graph, start) {
    const n = graph.length;
    const distances = new Array(n).fill(Infinity);
    const previous = new Array(n).fill(null);
    const visited = new Set();
    const nodes = [];

    for (let i = 0; i < n; i++) {
        nodes.push(i);
    }

    distances[start] = 0;

    while (nodes.length > 0) {
        // Trie les sommets restants selon la distance la plus courte
        nodes.sort((a, b) => distances[a] - distances[b]);
        const closest = nodes.shift();

        if (distances[closest] === Infinity) break;

        visited.add(closest);

        for (let neighbor = 0; neighbor < n; neighbor++) {
            if (graph[closest][neighbor] > 0 && !visited.has(neighbor)) {
                const newDist = distances[closest] + graph[closest][neighbor];
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = closest;
                }
            }
        }
    }

    return { distances, previous };
}

export async function shorterPath(start, end) {
    const sommetsPath = new URL('../Data/sommetsV1.json', import.meta.url);
    const arretesPath = new URL('../Data/arretesV1.json', import.meta.url);

    const sommets = fetchJson(sommetsPath.pathname);
    const arretes = fetchJson(arretesPath.pathname);
    const graph = fetchJson('../Data/matrice_adjacence.json');

    if (!isConnexe(graph.map(row => row.slice()))) {
        throw new Error('Le graphe n\'est pas connexe.');
        console.log("Le graphe n'est pas connexe");
        return;
    }

    console.log(`Recherche du chemin le plus court de ${start} à ${end}`);

    const result = dijkstra(graph, parseInt(start, 10));

    let way = [{ "sommet": parseInt(end, 10) }];
    for (let s of sommets) {
        if (s.num_sommet == end) {
            way[0].nom = s.nom_sommet;
            way[0].ligne = s.numéro_ligne;
            break;
        }
    }

    let time = result.distances[end];
    let summit = end;
    while (parseInt(summit, 10) != parseInt(start, 10)) {
        summit = parseInt(result.previous[summit], 10);
        way.push({ "sommet": summit });
    }

    way.reverse();

    for (let w of way) {
        for (let s of sommets) {
            if (s.num_sommet == w.sommet) {
                w.nom = s.nom_sommet;
                w.ligne = s.numéro_ligne;
                break;
            }
        }
    }

    const answer = {
        path: way,
        time: time,
        start: parseInt(start),
        end: parseInt(end)
    };

    return answer;
}

export function getAllStations() {
    const summits = "../Data/sommetsV1.json";
    return fetchJson(summits);
}
