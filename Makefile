ifneq (,$(wildcard .env))
   include .env
   export
   ENV_FILE_PARAM = --env-file .env
endif

config:
	docker-compose config

images:
	docker image rm 'nameOfTheImage'

build:
	docker-compose down -v
	docker-compose up api --build
	docker-compose  up --build --remove-orphans
	docker-compose -f docker-compose-dev.yml down -v
	docker-compose -f docker-compose-dev.yml up web -d --build --remove-orphans

run:
	docker-compose run --rm api django-admin startproject core .
	docker-compose run api python manage.py runserver

up:
	docker-compose up

exec:
	docker exec -it web rm -rf  mypeople
	docker exec -it web rm  mypeople.txt
	docker-compose -f docker-compose.yml exec api black --check --exclude=migrations .
	docker-compose -f docker-compose.yml exec api black --diff --exclude=migrations .

	docker-compose -f docker-compose.yml exec api python manage.py runserver
	docker-compose -f docker-compose.yml exec api python manage.py migrate --noinput
	docker-compose -f docker-compose.yml exec api python manage.py makemigrations
	docker-compose -f docker-compose.yml exec api python manage.py makemigrations --dry-run --verbosity 3
	docker-compose -f docker-compose.yml exec api python manage.py collectstatic --noinput --clear

logs:
	docker-compose logs

down:
	docker-compose down

migrate:
	docker-compose exec land_app python manage.py migrate --noinput

makemigrations:
	docker-compose exec land_app python manage.py makemigrations

superuser:
	docker-compose exec land_app python manage.py createsuperuser

down-v:
	docker-compose down -v

volume:
	docker volume inspect api_postgres_data

volumecheck:
	docker volume ls
	docker volume create pddata
	docker volume inspect react_build

shell:
	docker-compose exec api python manage.py shell

database_check:
	# psql -h localhost -U docker -p 25432 -l
	# Note: Default postgresql user is 'docker' with password 'docker'.
	docker-compose exec postgres-db psql --username=kevoh --dbname=webGIS
	docker-compose exec postgres-db psql --username=kevoh --dbname=LIS
	LIS=# \l
	LID=# \c
	LIS=# \dt
	LIS=# \P
	LIS=# \d+ spatail_ref_sys


create_app:
	docker-compose run api sh -c "django-admin startapp core"

start_django_proj:
	docker-compose run api sh -c "django-admin startproject ardhi"

# Docker
container:
	docker up  # showing running containers
	docker up -a

inspect:
	docker inspect 977654323456 # returning container information

postgis:
	judith@jlas:~$ sudo docker exec -it postgis_postgres bash
	root@544c89fadeda:/# //you will be there
	root@544c89fadeda:/# psql -h localhost -p 5432 -U postgres
	postgres=# CREATE EXTENSION postgis;
	postgres=#

	# psql -h localhost -U docker -p 25432 -l
	# Note: Default postgresql user is 'docker' with password 'docker'.

	docker exec -it api bash
	docker exec -it postgis /bin/bash -c \
	"PGPASSWORD=<PASSWORD> psql -d <DBNAME> -U <USERNAME> -h localhost -c \"create schema <USERNAME>;\""

	docker run --name "postgrest_tut" -p 5432:5432 -e POSTGRES_MULTIPLE_EXTENSIONS=postgis -d -t kartoza/postgis
	docker exec -it postgrest_tut bash
	docker run --publish 8000:8000 django
	docker exec -it postgis_db bash
	docker exec -it postgis_db sh # use this when using alpine image
	docker exec -it api /bin/bash

	su postgres # change to posgres user
	root= pwd # prints working directory
	root= ls # lists all folders in the working directory
	root= ls --color -F
	root = psql --help
	root=  psql - U kevoh # connecting to psql inside the container
	root= \du    # getting the database user
	root= \l    # list of databases
	root= \c Ardhi;  # connecting to ardhi databases
	root = \q
	root = psql Ardhi kevoh
	Ardhi=# CREATE EXTENSION postgis;
	Ardhi=# \d
	Ardhi=# \q
	Ardhi=# \dt;
	Ardhi=# \d parcels;
	docker exec -it postgrest_tut bash -c "apt-get update && apt-get install postgis"
	docker exec -it postgrest_tut psql -U postgres
	docker exec -it postgis_db psql -U kevoh


# container commands
docker:
	docker run -i -t ubuntu
	#apt-get apt update

	docker image rm 'nameOfTheImage'
	docker run postgres
	docker run --name mysecondapp -p 80:80 -d pythonimage #create container from existing image
	docker up
	docker images
	docker config
	docker info
	docker image ls
	docker pull image
	docker logs container-name or image
	docker inspect container-name # check container details and ip address
	docker exec container-name
	docker ps #checking running container
	docker ps -a # checking all containers
	docker stop container id or name # stopping container
	docker run i postgres # interactive mode
	docker run it postgres # interactive shell and prompt

	# creating user defined bridge network that can be accessed with other containers
	docker network create tulip-net
	docker network create net

	docker network create wikinet
	docker network connect wikinet wiki-instar-en
	docker network connect wikinet wiki-instar-de
	docker network connect wikinet wiki-instar-fr
	docker network ls # checking all networks in the docker

#	-t gives access to the terminal, and the
#	-i allows us to interact with the container through the terminal.

	docker start -ai Step2Container1 # restart container
	docker volume rm Step2DataVolume
	docker volume inspect Step2DataVolume

	docker stats

	docker run -ti --name=Step4Container1 -v Step4DataVolume:/Step4DataVolume ubuntu
	docker run -ti --name=Step4Container2 --volumes-from Step4Container1 ubuntu

	docker volume ls # listing all volumes

	# creating volumes
	docker volume create --name geoserver_data
	docker volume create --name pd_data
	docker volume create --name front_data
	docker run -ti --rm -v Step1DataVolume:/Step1DataVolume ubuntu

	docker run -ti --name=Step2Container1 -v Step2DataVolume:/Step2DataVolume ubuntu

	docker volume inspect Step1DataVolume


	docker inspect api | grep IPAddress
	docker inspect postgres_db | grep IPAddress

	# copying to local disk and replacing it
	docker exec -ti --user root <container-id> /bin/bash
	docker cp <container>:/path/to/file.ext .
	docker cp file.ext <container>:/path/to/file.ext

#http://geospatialdev.com/geoserver/osm/wms?service=wms&version=1.3.0&request=GetCapabilities

#cross origin filter
#/usr/local/tomcat/webapps/geoserver/WEB-INF/web.xml
#:/usr/local/tomcat/webapps/geoserver
#/usr/local/tomcat/conf/web.xml

#from my computer:
#
#scp -r /Users/melo/Desktop/geoserver-2.13.0  melo@159.65.75.41:/usr/share/geoserver
#permission denied. fixed with:
#
#sudo chown -R $USER:$USER /usr/share/geoserver

#start geoserver
#cd /usr/share/geoserver/bin
#sh startup.sh

#Restart geoserver:
#
#killall geoserver && sh /usr/share/geoserver/bin/startup.sh

# cp -R <source_folder> <destination_folder>

# cp -R ./data ../
