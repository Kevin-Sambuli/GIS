from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Nairobi, Locations, SubCounties, SubLocations

# from rest_framework import serializers


class CountiesSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Nairobi
        id_field = False
        fields = "__all__"
        geo_field = "geom"
        # bbox_geo_field = 'bbox_geometry'


class SubCountiesSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = SubCounties
        fields = "__all__"
        geo_field = "geom"


class LocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Locations
        fields = "__all__"
        geo_field = "geom"


class SubLocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = SubLocations
        fields = "__all__"
        geo_field = "geom"
