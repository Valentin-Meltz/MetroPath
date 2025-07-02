import json

print("Extracting file ...")

## Fichier agency
agencies = []
with open("../data/Version2/agency.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:

        i = ligne.split(",")
        if(i[0] == "IDFM:Operator_100"):
            agency = {
                'agency_id' : i[0],
                'agency_name' : i[1],
                'agency_url' : i[2],
                'agency_timezone' : i[3],
            }
            agencies.append(agency)
fichier.close()
with open("../server/Data/agency.json", "w") as fichier:
     json.dump(agencies, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier routes
routes = []
with open("../data/Version2/routes.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")
        
        if(i[1] == "IDFM:Operator_100" and i[5] == "1"):
            route = {
                'route_id' : i[0],
                'agency_id' : i[1],
                'route_short_name' : i[2],
                'route_long_name' : i[3],
                'route_type' : i[5],
                'route_color' : i[7],
                'route_text_color' : i[8],
            }
            routes.append(route)
fichier.close()
with open("../server/Data/routes.json", "w") as fichier:
     json.dump(routes, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier trips
with open("../server/Data/routes.json", "r") as f:
    routes_data = json.load(f)
    route_ids_valides = set(route['route_id'] for route in routes_data)
f.close()
trips = []
with open("../data/Version2/trips.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")

        if i[0] in route_ids_valides:
            trip = {
                'trip_id': i[2],
                'route_id' : i[0],
                'service_id' : i[1],
                'trip_headsign' : i[3],
                'direction_id' : i[5],
                'wheelchair_accessible' : i[8],
                'bikes_allowed' : i[9].strip()
            }
            trips.append(trip)
fichier.close()
with open("../server/Data/trips.json", "w") as fichier:
     json.dump(trips, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier calendar_dates
with open("../server/Data/trips.json", "r") as f:
    trips_data = json.load(f)
    service_ids_valides = set(t['service_id'] for t in trips_data)
f.close()
calendar_dates = []
with open("../data/Version2/calendar_dates.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")

        if i[0] in service_ids_valides:   
            calendar_date = {
                'service_id' : i[0],
                'date' : i[1],
                'exception_type' : int(i[2].strip()),
            }
            calendar_dates.append(calendar_date)
fichier.close()
with open("../server/Data/calendar_dates.json", "w") as fichier:
     json.dump(calendar_dates, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier calendar
calendars = []
with open("../data/Version2/calendar.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")

        if i[0] in service_ids_valides:   
            calendar = {
                'service_id' : i[0],
                'monday' : int(i[1]),
                'tuesday' : int(i[2]),
                'wednesday' : int(i[3]),
                'thursday' : int(i[4]),
                'friday' : int(i[5]),
                'saturday' : int(i[6]),
                'sunday' : int(i[7]),
                'start_date' : i[8],
                'end_date' : i[9].strip()
            }
            calendars.append(calendar)
fichier.close()
with open("../server/Data/calendar.json", "w") as fichier:
     json.dump(calendars, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier stop_times
with open("../server/Data/trips.json", "r") as f:
    trips_data = json.load(f)
    trips_ids_valides = set(t['trip_id'] for t in trips_data)
f.close()
stop_times = []
with open("../data/Version2/stop_times.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")

        if i[0] in trips_ids_valides:
            stop_time = {
                'trip_id' : i[0],
                'stop_id': i[3],
                'arrival_time' : i[1],
                'departure_time' : i[2],
                'stop_sequence' : i[4],
                'pickup_type' : i[5],
                'drop_off_type' : i[6],
                'timepoint' : i[9].strip()
            }
            stop_times.append(stop_time)
fichier.close()
with open("../server/Data/stop_times.json", "w") as fichier:
     json.dump(stop_times, fichier, indent=4, ensure_ascii=False)
fichier.close()
print(len(stop_times))

## Fichier stops
with open("../server/Data/stop_times.json", "r") as f:
    stop_times_data = json.load(f)
    stop_ids_valides = set(s['stop_id'] for s in stop_times_data)
f.close()
stops = []
with open("../data/Version2/stops.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")

        if i[0] in stop_ids_valides:
            stop = {
                'stop_id' : i[0],
                'stop_name' : i[2],
                'stop_lon' : i[4],
                'stop_lat' : i[5],
                'zone_id' : i[6],
                'location_type' : i[8],
                'parent_station' : i[9],
                'stop_timezone' : i[10],
                'wheelchair_boarding' : i[12],
            }
            stops.append(stop)
fichier.close()
with open("../server/Data/stops.json", "w") as fichier:
     json.dump(stops, fichier, indent=4, ensure_ascii=False)
fichier.close()

## Fichier transfert
with open("../server/Data/stops.json", "r") as f:
    stops_data = json.load(f)
    stops_ids_valides = set(s['stop_id'] for s in stops_data)
f.close()
transfers = []
with open("../data/Version2/transfers.txt", "r") as fichier:
    lignes = fichier.readlines()[1:]
    for ligne in lignes:
        i = ligne.split(",")
        
        if(i[0] in stops_ids_valides and i[1] in stops_ids_valides):
            transfer = {
                'from_stop_id' : i[0],
                'to_stop_id' : i[1],
                'transfer_type' : i[2],
                'min_transfer_time' : i[3].strip()
            }
            transfers.append(transfer)
fichier.close()
with open("../server/Data/transfers.json", "w") as fichier:
     json.dump(transfers, fichier, indent=4, ensure_ascii=False)
fichier.close()

print("File extracted")