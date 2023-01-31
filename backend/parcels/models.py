import datetime
import glob
import os
import zipfile

from django.conf import settings
from django.contrib.gis.db import models as geoModels
from django.contrib.gis.db.models.functions import AsGeoJSON, Centroid, Distance
from django.core.serializers import serialize

# import geopandas as gpd
# from sqlalchemy import *
# from geo.Postgres import Db
from django.db import models

# from geoalchemy2 import Geometry, WKTElement
from django.db.models.signals import post_delete, post_save

# from geo.Geoserver import Geoserver
from django.dispatch import receiver


# Create your models here.
class Uploads(models.Model):
    areah = models.FloatField("Area", default=0)
    perm = models.FloatField("Perimeter", default=0)
    plotno = models.BigIntegerField("Plot NO", unique=True)
    lrnumber = models.CharField("LRNumber", max_length=80, unique=True)
    geom = geoModels.PolygonField("Geometry", srid=4326)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        # related_name="land_upload",
        verbose_name="Owner",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "uploads"
        verbose_name_plural = "uploads"

    def __str__(self):
        return self.lrnumber

    @classmethod
    def allUploads(cls):
        """Returns all objects from the database as ageojson"""
        return serialize("geojson", cls.objects.all())


class Parcels(models.Model):
    # gid = models.IntegerField(primary_key=True)
    areah = models.FloatField("Area", default=0)
    perm = models.FloatField("Perimeter", default=0)
    plotno = models.BigIntegerField("Plot NO", unique=True)
    lrnumber = models.CharField("LRNumber", max_length=80, unique=True)
    geom = geoModels.MultiPolygonField("Geometry", srid=4326)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Owner",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "parcels"
        verbose_name_plural = "parcels"

    def __str__(self):
        return self.lrnumber

    def allUploads(self):
        """Returns all objects from the database as ageojson"""
        return self.objects.annotate(geometry=AsGeoJSON("geom"))

    @classmethod
    def serializedData(cls):
        """returns all the uploads in a serialize format"""
        return serialize("geojson", cls.objects.all())

    def getCentroid(self, id=None):
        """Returns the centroid of a specified parcel"""
        if id:
            return (
                self.objects.annotate(geometry=AsGeoJSON(Centroid("geom")))
                .get(id=id)
                .geom
            )
        return self.objects.annotate(geometry=AsGeoJSON(Centroid("geom")))

    def getNearestParcels(self, id):
        """Returns the first 50 parcels with a specified parcel of land"""
        parcels = []
        parcel = self.objects.get(id=id).geom
        for parc in self.objects.annotate(distance=Distance("geom", parcel)):
            parcels.append(parc.distance)
        return sorted(parcels[:50])

    @property
    def popup_content(self):
        popup = "<span>Parcel ID   :  </span>{}".format(self.id)
        popup += "<span>Owner      :  </span>{}".format(self.owner)
        popup += "<span>Perimeter  :  </span>{}".format(self.perimeter)
        popup += "<span>Area (m)   :  </span>{}".format(self.area_ha)
        popup += "<span>Plot Number:  </span>{}".format(self.lr_no)
        popup += "<span>Status   :  </span>{}".format(self.status)
        return popup


# initializing the library
# db = Db(dbname='webGIS', user='postgres', password='kevoh', host='localhost', port='5432')
#
# geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')


# The shapefile model
class Shp(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000, blank=True)
    file = models.FileField(upload_to="%Y/%m/%d")
    uploaded_date = models.DateField(default=datetime.date.today, blank=True)

    def __str__(self):
        return self.name

    # @receiver(post_save, sender=Shp)
    # def publish_data(sender, instance, created, **kwargs):
    #     file = instance.file.path
    #     file_format = os.path.basename(file).split('.')[-1]
    #     file_name = os.path.basename(file).split('.')[0]
    #     file_path = os.path.dirname(file)
    #     name = instance.name
    #     conn_str = 'postgresql://postgres:kevoh@localhost:5432/webGIS'
    #
    #     # extract zipfile
    #     with zipfile.ZipFile(file, 'r') as zip_ref:
    #         zip_ref.extractall(file_path)
    #
    #     os.remove(file)  # remove zip file
    #
    #     shp = glob.glob(r'{}/**/*.shp'.format(file_path),
    #                     recursive=True)  # to get shp
    #     try:
    #         req_shp = shp[0]
    #         gdf = gpd.read_file(req_shp)  # make geodataframe
    #
    #         crs_name = str(gdf.crs.srs)
    #
    #         epsg = int(crs_name.replace('epsg:', ''))
    #
    #         if epsg is None:
    #             epsg = 4326  # wgs 84 coordinate system
    #
    #         geom_type = gdf.geom_type[1]
    #
    #         engine = create_engine(conn_str)  # create the SQLAlchemy's engine to use
    #
    #         gdf['geom'] = gdf['geometry'].apply(lambda x: WKTElement(x.wkt, srid=epsg))
    #
    #         # Drop the geometry column (since we already backup this column with geom)
    #         gdf.drop('geometry', 1, inplace=True)
    #
    #         gdf.to_sql(name, engine, 'data', if_exists='replace',
    #                    index=False, dtype={'geom': Geometry('Geometry', srid=epsg)})  # post gdf to the postgresql
    #
    #         for s in shp:
    #             os.remove(s)
    #
    #     except Exception as e:
    #         for s in shp:
    #             os.remove(s)
    #
    #         instance.delete()
    #         print("There is problem during shp upload: ", e)

    """
    Publish shp to geoserver using geoserver-rest
    """
    # geo.create_featurestore(store_name='geoApp', workspace='geoapp', db='webGIS',
    #                         host='localhost', pg_user='postgres', pg_password='kevoh', schema='public')
    # geo.publish_featurestore(
    #     workspace='geoapp', store_name='geoApp', pg_table=name)
    #
    # geo.create_outline_featurestyle('geoApp_shp', workspace='geoapp')
    #
    # geo.publish_style(layer_name=name, style_name='geoApp_shp', workspace='geoapp')


# @receiver(post_delete, sender=Shp)
# def delete_data(sender, instance, **kwargs):
#     db.delete_table(table_name=instance.name, schema='data', dbname='webGIS')
#     geo.delete_layer(instance.name, 'webGIS')
