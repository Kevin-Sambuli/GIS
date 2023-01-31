import subprocess
import os
import sys

# ogrinfo parcels\data\parcels.shp
# ogrinfo -so parcels\data\parcels.shp Parcels
# ogrinfo -al parcels\data\parcels.shp Parcels


os.system('python --version')
# os.system('date')
# os.system('ogrinfo -so resources/shapefile/Nairobi.shp Nairobi')


pg = 'shp2pgsql -I -s 2263 nybb.shp nybb | psql -U hello -d gisdata'
og= 'ogr2ogr -f "file_format" destination_data source_data'

"""Convert GeoJSON to PostGIS:
ogr2ogr -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.json"

 ogr2ogr -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.json" -nln destination_table -append
 
 Convert GeoJSON to ESRI Shapefile:
> ogr2ogr -f "ESRI Shapefile" destination_data.shp "source-data.json"
 

 Convert Shapefile to PostGIS:
> ogr2ogr.exe -f "PostgreSQL" PG:"dbname=my_database user=postgres" "source_data.shp" -skip-failures
"""

# subprocess.run("date")
# p1 = subprocess.run("dir", shell=True)
# subprocess.run(["dir", "-a"], shell=True)
# p1 = subprocess.run("dir", shell=True, capture_output=True)
# p1 = subprocess.run("dir", shell=True, capture_output=True, text=True)

# p1 = subprocess.run("dir", shell=True, stdout=subprocess.PIPE, text=True)
#
# p2 = subprocess.run("dir", shell=True, capture_output=True, text=True, check=True)
#
# p3 = subprocess.run(["mkdir", "proj"], shell=True, capture_output=True, text=True, check=True)
#
# p4 = subprocess.run(["cd", "proj"], shell=True, capture_output=True, text=True, input=p1.stdout)


p5 = subprocess.run("cd maps mkdir proj", shell=True, capture_output=True, text=True)

# with open('require.txt') as f:
#     p2 = subprocess.run("dir", shell=True, stdout=f, text=True)
#     # p2
#
# if p4.returncode == 0:  # zero error
#     print("success")
#     print(os.getcwd())

# print(p1.args)
# print(p1.stderr)
# print(p1.returncode)
# # print(p1.stdout.decode())
# print(p4.stdout)


# subprocess.call('dir', shell=True, cwd='maps/')

commands = '''
pwd
cd some-directory
pwd
cd another-directory
pwd
'''

# >>> import os
# >>> import subprocess
# >>> # Lets Just Say WE want To List The User Folders
# >>> os.chdir("/home/")
# >>> subprocess.run("ls")
# user1 user2 user3 user4

process = subprocess.Popen('/bin/bash', shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
out, err = process.communicate(commands.encode('utf-8'))
print(out.decode('utf-8'))
