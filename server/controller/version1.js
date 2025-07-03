// version1.js
import fs from 'fs';
// et les autres modules comme suit :
import path from 'path';

function fetchJson(path) {
    const fichier = fs.readFileSync(path)
    return JSON.parse(fichier)
}

function isConnexe(matrix){
    prev_matrix = matrix
    new_matrix = matrix
    do{
        prev_matrix = new_matrix

        //parcours des sommets

        for (i in prev_matrix){

            //parcours des arrêtes

            for (j in prev_matrix[i]){
                if (prev_matrix[i][j] != 0){

                    //ajout de l'arrête sur les prédécésseurs du sommet

                    for (k in new_matrix){
                        if(new_matrix[k][i] != 0){
                            new_matrix [k][j] = prev_matrix[i][j]
                        }
                    }
                }
            }
        }
    } while (!equalMatrix(prev_matrix, new_matrix))

    //test de connexité

    for (i in prev_matrix){
        for (j in prev_matrix[i]){
            if (new_matrix[i][j] == 0){
                return false
            }
        }
    }
    return true
}

function equalMatrix(a, b) {
    if (a.length !== b.length) return false;

    for (i in a) {
        if (a[i].length !== b[i].length) return false;

        for (j in a[i]) {
            if (a[i][j] !== b[i][j]) return false;
        }
    }

    return true;
}

function createMatrix(sommets, arretes){
    adj_matrix = []

    //création des sommets
    for (i in sommets){
        adj_matrix.push([])
        for (j in sommets){
            adj_matrix[i].push(0)

            //remplissage des arrêtes
            for(k in arretes){
                if ((arretes[k]["num_sommet1"] == i && arretes[k]["num_sommet2"] == j) || (arretes[k]["num_sommet1"] == j && arretes[k]["num_sommet2"] == i)){
                    adj_matrix[i][j] = arretes[k]["temps_en_secondes"]
                    break
                }
            }
        }
    }

    return adj_matrix
}

function kruskal(sommets, arretes){
    graph = new Array(sommets.length).fill(0)
    ordered = fusionOrder(arretes)
    for (i in ordered){
        graph[ordered[i]["num_sommet1"]][ordered[i]["num_sommet2"]] = ordered[i]["temps_en_secondes"]
        if (isCycle(graph)){
            graph[ordered[i]["num_sommet1"]][ordered[i]["num_sommet2"]] = 0
        }
    }
    return graph
}

function isCycle(graph) {
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

function fusionOrder(arretes) {
    if (arretes.length <= 1) {
        return arretes;
    }

    const mid = Math.floor(arretes.length / 2);
    const left = fusionOrder(arretes.slice(0, mid));
    const right = fusionOrder(arretes.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
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

function dijkstra(graph, start) {
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

function shorterPath(start, end){
    const graph = createMatrix(fetchJson("../../data/sommetsV1.json"), fetchJson("../../data/arretesV1.json"));
    const result = dijkstra(graph, start)
    const sommets = fetchJson("../../data/sommetsV1.json")
    let path = [{"sommet" : end}]
    for (i in sommets){
        if (sommets[i].num_sommet == end){
            path[0]["nom"] = sommets[i].nom_sommet
            path[0]["ligne"] = sommets[i].numéro_ligne
            break
        }
    }
    let time = result.distances[end]
    let summit = end
    while (summit !== start) {
        path.push({"sommet" : result.previous[summit]})
        summit = result.previous[summit]
    }
    path.reverse()
    for (i in path){
        for (j in sommets){
            if (sommets[j]["num_sommet"] == path[i].sommet){
                path[i]["nom"] = sommets[j].nom_sommet
                path[i]["ligne"] = sommets[j].numéro_ligne
                break
            }
        }
    }
    return {
        "path": path,
        "time": time,
        "start": start,
        "end": end
    }
}

console.log(shorterPath(0, 3))