import geojson
import requests

from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework_gis.filterset import GeoFilterSet
from rest_framework_gis.filters import GeometryFilter, InBBoxFilter

from .models import Parcels, Uploads
from resources.models import SubLocations, Locations, SubCounties, Nairobi

# class ParcelsFilter(GeoFilterSet, generics.ListAPIView):
class ParcelsFilter(GeoFilterSet):
    subcounty = filters.CharFilter(method="get_parcel_by_sub_county", lookup_expr="within")
    location = filters.CharFilter(method="get_parcel_by_location", lookup_expr="within")
    sublocation = filters.CharFilter(method="get_parcel_by_sub_location", lookup_expr="within")

    # min_price = filters.NumberFilter(field_name="price", lookup_expr='gte')
    # max_price = filters.NumberFilter(field_name="price", lookup_expr='lte')
    # slug = filters.CharFilter(name='name', lookup_expr='istartswith')
    # contains_geom = GeometryFilter(name='geom', lookup_expr='contains')

    # /region/?contains_geom={ "type": "Point", "coordinates": [ -123.26436996459961, 44.564178042345375 ] }

    class Meta:
        model = Parcels
        exclude = ["geom"]

    # def my_parcels(self, queryset, name, value):
    #     filtered_boundary = SubCounties.objects.filter(name=value)
    #     # filtered_boundary = SubCounties.objects.filter(name=value)
    #     if filtered_boundary:
    #         boundary = filtered_boundary.first()
    #         parcel_in_subcounty = queryset.filter(geom__within=boundary.geom)
    #         return parcel_in_subcounty

    # def get_queryset(self):
    #     user = self.request.user
    #     return Parcels.objects.filter(owner_id=user)


    def get_parcel_by_sub_county(self, queryset, name, value):
        filtered_boundary = SubCounties.objects.filter(name=value)
        if filtered_boundary:
            boundary = filtered_boundary.first()
            parcel_in_subcounty = queryset.filter(geom__within=boundary.geom)
            return parcel_in_subcounty

    def get_parcel_by_location(self, queryset, name, value):
        location_boundary = Locations.objects.filter(name=value)
        if location_boundary:
            boundary = location_boundary.first()
            parcel_in_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_location

    def get_parcel_by_sub_location(self, queryset, name, value):
        sub_location = SubLocations.objects.filter(name=value)
        if sub_location:
            boundary = sub_location.first()
            parcel_in_sub_location = queryset.filter(geom__within=boundary.geom)
            return parcel_in_sub_location


# class LocationList(ListAPIView):
#
#     queryset = models.Location.objects.all()
#     serializer_class = serializers.LocationSerializer
#     bbox_filter_field = 'point'
#     filter_backends = (InBBoxFilter,)
#     bbox_filter_include_overlapping = True # Optional




def parcelJson(table_name=None):
    # SELECT jsonb_build_object FROM public."parcelView";
    query1 = ('SELECT jsonb_build_object FROM public.parcels_geojson;')

    # cur.execute(query1)

    # parcels = cur.fetchall()
    # parcels = parcels[0][0]

    # SELECT jsonb_build_object FROM public."parcelView";
    # query1 = ('SELECT jsonb_build_object FROM public.parcelView;')

    return f"""
        SELECT jsonb_build_object(
            'type','FeatureCollection',
            'features', jsonb_agg(features.feature)
            )
              FROM (
                  SELECT jsonb_build_object(
                  'type','Feature',
                  'geometry', ST_AsGeoJSON(geom)::jsonb,
                  'properties',to_jsonb(inputs)  -'geom')
              AS feature, 'geometry'
              FROM (
              SELECT * FROM {table_name}
              ) inputs
            ) features;
        """


def myParcels(table=None, owner_id=None):
    """Create a quuery that returns GeoJSON data from parcels data in PostGIS."""
    # TODO: ensure this query is secured from SQL injection
    # by using a psycopg2 parameterized query

    # TODO: determine how best to allow WHERE clause
    # to filter based on fclass and possibly geometry.
    return f"""
            SELECT jsonb_build_object(
                'type','FeatureCollection',
                'features', jsonb_agg(features.feature)
            )
            FROM ( 
                SELECT jsonb_build_object( 
                    'type','Feature',
                    'geometry', ST_AsGeoJSON(geom)::jsonb,
                    'properties',  to_jsonb(inputs)  -'geom'
                ) 
                AS feature, 'geometry' 
                    FROM (
                        SELECT * FROM {table} 
                            where owner_id ={owner_id}
                        ) inputs
                    ) features;
                """


def wfsRequest(queryValue=None):
    url = "http://localhost:8080/geoserver/kenya/wfs"
    auth = ("admin", "geoserver")
    queryValue = 'N'

    # if queryValue:
    #     cqlFilter = "countyname='" + queryValue + "' or " + "countyname LIKE '" + queryValue + "%'"
    #
    #     params = dict(
    #         service="WFS",
    #         version="2.0.0",
    #         request="GetFeature",
    #         typeName="kenya:counties",
    #         cql_filter=cqlFilter,
    #         srsname="EPSG:4326",
    #         outputFormat="json",
    #         encoding="utf-8",
    #     )
    #
    #     r = requests.get(url, auth=auth, params=params)
    #
    #     print(geojson.loads(r.content))
    #
    #     return geojson.loads(r.content)

    params = dict(
        service="WFS",
        version="2.0.0",
        request="GetFeature",
        typeName="kenya:counties",
        srsname="EPSG:4326",
        outputFormat="json",
        encoding="utf-8",
    )

    r = requests.get(url, auth=auth, params=params)

    return geojson.loads(r.content)
