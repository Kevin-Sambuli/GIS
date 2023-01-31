#!/bin/bash

# Start a PostGIS container
docker run --name postgis -p 5432:5432 -d mdillon/postgis

# Install osm2pgsql and its dependencies inside the container
docker exec -it postgis apt-get update
docker exec -it postgis apt-get install -y osm2pgsql

# Create a new database in the container
docker exec -it postgis createdb mydb

# Add the PostGIS extension to the new database
docker exec -it postgis psql -d mydb -c "CREATE EXTENSION postgis;"

# download .pbf file from open street map and put in the same directory where script is running
curl -o belgium-latest.osm.pbf "https://download.geofabrik.de/europe/belgium-latest.osm.pbf"

# Run osm2pgsql to import the data into the database
docker exec -it postgis osm2pgsql -s -c -d mydb -U postgres belgium-latest.osm.pbf


#version: '3'
#services:
#  postgis:
#    image: kartoza/postgis
#    ports:
#      - "5432:5432"
#    environment:
#      - POSTGRES_USER=myuser
#      - POSTGRES_PASS=mypassword
#      - POSTGRES_DBNAME=mydb
#    volumes:
#      - my-postgres-data:/var/lib/postgresql/data
#  osm2pgsql:
#    build: .
#    depends_on:
#      - postgis
#    command: osm2pgsql -c -s -U myuser -d mydb /data/belgium-latest.osm.pbf
#    volumes:
#      - .:/data
#      - my-postgres-data:/var/lib/postgresql/data
#volumes:
#  my-postgres-data: