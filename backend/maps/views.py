# gee
import ee # google Earth Engine
import os
import json
import folium
import geojson
import requests
import xmltodict

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import TemplateView
from django.http import HttpResponse, JsonResponse

from rest_framework.renderers import XMLRenderer

from .filters import parcelJson, wfsRequest

# Initializing google earth engine
ee.Initialize()



def create_toc(xml_response):
    # Convert the XML to a dictionary
    xml_dict = xmltodict.parse(xml_response)

    # Extract the feature types from the dictionary
    feature_types = xml_dict['wfs:WFS_Capabilities']['FeatureTypeList']['FeatureType']

    # Create an empty list to hold the TOC items
    toc_items = []

    # Iterate through the feature types
    for feature_type in feature_types:
        # Extract the name and title of the feature type
        name = feature_type['Name']['#text']
        title = feature_type['Title']['#text']

        # Create a TOC item for the feature type
        toc_item = {'name': name, 'title': title}

        # Add the TOC item to the list
        toc_items.append(toc_item)

    return toc_items


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

"""
class WfsGetCapabilitiesView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]
    
    # using drf-xml to render the xml
    renderer_classes = [XMLRenderer]
    
    def get(self, request):
        geoserver_url = "http://geospatialdev.com/geoserver/data/wfs?service=wfs&version=1.0.0&request=GetCapabilities"
        response = requests.get(geoserver_url)
        return Response(response.content, content_type="application/xml")


class WmsGetCapabilitiesView(APIView):
    # using drf-xml to render the xml
    renderer_classes = [XMLRenderer]

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        geoserver_url = "http://geospatialdev.com/geoserver/data/wms?service=wms&version=1.3.0&request=GetCapabilities"
        response = requests.get(geoserver_url)
        
        # converting the response into json 
        # json_response = xml_to_json(response.content)
        # return Response(response.content, content_type="application/json")
        
        # return Response(response.content, content_type="application/xml")
        return Response(response.content)

"""

def wmsGetCapabilities(request):
    geoserver_url = "http://geospatialdev.com/geoserver/data/wms?service=wms&version=1.3.0&request=GetCapabilities"
    response = requests.get(geoserver_url)
    return HttpResponse(response.content, content_type="application/xml")


def wfsGetCapabilities(request):
    geoserver_url = "http://geospatialdev.com/geoserver/data/wfs?service=wfs&version=1.0.0&request=GetCapabilities"
    response = requests.get(geoserver_url)
    return HttpResponse(response.content, content_type="application/xml")



def getWFS(request):
    if request.is_ajax and request.method == "GET":
        # query = request.GET.get("cql")
        query = 'nairobi'
        print(type(query))

        # wfs = wfsRequest(queryValue="Nairobi")
        # print(type(wfs))
        # wfs = wfsRequest()
        # print(wfs)
        wfs = wfsRequest(query)
        return JsonResponse(wfs)
    return HttpResponse("No search service in geoserver")



""" return HttpResponse(resized_img, content_type="image/png") """
class home(TemplateView):
    template_name = "index.html"

    # Define a method for displaying Earth Engine image tiles on a folium map.
    def get_context_data(self, **kwargs):
        figure = folium.Figure()

        # create Folium Object
        m = folium.Map(location=[28.5973518, 83.54495724], zoom_start=8)

        # add map to figure
        m.add_to(figure)

        # select the Dataset Here's used the MODIS data
        dataset = (
            ee.ImageCollection("MODIS/006/MOD13Q1")
                .filter(ee.Filter.date("2019-07-01", "2019-11-30"))
                .first()
        )
        modisndvi = dataset.select("NDVI")

        # Styling
        vis_paramsNDVI = {
            "min": 0,
            "max": 9000,
            "palette": [
                "FE8374",
                "C0E5DE",
                "3A837C",
                "034B48",
            ],
        }

        # add the map to the the folium map
        map_id_dict = ee.Image(modisndvi).getMapId(vis_paramsNDVI)

        # GEE raster data to TileLayer
        folium.raster_layers.TileLayer(
            tiles=map_id_dict["tile_fetcher"].url_format,
            attr="Google Earth Engine",
            name="NDVI",
            overlay=True,
            control=True,
        ).add_to(m)

        # add Layer control
        m.add_child(folium.LayerControl())

        # figure
        figure.render()

        # return map
        return {"map": figure}
