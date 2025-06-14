const fs = require("fs");
const path = require("path");

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
    } while (!matricesEgales(prev_matrix, new_matrix))

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

function matricesEgales(a, b) {
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

arretes = fetchJson('../data/arretesV1.json')
sommets = fetchJson('../data/sommetsV1.json')

adj_matrix = createMatrix(sommets, arretes)

console.log(isConnexe(adj_matrix))
console.log(isConnexe(kruskal(sommets, arretes)))