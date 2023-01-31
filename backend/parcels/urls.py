from django.urls import path
from django.views.generic import TemplateView
from djgeojson.views import GeoJSONLayerView

from . import views
from .models import Parcels

from rest_framework.routers import DefaultRouter


router = DefaultRouter()

router.register("api", viewset=views.ParcelsViewSet, basename="parcels")
# router.register("api/<str:pk>/", viewset=views.ParcelsViewSet, basename="parcels_filter")


urlpatterns = [
    # path('wms_get_capabilities/', views.WmsGetCapabilitiesView.as_view(), name='wfs_get_capabilities'),
    path('get_capabilities/', views.get_capabilities, name='get_capabilities'),

    path(
        "data/",
        GeoJSONLayerView.as_view(
            model=Parcels,
            properties=("gid", "owner", "plotno", "areah", "perm", "lrnumber"),
        ),
        name="data",
    ),
    path("allParcels/", views.allParcels, name="allParcels"),
    path("draw/", views.drawShape, name="drawShape"),
    path("wfs/", views.getWFS, name="wfs"),
    path("uploadShape/", views.uploadShape, name="uploadShape"),
    # path('centroids/', views.get_points, name='distance'),
    path("json/", views.parcels, name="json_parcels"),
    path("property/", views.my_property, name="map"),
    path("search/", views.search_parcels, name="search"),
    path("distance/", views.parcels_within_3km, name="distance"),
    # path('distance/', views.my_parcels, name='distance'),
    path("distance2/", views.calculate_distance_view, name="distance2"),
    path(
        "naiPlots/",
        TemplateView.as_view(template_name="parcels/parcels.html"),
        name="rundamap",
    ),
    path(
        "maps/",
        TemplateView.as_view(template_name="parcels/parcel2.html"),
        name="parcels",
    ),
    # path('', TemplateView.as_view(template_name='parcels/webMap.html'), name='web'),
]

urlpatterns += router.urls
