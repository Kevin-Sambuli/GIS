# from ardhi.regions.models import SubLocations, Locations, SubCounties, Counties
import geojson
import requests
from django_filters import rest_framework as filters
from rest_framework_gis.filters import GeoFilterSet

from .models import Parcels

# from regions.models import SubLocations, Locations, SubCounties, Counties


from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_xml.parsers import XMLParser
from rest_framework_xml.renderers import XMLRenderer

# REST_FRAMEWORK = {
#     'DEFAULT_PARSER_CLASSES': (
#         'rest_framework_xml.parsers.XMLParser',
#     )
# }


# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ('url', 'username', 'email', 'is_staff')
#
#
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     parser_classes = (XMLParser,)
#     renderer_classes = (XMLRenderer,)


class ExampleView(APIView):
    """
    A view that can accept POST requests with XML content.
    """

    parser_classes = (XMLParser,)

    def post(self, request, format=None):
        return Response({"received data": request.DATA})

class ParcelsFilter(GeoFilterSet):
    province = filters.CharFilter(
        method="get_parcel_by_sublocation", lookup_expr="within"
    )

    class Meta:
        model = Parcels
        exclude = ["geom"]



    # def get_parcel_by_sub_county(self, queryset, name, value):
    #     filtered_boundary = SubCounties.objects.filter(pk=value)
    #     if filtered_boundary:
    #         boundary = filtered_boundary.first()
    #         parcel_in_subcounty = queryset.filter(geom__within=boundary.geom)
    #         return parcel_in_subcounty
    #
    # def get_parcel_by_county(self, queryset, name, value):
    #     filtered_boundary = Counties.objects.filter(pk=value)
    #     if filtered_boundary:
    #         boundary = filtered_boundary.first()
    #         parcel_in_county = queryset.filter(geom__within=boundary.geom)
    #         return parcel_in_county


# SELECT jsonb_build_object FROM public."parcelView";
# query1 = ('SELECT jsonb_build_object FROM public.parcels_geojson;')


# cur.execute(query1)

# parcels = cur.fetchall()
# parcels = parcels[0][0]

# SELECT jsonb_build_object FROM public."parcelView";
# query1 = ('SELECT jsonb_build_object FROM public.parcelView;')


def parcelJson():
    return """
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
              SELECT * FROM parcels
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


from rest_framework import routers, serializers, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_xml.parsers import XMLParser
from rest_framework_xml.renderers import XMLRenderer

# REST_FRAMEWORK = {
#     'DEFAULT_PARSER_CLASSES': (
#         'rest_framework_xml.parsers.XMLParser',
#     )
# }


# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = User
#         fields = ('url', 'username', 'email', 'is_staff')
#
#
# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     parser_classes = (XMLParser,)
#     renderer_classes = (XMLRenderer,)


class ExampleView(APIView):
    """
    A view that can accept POST requests with XML content.
    """

    parser_classes = (XMLParser,)

    def post(self, request, format=None):
        return Response({"received data": request.DATA})


# @api_view(['POST'])
# @parser_classes((XMLParser,))
# def example_view(request, format=None):
#     """
#     A view that can accept POST requests with XML content.
#     """
#     return Response({'received data': request.DATA})


def wfsRequest(queryValue=None):
    headers = {"content-type": "text/xml"}
    r1 = requests.post(
        "http://localhost:8080/geoserver/rest/workspaces",
        auth=("admin", "geoserver"),
        data="<workspace><name>acme</name></workspace>",
        headers=headers,
    )

    url = "http://localhost:8080/geoserver/kenya/wfs"
    auth = ("admin", "geoserver")

    if queryValue:
        # cqlFilter = "countyname='" + queryValue + "'"
        # cqlFilter = DWITHIN(GEOM,Point(-60.2 46.1),0.05,kilometers)


        cqlFilter = (
            "countyname='"
            + queryValue
            + "' or "
            + "countyname LIKE '"
            + queryValue
            + "%'"
        )
        params = dict(
            service="WFS",
            version="2.0.0",
            request="GetFeature",
            typeName="kenya:counties",
            cql_filter=cqlFilter,
            srsname="EPSG:4326",
            outputFormat="json",
            encoding="utf-8",
        )

        r = requests.get(url, auth=auth, params=params)

        return geojson.loads(r.content)

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
