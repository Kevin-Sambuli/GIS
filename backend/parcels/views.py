import json
import os

import folium
import geojson
import xmltodict
from django.contrib.gis.db.models.functions import AsGeoJSON, Centroid, Distance
from django.contrib.gis.geos import GEOSGeometry, MultiPolygon, Polygon, fromstr
from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.template.loader import get_template

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models import Sum, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_gis.pagination import GeoJsonPagination

from .serializers import ParcelSerializer
from .filters import ParcelsFilter

# from geopy.distance import geodesic
from .database import get_cursor
from .filters import parcelJson, wfsRequest
from .map import my_map
from .models import Parcels, Uploads  # ParcelDetails,
from .utils import get_center_coordinates, get_geo, get_ip_address, get_zoom

# from geopy.geocoders import Nominatim


# getting the cursor from the database connection
cur = get_cursor()

# ('SRID=4326;MULTIPOLYGON(((36.32080078125 -0.10986328125,36.4306640625 '
#  '-1.142578125,38.73779296875 -1.6259765625,38.29833984375 '
#  '0.15380859375,36.32080078125 -0.10986328125)))')


""" upload shapefile in postgis
# ogr2ogr -f “PostgreSQL” PG:”host=<hostname>  dbname=<dbname> user=<yourusername>
# password=<yourpassword>” <dir>\yourdatafile.shp -lco SCHEMA=foo

# shp2pgsql -s <SRID> -c -D -I <path to shapefile> <schema>.<table> |  psql -d <databasename> -h <hostname> -U <username>


This query returns the nearest five observations from the plants table, based on distance to a specific point [34.810696, 31.895923]
SELECT areah, perm, aream, ownerid, ST_AsText(geom) AS the_geom 
  FROM nairobi 
  ORDER BY 
    geom::geography <->
    ST_SetSRID(
      ST_MakePoint(34.810696, -1.3455), 4326
    )::geography
  LIMIT 5;
  
  
  from rest_framework import generics
from .models import Hotel

from django.contrib.gis.geos import Point
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="location")


class ListCreateGenericViews(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def perform_create(self, serializer):
        address = serializer.initial_data["address"]
        g = geolocator.geocode(address)
        lat = g.latitude
        lng = g.longitude
        pnt = Point(lng, lat)
        print(pnt)
        serializer.save(location=pnt)


class HotelUpdateRetreiveView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def perform_update(self, serializer):
        address = serializer.initial_data["address"]
        g = geolocator.geocode(address)
        lat = g.latitude
        lng = g.longitude
        pnt = Point(lng, lat)
        print(pnt)
        serializer.save(location=pnt)
        
        
 https://pganalyze.com/blog/geodjango-postgis

class Bank(models.Model):
    name = models.CharField(max_length=20)
    address = models.CharField(max_length=128)
    zip_code = models.CharField(max_length=5)
    poly = models.PolygonField()

    def __str__(self):
        return self.name
To store data on such a field with GEOSGeometry, you can run the following:

>>> from app.models import Bank
>>> from django.contrib.gis.geos import GEOSGeometry
>>> polygon = GEOSGeometry('POLYGON ((-98.503358 29.335668, -98.503086 29.335668, -98.503086 29.335423, -98.503358 29.335423, -98.503358 29.335668))', srid=4326)
>>> bank = Bank(name='Suntrust Bank', address='144 Monsourd Blvd, San Antonio Texas, USA',zip_code='78221', poly=polygon)
>>> bank.save()
 
 CREATE EXTENSION postgis_raster;
 
 from django.contrib.gis.db import models

class Elevation(models.Model):
    name = models.CharField(max_length=100)
    rast = models.RasterField()
           
>>> from django.contrib.gis.gdal import GDALRaster
>>> rast = GDALRaster('/path/to/raster/raster.tif', write=True)
>>> rast.name
/path/to/raster/raster.tif

>>> rast.width, rast.height # this file has 163 by 174 pixels
(163, 174)

>>> topography = Elevation(name='Mount Fuji', rast=rast)
>>> topography.save()


A new raster can also be created using raw data from a Python dictionary containing the parameters scale, size, origin, and srid. Below, you can see how to define a new raster that describes a canyon with a width and height of 10 pixels and bands which represent a single layer of data in the raster:

>>> rst = GDALRaster({'width': 10, 'height': 10, 'name': 'canyon', 'srid': 4326, 'bands': [{"data": range(100)}]})
>>> rst.name
'canyon'
>>> topography = Elevation(name='Mount Fuji', rast=rst)
>>> topography.save()

class Country(models.Model):
    name = models.CharField(max_length=50)
    region = models.IntegerField('Region Code')
    subregion = models.IntegerField('Sub-Region Code')
    lon = models.FloatField()
    lat = models.FloatField()
    mpoly = models.MultiPolygonField()

    # Returns the string representation of the model.
    def __str__(self):
        return self.name 
Country represents a table that stores the boundaries of world countries. Next, you can use GeoDjango to check if a particular Point coordinate is stored in a mpoly field in one of the countries in the database:

>>> from app.models import Country
>>> from django.contrib.gis.geos import Point
>>> point = Point(954158.1, 4215137.1, srid=32140)
>>> Country.objects.filter(mpoly__contains=point)
<QuerySet [<Country: United States>]>
You can also do a spatial lookup to determine if a point is inside a particular country. Run the code below to define a Point object that represents a location in Valdagrone, San Marino. Then, you can search for this Point using the contains method:

>>> san_marino = Country.objects.get(name='San Marino')
>>> pnt = Point(12.4604, 43.9420) # Valdagrone, San Marino
>>> san_marino.mpoly.contains(pnt)
True

>>> san_marino = Country.objects.get(name='San Marino')
>>> pnt = Point(12.4604, 43.9420) # Valdagrone, San Marino
>>> san_marino.mpoly.contains(pnt)
True

>>> from django.contrib.gis.geos import GEOSGeometry
>>> point1 = GEOSGeometry('SRID=4326;POINT(-167.8522796630859 65.55173492431641)').transform(900913, clone=True) # Tin City, Alaska
>>> point2 = GEOSGeometry('SRID=4326;POINT(-165.4089813232422 64.50033569335938)').transform(900913, clone=True) # Nome, Alaska
>>> distance = point1.distance(point2) # in meters
>>> distance / 1000 # in Kilometers
388.3890308954561

>>> from app.models import Cities
>>> pt_hope = Cities.objects.get(name='Point Hope')
>>> pt_lay = Cities.objects.get(name='Point Lay')
>>> pt_hope_meters = pt_hope.the_geom.transform(900913, clone=True)
>>> pt_lay_meters = pt_lay.the_geom.transform(900913, clone=True)
>>> pt_hope_meters.distance(pt_lay_meters)
594946.4349305361
GeoDjango also provides some distance lookup functions such as distance_lt, distance_lte, distance_gt, distance_gte and dwithin. For example:

>>> from django.contrib.gis.geos import Point
>>> from django.contrib.gis.measure import D
>>> pnt = Point(-163.0928955078125, 69.72028350830078) # Point Lay
>>> dist = Cities.objects.filter(the_geom__distance_lte=(pnt, D(km=7))) # find all cities within 7 kilometers of Point Lay
>>> dist = Cities.objects.filter(the_geom__distance_gte=(pnt, D(mi=20))) # find all cities greater than o
"""


# def get_queryset(self):
#     user = self.request.user
#     return user.accounts.all()

# p = Polygon()
# # this seems to work correctly
# mp = MultiPolygon(fromstr(str(p)),)
#
# model1.geom_field = mp
#
# model1.save()

# polygonlist = [GEOSGeometry(json.dumps(feature["geometry"])) for feature in  payload["features"]]
# mpoly = MultiPolygon(*polygonlist)
# rows = SampleEntity.objects.filter(point__within=mpoly )

# ALTER TABLE myapp_region
#     ALTER COLUMN polygon TYPE geometry(MultiPolygon, 4326)
#     USING ST_Multi(polygon);


# operations = [
#     migrations.RunSQL(
#         "ALTER TABLE myapp_region ALTER COLUMN polygon type geometry(MultiPolygon, 4326) using ST_Multi(polygon);",
#         state_operations=[
#             migrations.AlterField(
#                 model_name='region',
#                 name='polygon',
#                 field=django.contrib.gis.db.models.fields.MultiPolygonField(
#                     srid=4326),
#             ),
#         ],
#     )
# ]


# SELECT ST_AsText(ST_Multi(ST_GeomFromText('POLYGON((743238 2967416,743238 2967450,
#         743265 2967450,743265.625 2967416,743238 2967416))')));
#         st_astext
#         --------------------------------------------------------------------------------------------------
#         MULTIPOLYGON(((743238 2967416,743238 2967450,743265 2967450,743265.625 2967416,
#         743238 2967416)))
#         (1 row)

# INSERT INTO beer_sheva (the_geom, description, name) VALUES (
#   ST_SetSRID(
#     ST_GeomFromGeoJSON(
#       '{"type":"Point","coordinates":[34.838848,31.296301]}'
#     ),
#   4326
#   ),
#   'Point 1',
#   'Michael'
# );


# Survey.objects.filter(pk=survey.pk).update(active=True)
# get_name = UserInfo.objects.filter(owner=user).update(username='your data')

# u = User.objects.get(id=1)
# u.last_seen = timezone.now()
# u = User.objects.get(id=1)
# u.last_seen

# def get_points(request):
#     cur1 = get_cursor()  # first database connection instance
#     cur2 = get_cursor()  # second database connection instance
#
#     parcels_cent = Parcels.objects.annotate(geometry=AsGeoJSON(Centroid('geom')))
#     data = []
#     for parcel in parcels_cent:
#         data.append(parcel)
#     print(data)  # [ < Parcels: LR12872 / 26 >, < Parcels: LR12872 / 24 >, < Parcels: LR12872 / 23 >, ]
#
#     for dat in data:
#         print(dat.geometry)
#         """ ill use zip function to combine the list of coordinates"""
#
#     # ST_X(ST_Centroid(a.the_geom)) and ST_Y(ST_Centroid(a.the_geom))
#
#     # return parcel data in geojson format
#     query1 = ('SELECT jsonb_build_object FROM public.parcels_json;')
#     cur1.execute(query1)
#
#     # return the centroids of all parcels
#     query2 = ('SELECT jsonb_build_object FROM public.centroids_json;')
#     cur2.execute(query2)
#
#     centroids = cur2.fetchall()
#     centroids_json = centroids[0][0]
#     return JsonResponse(centroids_json)


class ParcelsViewSet(viewsets.ModelViewSet):
    queryset = Parcels.objects.all()
    serializer_class = ParcelSerializer
    permission_classes = [permissions.AllowAny]
    filter_class = ParcelsFilter
    # pagination_class = GeoJsonPagination
    filter_backends = (DjangoFilterBackend,)

    @action(detail=False, methods=["get"])
    def total_parcels(self, request):
        # total_parcels = Parcels.objects.aggregate(total_parcels=Sum("id"))
        total_parcels = Parcels.objects.aggregate(total_parcels=Count("id"))
        return Response(total_parcels)

    # def get_queryset(self):
    # filter agaisnt the logged in user
    # user = self.request.user
    # return Parcels.objects.filter(owner=user)
    #
    # # filter based on url parameters
    # slug = self.kwargs['pk']
    # # router.register("api/<str:pk>/", viewset=views.ParcelsViewSet, basename="parcels_filter")
    # return Parcels.objects.filter(id=slug)
    #
    # # filter based on query parameters using retrieve api
    # # /?name=Westlands
    # slug = self.request.query_params.get('name', None)
    # return Parcels.objects.filter(id=slug)

    # @action(detail=False, methods=["get"])
    # def myparcels(self, request):
    #     my_parcels = Parcels.objects.values("owner").annotate(parcels=Sum("beds"))
    #     return Response(my_parcels)

    @action(detail=False, methods=["get"])
    def closest_parcels(self, request):
        """Get Hospitals that are at least 3km or less from a users location
        http://localhost:8001/parcels/api/closest_parcels/?lon=36.724&lat=-1.272
        """
        longitude = request.GET.get("lon", None)
        latitude = request.GET.get("lat", None)

        if longitude and latitude:
            user_location = Point(float(longitude), float(latitude), srid=4326)
            closest_parcels = Parcels.objects.filter(geom__distance_lte=(user_location, D(km=3)))
            serializer = self.get_serializer_class()
            serialized_parcels = serializer(closest_parcels, many=True)
            return Response(serialized_parcels.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def parcels_within_mouse_click(self, request):
        """Get Hospitals that are at least 3km or less from a users location"""
        longitude = request.GET.get("lon", None)
        latitude = request.GET.get("lat", None)

        if longitude and latitude:
            user_location = Point(float(longitude), float(latitude), srid=4326)
            closest_hospitals = Parcels.objects.filter(geom__distance_lte=(user_location, D(km=3)))
            serializer = self.get_serializer_class()
            serialized_hospitals = serializer(closest_hospitals, many=True)
            return Response(serialized_hospitals.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


def parcels(request):
    """ function that returns parcels in geojson and generate a folium leaflet map """

    # return JsonResponse(geojson.dumps(data))

    points_as_geojson = serialize("geojson", Parcels.objects.all())
    # data = serialize('geojson', Parcels.objects.all()[:200])
    return HttpResponse(points_as_geojson, content_type="json")


def allParcels(request):
    """calling the function that returns all the parcels from the database"""
    data = parcelJson(table_name='parcels')
    cur.execute(data)

    plots = cur.fetchall()
    nairobiPlots = geojson.dumps(plots[0][0])

    return HttpResponse(nairobiPlots, content_type="json")


def my_property(request):
    """function that returns parcels of the logged in user  generate a folium leaflet map"""
    context = {}
    parcels_as_geojson = serialize("geojson", Parcels.objects.all())

    try:
        # returning my parcels as geojson to be passed on the map as objects
        my_parcel = serialize(
            "geojson", Parcels.objects.filter(owner_id=request.user.id)
        )
        print("my parcels geojson", my_parcel)

        # accessing parcels of the logged user
        my_own_parcels = Parcels.objects.filter(owner_id=request.user.id)
        # Parcels.objects.filter(owner_id=request.user.id).update(owner_id=1)
        print("my parcels", my_own_parcels)

        #  getting each parcel details
        """
        details = [ParcelDetails.objects.get(parcel=parcel_id) for parcel_id in my_own_parcels]
        """
        # details = [ParcelDetails.objects.get(parcel=parcel_id) for parcel_id in
        #            Parcels.objects.filter(owner_id=request.user.id).values_list('id', flat=True)]
        # print("details", details)

        # accessing each parcel detail and returning each parcel id
        # data = [det for det in Parcels.objects.filter(owner_id=request.user.id).values_list('id', flat=True)]

        # m = my_map(land_parcels=nairobi, parcel=my_parcel)
        m = my_map(land_parcels=parcels_as_geojson, parcel=my_parcel)
        print(" return m")
        m = m._repr_html_()

        context["map"] = m
        # context['details'] = details
        context["parcels"] = my_own_parcels

    except:
        print("You dont own parcels in the system")
        m = my_map(land_parcels=parcels_as_geojson)
        m = m._repr_html_()
        context["map"] = m

    return render(request, "parcels/map.html", context)


from django.http import HttpResponse
import requests

# from rest_framework.views import APIView
# from rest_framework_xml.parsers import XMLParser
# from rest_framework_xml.renderers import XMLRenderer
#
# class WmsGetCapabilitiesView(APIView):
#     # using drf-xml to render the xml
#     # renderer_classes = [XMLRenderer]
#
#     # authentication_classes = [authentication.TokenAuthentication]
#     # permission_classes = [permissions.IsAdminUser]
#
#     def get(self, request):
#         geoserver_url = "http://geospatialdev.com/geoserver/data/wfs?service=wms&version=1.1.0&request=GetCapabilities"
#         response = requests.get(geoserver_url)

#         # return Response(response.content)

def get_capabilities(request):
    geoserver_url = "http://geospatialdev.com/geoserver/data/wfs?service=wfs&version=1.1.0&request=GetCapabilities"
    # geoserver_url = "http://geospatialdev.com/geoserver/data/wms?service=wms&version=1.3.0&request=GetCapabilities"
    auth = ("kevoh", "kevoh1995")
    response = requests.get(geoserver_url, auth=auth)

    # parse the response to xmltodict
    xml_dict = xmltodict.parse(response.content) # print(xml_dict)

    # Convert the dictionary to JSON
    json_response = json.dumps(xml_dict) # print(json_response)

    # return HttpResponse(json_response, content_type="application/json")

    return HttpResponse(response.content, content_type="application/xml")


def uploadShape(request):
    context = {}
    if request.method == "POST":
        # export PGPASSWORD = mydatabasepassword

        # shp2pgsql -D -I -s 4326 -W "utf-8" plots2.shp plot | psql -d Ardhi -U postgres -h localhost -p 5432

        # The D flag tells the program to generate “dump format” which is much faster to load than the default “insert format”.

        # The I flag tells the program to create a spatial index on the table after loading is complete.

        # The s flag tells the program what the “spatial reference identifier (SRID)” of the data is.

        # name = request.POST['firstname']
        print("processing data")

    return render(request, "parcels/webmap.html", context)


def drawShape(request):
    """the view takes in data from ajax and decodes using json for  texts values
    and geojson to decode polygon string
    """
    context = {}

    # request should be ajax and method should be POST.
    if request.is_ajax() and request.method == "POST":
        parcel = json.loads(request.POST.get("lrnumber"))
        plot = json.loads(request.POST.get("plotno"))
        polygon = geojson.loads(request.POST.get("polygon"))
        pols = Polygon(polygon.coordinates[0])

        print(parcel, plot, polygon, pols)

        # upload = Uploads(lrnumber=parcel, areah=1233, perm=1323, plotno=plot, geom=pols)
        # upload.save()

        context["plot"] = plot
        context["parcel"] = parcel
    return render(request, "parcels/webmap.html", context)


def getWFS(request):
    if request.is_ajax and request.method == "GET":
        # queryValue = json.loads(request.GET.get("cql"))
        queryValue = request.GET.get("cql")

        # queryValue='m'

        if queryValue:
            wfs = wfsRequest(queryValue)
            return JsonResponse(wfs)
        else:
            wfs = wfsRequest()
            return JsonResponse(wfs)


def getWMS(request):
    if request.method == "GET":
        print("wms")

    # return JsonResponse(wms)


def search_parcels(request):
    """function that returns parcels in geojson and generate a folium leaflet map

    returning the centroid of the searched parcel calculate the distance to that point

    should also return the parcel details of that parcel and produce the pdf of the parcel, map, and parcel details"""
    context = {}
    points_as_geojson = serialize("geojson", Parcels.objects.all())

    ids = 84

    # parcels search and returning the centroid then placed on the map
    try:
        parcel = serialize("geojson", Parcels.objects.filter(owner_id=request.user.id))

        print(parcel)

        # accessing each parcel detail and returning each parcel id
        parcel_id = list(
            Parcels.objects.filter(owner_id=request.user.id).values_list(
                "gid", flat=True
            )
        )
        details = [
            det
            for det in list(
                Parcels.objects.filter(owner_id=request.user.id).values_list(
                    "id", flat=True
                )
            )
        ]

        # qu.execute('select ST_AsText(ST_Centroid(geom) ) FROM parcels;')# where id=84;')
        cur.execute(
            f"select ST_AsText(ST_Centroid(geom) ) FROM parcels where gid={ids};"
        )
        mmap = cur.fetchall()
        # if mmap:
        print("map =", mmap)
        print("point", str(mmap[0][0]))

        # creating the geos point object
        pnt = GEOSGeometry(str(mmap[0][0]), srid=4326)
        print("geos point object", pnt)

        print("tuple of coordinates =", pnt.coords)
        print("list of coordinates =", list(pnt.coords))

        pins = list(pnt.coords)
        pin1, pin2 = float(pins[0]), float(pins[1])
        print("lng =", pin1, "lat =", pin2)

        # Generating folium leaflet map using my_map function
        m = my_map(
            land_parcels=points_as_geojson,
            parcel=parcel,
            lng=pnt.coords[0],
            lat=pnt.coords[1],
        )
        m = m._repr_html_()
        context["map"] = m
    except:
        print("the parcel does not exist")

        m = my_map(land_parcels=points_as_geojson)
        m = m._repr_html_()
        context["map"] = m

    return render(request, "parcels/map.html", context)


def parcels_within_3km(request):
    """Get parcels that are at least 3km or less from a users location"""
    pol = serialize(
        "geojson", Parcels.objects.annotate(geometry=AsGeoJSON(Centroid("geom")))
    )
    # # parcel = Parcels.objects.annotate(geometry=Centroid('geom'))

    parcels = (
        Parcels.objects.annotate(geometry=AsGeoJSON(Centroid("geom"))).get(id=84).geom
    )
    data1 = []
    for parc in Parcels.objects.annotate(
            geometry=AsGeoJSON(Centroid("geom")), distance=Distance("geom", parcels)
    ):
        print(parc.lrnumber, parc.distance)
        data1.append(parc.distance)

    ip = get_ip_address(request)

    print("distance 1", sorted(data1))
    print("ip address", ip)

    # parcels = Parcels.objects.annotate(geometry=AsGeoJSON(Centroid('geom'))).get(id=84).geom
    parcels = Parcels.objects.get(id=84).geom
    data2 = []

    for parc in Parcels.objects.annotate(distance=Distance("geom", parcels)):
        data2.append(parc.distance)

    sorted(data2)
    print("distance 2", data2[:10])

    return HttpResponse(pol, content_type="json")


def calculate_distance_view(request):
    # initial values
    distance = None
    destination = None

    # obj = get_object_or_404(Measurement, id=1)
    # form = MeasurementModelForm(request.POST or None)

    geolocator = Nominatim(user_agent="parcels")

    ip = "41.80.98.237"
    country, city, lat, lon = get_geo(ip)
    print("country", country)
    print("city", city)
    print("lat", lat)
    print("lng", lon)
    location = geolocator.geocode(city)

    # location coordinates
    l_lat = lat
    l_lon = lon
    pointA = (l_lat, l_lon)

    # initial folium map
    m = folium.Map(
        width=800,
        height=500,
        location=get_center_coordinates(l_lat, l_lon),
        zoom_start=8,
    )
    # location marker
    folium.Marker(
        [l_lat, l_lon],
        tooltip="click here for more",
        popup=city["city"],
        icon=folium.Icon(color="purple"),
    ).add_to(m)

    # if form.is_valid():
    #     instance = form.save(commit=False)
    #     destination_ = form.cleaned_data.get('destination')
    #     destination = geolocator.geocode(destination_)
    #
    #     # destination coordinates
    #     d_lat = destination.latitude
    #     d_lon = destination.longitude
    #     pointB = (d_lat, d_lon)
    #     # distance calculation
    #     distance = round(geodesic(pointA, pointB).km, 2)
    #
    #     # folium map modification
    #     m = folium.Map(width=800, height=500, location=get_center_coordinates(l_lat, l_lon, d_lat, d_lon),
    #                    zoom_start=get_zoom(distance))
    #     # location marker
    #     folium.Marker([l_lat, l_lon], tooltip='click here for more', popup=city['city'],
    #                   icon=folium.Icon(color='purple')).add_to(m)
    #     # destination marker
    #     folium.Marker([d_lat, d_lon], tooltip='click here for more', popup=destination,
    #                   icon=folium.Icon(color='red', icon='cloud')).add_to(m)
    #
    #     # draw the line between location and destination
    #     line = folium.PolyLine(locations=[pointA, pointB], weight=5, color='blue')
    #     m.add_child(line)
    #
    #     instance.location = location
    #     instance.distance = distance
    #     instance.save()
    #
    # m = m._repr_html_()
    #
    # context = {
    #     'distance': distance,
    #     'destination': destination,
    #     'form': form,
    #     'map': m,
    # }

    return HttpResponse("printed")
    # return render(request, 'measurements/main.html', context)

    # longitude = request.GET.get("lon", None)
    # latitude = request.GET.get("lat", None)

    # if longitude and latitude:
    #     user_location = Point(float(longitude), float(latitude), srid=4326)
    #     closest_parcels = Parcels.objects.filter(geom__distance_lte=(user_location, D(km=3)))
    #     parcels= serialize('geojson', Parcels.objects.filter(geom__distance_lte=(user_location, D(km=3))))

    #     return HttpResponse(parcels, content_type='json')

    #     serializer = self.get_serializer_class()
    #     serialized_hospitals = serializer(closest_hospitals, many=True)
    #     return Response(serialized_hospitals.data, status=status.HTTP_200_OK)
    # return Response(status=status.HTTP_400_BAD_REQUEST)
