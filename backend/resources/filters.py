import geojson
import requests
from django_filters import filters
from django_filters import rest_framework as filters
from rest_framework_gis.filters import GeoFilterSet, GeometryFilter
from .models import SubLocations, Locations, SubCounties, Nairobi


# class RegionFilter(GeoFilterSet):
# slug = filters.CharFilter(name='slug', lookup_expr='istartswith')
# contains_geom = GeometryFilter(name='geom', lookup_expr='contains')


class SubLocationFilter(GeoFilterSet):
    sublocation = filters.CharFilter(method="get_parcel_by_location", lookup_expr="within")

    class Meta:
        model = Locations
        exclude = ["geom"]

    def sub_location_within_location(self, queryset, name, value):
        filtered_boundary = Locations.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_location

    def sub_location_within_subcounty(self, queryset, name, value):
        filtered_boundary = SubCounties.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_location


class LocationFilter(GeoFilterSet):
    location = filters.CharFilter(method="get_parcel_by_location", lookup_expr="within")

    class Meta:
        model = Locations
        exclude = ["geom"]

    def get_parcel_by_location(self, queryset, name, value):
        filtered_boundary = Locations.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_location


class SubCountiesFilter(GeoFilterSet):
    name = filters.CharFilter(name='name', lookup_expr='istartswith')
    # contains_geom = GeometryFilter(name='geom', lookup_expr='contains')
    subcounty = filters.CharFilter(method="get_parcel_by_subcounties", lookup_expr="within")

    class Meta:
        model = SubCounties
        exclude = ["geom"]

    def get_parcel_by_sub_county(self, queryset, name, value):
        filtered_boundary = SubCounties.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_subcounty = queryset.filter(geom__within=boundary.geom)
            return parcel_in_subcounty


class CountiesFilter(GeoFilterSet):
    county = filters.CharFilter(method="get_parcel_by_sublocation", lookup_expr="within")

    class Meta:
        model = Nairobi
        exclude = ["geom"]

    def get_parcel_by_county(self, queryset, name, value):
        filtered_boundary = Counties.objects.filter(pk=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_county = queryset.filter(geom__within=boundary.geom)
            return parcel_in_county
