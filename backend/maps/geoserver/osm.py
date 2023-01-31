# Library import
# from geo.Postgres import Db
from pg.pg import Pg
import psycopg2
import ogr
import gdal
import sys
import os

connection = psycopg2.connect(user="postgres", password="password", host="localhost", database="pythonosm")

# Initialization of library
pg = Db(dbname="webGIS", user="kevoh", password="kevoh1995", host="postgis-db", port="5432")

# Get the column names of the specific table
pg.get_columns_name(table="pg_table")

# Get values from specific column of table
pg.get_values_from_column(column="pg_table_col", table="pg_table", schema="public")

# Create schema
pg.create_schema(name="schema_name")

# create cursor
cursor = connection.cursor()

cursor.execute("DROP TABLE IF EXISTS trial")
cursor.execute("CREATE extension hstore")
cursor.execute("CREATE TABLE trial (id SERIAL PRIMARY KEY,tstamp Timestamp,highway text, tags hstore,geom Geometry)")
cursor.execute("CREATE INDEX trial_index ON trial USING GIST(geom)")
print("Successfully created ")
connection.commit()

gdal.SetConfigOption('OGR_INTERLEAVED_READING', 'YES')
driver = ogr.GetDriverByName('OSM')
# open the data source
ds = driver.Open(r"C:\Singapore.osm", 0)
if ds is None:
    print("Could not open file")
    sys.exit(1)

nLayerCount = ds.GetLayerCount()

thereIsDataInLayer = True

while thereIsDataInLayer:
    thereIsDataInLayer = False

    # read data from layers using OGR_INTERLEAVED_READING method

    for iLayer in range(nLayerCount):
        lyr = ds.GetLayer(iLayer)

        # read next Feature
        feat = lyr.GetNextFeature()
        while (feat is not None):
            # continue reading features from this layer
            thereIsDataInLayer = True
            lyr = ds.GetLayer(1)

            for feat in lyr:
                # filter highway
                highway_tag = feat.GetField("highway")
                if highway_tag == 'bridleway' or highway_tag == 'cycleway' or highway_tag == 'footway' \
                        or highway_tag == 'living_street' or highway_tag == 'secondary' or highway_tag == 'secondary_link' \
                        or highway_tag == 'tertiary' or highway_tag == 'tertiary_link' or \
                        highway_tag == 'unclassified' or highway_tag == 'track' or highway_tag == 'path' \
                        or highway_tag == 'pedestrian' or highway_tag == 'residential' or highway_tag == 'road':
                    geomStand = feat.GetGeometryRef()
                    wkt = geomStand.ExportToWkt()

                    cursor.execute("INSERT INTO trial(geom) values (ST_GeomFromText(" + "'" + wkt + "', 4326))")
                    connection.commit()
            feat.Destroy()
            # get the next feature
            feat = lyr.GetNextFeature()
print("done")
