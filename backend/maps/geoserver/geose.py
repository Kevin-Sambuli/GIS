import os

from geo.Geoserver import Geoserver

help(Geoserver)


geo = Geoserver(
    "http://127.0.0.1:8080/geoserver", username="admin", password="geoserver"
)

geo.create_workspace("geoserver-rest")
# geo.create_coveragestore(
#     lyr_name='raster1', path=r'C:\Users\gic\Desktop\geoserver-rest\data\raster\raster1.tif', workspace='demo')
#
geo.create_featurestore(
    "postgis",
    workspace="geoserver-rest",
    db="Ardhi",
    pg_user="postgres",
    pg_password="kevoh",
    host="127.0.0.1",
)

geo.publish_featurestore(
    store_name="postgis", pg_table="parcels", workspace="geoserver-rest"
)
#
#
# geo.upload_style(
#     path=r'C:\Users\gic\Desktop\geoserver-rest\data\style\raster1.sld', workspace='demo')
#
# geo.publish_style(layer_name='raster1',
#                   style_name='raster-new', workspace='demo')
#
# geo.create_coveragestyle(raster_path=r'C:\Users\gic\Desktop\geoserver-rest\data\raster\raster1.tif',
#  style_name='raster-new', workspace='demo', color_ramp='hsv')
#
# geo.create_outline_featurestyle('polygon-style', workspace='demo')
# geo.publish_style(layer_name='jamoat-db',
#                   style_name='polygon-style', workspace='demo')


# Here's some Python code I'm using to import osm data to a certain schema -
# params
dbname = "mydb"
username = "postgres"
schema = "austin"
osmfile = "austin.osm"
style = "all.style"

# change search path to new schema
# osm2pgsql will import the osm data to the first schema in the search path

# sql = f"CREATE SCHEMA {metro}; ALTER ROLE {username} SET search_path TO {metro},public;"
# cmd = f'psql --dbname {dbname} --command "{sql}"'  # windows needs double quotes around sql
# print(cmd)
# os.system(cmd)

# import osm data
# uses slim mode - see https://wiki.openstreetmap.org/wiki/Osm2pgsql#Slim_mode
cmd = f"osm2pgsql --create --latlong --slim --hstore --style {style} --database {dbname} --username {username} {osmfile}"
print(cmd)
os.system(cmd)

# ogrinfo parcels\data\parcels.shp
# ogrinfo -so parcels\data\parcels.shp Parcels
# ogrinfo -al parcels\data\parcels.shp Parcels


os.system('python --version')
# os.system('date')
# os.system('ogrinfo -so resources/shapefile/Nairobi.shp Nairobi')


pg = 'shp2pgsql -I -s 2263 nybb.shp nybb | psql -U hello -d gisdata'
og = 'ogr2ogr -f "file_format" destination_data source_data'

"""Convert GeoJSON to PostGIS:
ogr2ogr -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.json"

 ogr2ogr -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.json" -nln destination_table -append

 Convert GeoJSON to ESRI Shapefile:
> ogr2ogr -f "ESRI Shapefile" destination_data.shp "source-data.json"


 Convert Shapefile to PostGIS:
> ogr2ogr.exe -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.shp" -skip-failures

To convert a PostGIS table to a shapefile, you can use the following command:
ogr2ogr -f “ESRI Shapefile” buildings_mn.shp “PG:host=localhost dbname=nyc user=postgres password=password” “buildings_mn”

where “buildings_mn” is the name of your db table
"""

# change search path back to public schema
sql = f"ALTER ROLE {username} SET search_path TO public;"
cmd = f'psql --dbname {dbname} --command "{sql}"'
print(cmd)
os.system(cmd)
