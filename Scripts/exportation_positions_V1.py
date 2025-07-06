

import json
from collections import defaultdict

# Dictionnaire pour stocker les positions par arrêt
positions = defaultdict(list)

with open("./data/Version1/pospoints.txt", "r", encoding="utf-8") as f:
    for line in f:
        parts = line.strip().split(";")
        if len(parts) == 3:
            x, y, name = parts
            name = name.replace("@", " ")
            positions[name].append((int(x), int(y)))

# Calculer la moyenne des positions
mean_positions = {}
for name, coords in positions.items():
    sum_x = sum(x for x, _ in coords)
    sum_y = sum(y for _, y in coords)
    count = len(coords)
    mean_x = round(sum_x / count)
    mean_y = round(sum_y / count)
    mean_positions[name] = {"x": mean_x, "y": mean_y}

# Exporter en JSON
with open("positions_moyennes.json", "w", encoding="utf-8") as f:
    json.dump(mean_positions, f, ensure_ascii=False, indent=2)