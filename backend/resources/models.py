# from django.db import models
import datetime

from django.conf import settings
from django.contrib.gis.db import models
from django.template.defaultfilters import date


# Create your models here.
class Nairobi(models.Model):
    code = models.FloatField()
    county = models.CharField(max_length=20)
    geom = models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = "Nairobi"
        verbose_name_plural = "Nairobi"

    def __str__(self):
        return self.county

    @property
    def popup_content(self):
        popup = "<span>County Code   :  </span>{}".format(self.code)
        popup += "<span>County Name  :  </span>{}".format(self.county)
        return popup


class SubCounties(models.Model):
    code = models.CharField(max_length=4, unique=True)
    name = models.CharField(max_length=30)
    geom = models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = "subcounties"
        verbose_name_plural = "subcounties"

    def __str__(self):
        return self.name

    @property
    def popup_content(self):
        popup = "<span>SubCounty Code   :  </span>{}".format(self.code)
        popup += "<span>SubCounty Name  :  </span>{}".format(self.name)
        return popup


class Locations(models.Model):
    code = models.CharField(max_length=8)
    name = models.CharField(max_length=30)
    geom = models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = "locations"
        verbose_name_plural = "locations"

    def __str__(self):
        return self.name

    @property
    def popup_content(self):
        popup = "<span>Location Code   :  </span>{}".format(self.code)
        popup += "<span>Location Name  :  </span>{}".format(self.name)
        return popup


class SubLocations(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=30)
    geom = models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = "sublocations"
        verbose_name_plural = "sublocations"

    def __str__(self):
        return self.name

    @property
    def popup_content(self):
        popup = "<span>Subloc Code   :  </span>{}".format(self.code)
        popup += "<span>Subloc Name  :  </span>{}".format(self.name)
        return popup
