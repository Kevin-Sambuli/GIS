from django.urls import path

from . import views

# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
#
# router.register("api", viewset=views.ParcelsViewSet, basename="parcels")

from django.urls import path
# from .views import WmsGetCapabilitiesView, wmsGetCapabilitiesView


urlpatterns = [
    # path('wfs_get_capabilities/', WfsGetCapabilitiesView.as_view(), name='wfs_get_capabilities'),
    # path('wms_get_capabilities/', WmsGetCapabilitiesView.as_view(), name='wfs_get_capabilities'),
    path('wfs_get_capabilities/', views.wfsGetCapabilities, name='wfs_get_capabilities'),
    path('wms_get_capabilities/', views.wmsGetCapabilities, name='wms_get_capabilities'),
]

# urlpatterns += router.urls
