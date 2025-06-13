const fs = require("fs");

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


arretes = fetchJson('../data/arretesV1.json')
sommets = fetchJson('../data/sommetsV1.json')

adj_matrix = createMatrix(sommets, arretes)

console.log(isConnexe(adj_matrix))