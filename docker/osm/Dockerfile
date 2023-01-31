FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y osm2pgsql wget && \
    apt-get clean

RUN mkdir -p /data

RUN wget https://download.geofabrik.de/afrika/kenya-latest.osm.pbf -P /data/

CMD ["osm2pgsql", "-c", "-s", "-U", "admin", "-W", "-d", "osm", "/data/kenya-latest.osm.pbf"]
