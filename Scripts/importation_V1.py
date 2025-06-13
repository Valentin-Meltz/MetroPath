import json

sommets = []
arretes = []

with open("./data/Version1/metro.txt", "r") as fichier:
    for i, ligne in enumerate(fichier):
        if i >= 15:
            if ligne[0] == "V":
                #Cas des sommets
                next = 2
                id = ""
                nom = ""
                metro = ""
                terminus = ""
                branchement = ""
                for j in range(next,6):
                    if ligne[j] != " ":
                        id = id + ligne[j]
                    else :
                        break
                next = 6
                for j, e in enumerate(ligne[next::]):
                    if e == ";":
                        next += j+1
                        break
                    else:
                        nom = nom + e
                for j, e in enumerate(ligne[next::]):
                    if e == ";":
                        next += j+1
                        break
                    else:
                        metro = metro + e
                for j, e in enumerate(ligne[next::]):
                    if e == " ":
                        next += j+1
                        break
                    else:
                        terminus = terminus + e
                for j, e in enumerate(ligne[next::]):
                    branchement = branchement + e
                sommet = {
                    'num_sommet' : int(id),
                    'nom_sommet' : nom,
                    'numéro_ligne' : metro,
                    'si_terminus' : terminus == "True",
                    'branchement' : int(branchement)
                }
                sommets.append(sommet)
                print(sommet)
            elif ligne[0] == "E":
                next = 2
                num1 = ""
                num2 = ""
                t = ""
                for j, e in enumerate(ligne[next::]):
                    if e != " ":
                        num1 += e
                    else:
                        next += j+1
                        break
                for j, e in enumerate(ligne[next::]):
                    if e != " ":
                        num2 += e
                    else:
                        next += j+1
                        break
                for j, e in enumerate(ligne[next::]):
                    if e != " ":
                        t += e
                arrete = {
                    'num_sommet1' : int(num1),
                    'num_sommet2' : int(num2),
                    'temps_en_secondes' : int(t)
                }
                arretes.append(arrete)
                print(arrete)
print("\nArrêtes et sommets récupérées avec succès.")
fichier.close()

with open("./data/sommetsV1.json", "w") as fichier:
     json.dump(sommets, fichier, indent=4, ensure_ascii=False)
fichier.close()

print("\nSommets écris avec fichier dans 'data/sommetsV1.json'")

with open("./data/arretesV1.json", "w") as fichier:
     json.dump(arretes, fichier, indent=4, ensure_ascii=False)
fichier.close()

print("\nArrêtes écries avec fichier dans 'data/arretesV1.json'")