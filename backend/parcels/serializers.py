from rest_framework_gis.serializers import GeoFeatureModelSerializer

from .models import Parcels, Uploads


class ParcelSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Parcels
        fields = "__all__"
        geo_field = "geom"
        id_field = False
        auto_bbox = True


class UploadSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Uploads
        fields = "__all__"
        geo_field = "geom"
