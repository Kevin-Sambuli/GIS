import geojson
import requests
from django_filters import rest_framework as filters
from rest_framework_gis.filterset import GeoFilterSet
from rest_framework_gis.filters import GeometryFilter, InBBoxFilter

from ..models import Parcels, Uploads
from .resources.models import SubLocations, Locations, SubCounties, Nairobi


class ParcelsFilter(GeoFilterSet):
    region = filters.CharFilter(method="get_parcel_by_sub_county", lookup_expr="within")
    # region = filters.CharFilter(method="get_parcel_by_sublocation", lookup_expr="within")
    # slug = filters.CharFilter(name='slug', lookup_expr='istartswith')
    # contains_geom = GeometryFilter(name='geom', lookup_expr='contains')

    class Meta:
        model = Parcels
        exclude = ["geom"]

    def get_parcel_by_sub_county(self, queryset, name, value):
        filtered_boundary = SubCounties.objects.filter(name=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_subcounty = queryset.filter(geom__within=boundary.geom)
            return parcel_in_subcounty

    def get_parcel_by_location(self, queryset, name, value):
        filtered_boundary = Locations.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_location

    def get_parcel_by_sub_location(self, queryset, name, value):
        filtered_boundary = SubLocations.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_sub_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_sub_location


# class LocationList(ListAPIView):
#
#     queryset = models.Location.objects.all()
#     serializer_class = serializers.LocationSerializer
#     bbox_filter_field = 'point'
#     filter_backends = (InBBoxFilter,)
#     bbox_filter_include_overlapping = True # Optional

