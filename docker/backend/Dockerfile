FROM python:3.9-slim-buster

MAINTAINER Makina Corpus "contact@kevin-sambuli.com"


# set our working directory inside the container (when it's finally created from this image)
RUN mkdir -p /home/app

# depending on your environment you may also need to store your postgres data in a folder
RUN mkdir -p /postgres_data

# To store your geoserver data in a folder
RUN mkdir -p /geo_data

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/api
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME


# Prevents Python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update && \
    # postgresql dependencies
    apt-get -y install libpq-dev gcc && \
    apt-get install -y build-essential && \
    # cleaning up unused files
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false &&  \
    rm -rf /var/lib/apt/lists/* && rm -rf /var/cache/apt/*


# Setup GDAL dependencies
RUN apt-get update && \
    apt-get install -y binutils libproj-dev gdal-bin python-gdal python3-gdal

# set up geospatial libraries using pipwin that install from
RUN pip install geopandas pyproj Shapely Fiona psycopg2 psycopg2-binary gunicorn

RUN pip install geopy geocoder geoip2 numpy pandas sqlalchemy GeoAlchemy2 earthengine-api # geoserver-rest

#RUN addgroup --system django \
#  && adduser --system --ingroup django django
#
#USER django

#CMD ["/bin/bash"]




# copy requirements to the image
COPY ./requirements.txt $APP_HOME

#RUN pip install -r requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# upgrade pip version
RUN pip install --upgrade pip

# copy entrypoint.sh
COPY ./entrypoint.sh $APP_HOME

COPY ./start.sh $APP_HOME

# copy to project into the docker app directrory this comes last to make the build faster
COPY . $APP_HOME

# chown all the files to the app user
# useradd -U user
# RUN chown -R app:app $APP_HOME

# change to the app user
# USER app

RUN chmod +x ./entrypoint.sh

#ENTRYPOINT ["./entrypoint.sh"]
#ENTRYPOINT ["home/app/api/entrypoint.sh"]