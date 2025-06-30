CREATE TABLE agency (
    agency_id VARCHAR(50) PRIMARY KEY,
    agency_name VARCHAR(50),
    agency_url VARCHAR(50),
    agency_timezone VARCHAR(50)
);

CREATE TABLE routes (
    route_id VARCHAR(50) PRIMARY KEY,
    agency_id VARCHAR(50),
    route_short_name VARCHAR(50),
    route_long_name VARCHAR(50),
    route_type VARCHAR(50),
    route_color VARCHAR(50),
    route_text_color VARCHAR(50),
    FOREIGN KEY (agency_id) REFERENCES agency(agency_id)
);
CREATE TABLE calendar (
    service_id VARCHAR(50) PRIMARY KEY,
    monday INT,
    tuesday INT,
    wednesday INT,
    thursday INT,
    friday INT,
    saturday INT,
    sunday INT,
    start_date VARCHAR(50),
    end_date VARCHAR(50)
);

CREATE TABLE calendar_dates (
    service_id VARCHAR(50),
    date VARCHAR(50),
    exception_type INT,
    PRIMARY KEY (service_id,date),
    FOREIGN KEY (service_id) REFERENCES calendar(service_id)
);

CREATE TABLE trips (
    trip_id VARCHAR(150) PRIMARY KEY,
    route_id VARCHAR(50),
    service_id VARCHAR(50),
    trip_headsign VARCHAR(80),
    direction_id VARCHAR(50),
    wheelchair_accessible VARCHAR(50),
    bikes_allowed VARCHAR(50),
    FOREIGN KEY (route_id) REFERENCES routes(route_id),
    FOREIGN KEY (service_id) REFERENCES calendar(service_id)
);

CREATE TABLE stops (
    stop_id VARCHAR(50) PRIMARY KEY,
    stop_name VARCHAR(80),
    stop_lon VARCHAR(80),
    stop_lat VARCHAR(80),
    zone_id VARCHAR(50),
    location_type VARCHAR(50),
    parent_station VARCHAR(50),
    stop_timezone VARCHAR(50),
    wheelchair_boarding VARCHAR(50)
);

CREATE TABLE stop_times (
    trip_id VARCHAR(150),
    stop_id VARCHAR(50),
    arrival_time VARCHAR(50),
    departure_time VARCHAR(50),
    stop_sequence VARCHAR(50),
    pickup_type VARCHAR(50),
    drop_off_type VARCHAR(50),
    timepoint VARCHAR(50),
    PRIMARY KEY (trip_id, stop_sequence),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY (stop_id) REFERENCES stops(stop_id)
),
CREATE TABLE transfers (
    from_stop_id VARCHAR(50),
    to_stop_id VARCHAR(50),
    transfer_type VARCHAR(50),
    min_transfer_time VARCHAR(50),
    PRIMARY KEY (from_stop_id, to_stop_id),
    FOREIGN KEY (from_stop_id) REFERENCES stops(stop_id),
    FOREIGN KEY (to_stop_id) REFERENCES stops(stop_id)
);

CREATE TABLE pathways (
    pathway_id VARCHAR(50) PRIMARY KEY,
    from_stop_id VARCHAR(50),
    to_stop_id VARCHAR(50),
    pathway_mode INT,
    length INT,
    traversal_time INT,
    FOREIGN KEY (from_stop_id) REFERENCES stops(stop_id),
    FOREIGN KEY (to_stop_id) REFERENCES stops(stop_id)
);

CREATE TABLE stop_extensions (
    object_id VARCHAR(50) PRIMARY KEY,
    object_system VARCHAR(50),
    object_code VARCHAR(50),
    FOREIGN KEY (object_id) REFERENCES stops(stop_id)
);
