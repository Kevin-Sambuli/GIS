# from django.conf import settings
# from django.conf.urls.static import static
# from django.contrib import admin
# from django.contrib.auth import views as auth_views
# from django.urls import include, path
#
# # from .views import
# from django.views.generic import TemplateView
#
# from . import views
#
# urlpatterns = [
#     path("map_json/", views.region_map, name="map_json"),
#     path(
#         "map_leaf/", TemplateView.as_view(template_name="regions/map.html"), name="map"
#     ),
# ]


from rest_framework.routers import DefaultRouter

from .views import SubLocations

router = DefaultRouter()

router.register(prefix="api/v1/hospitals", viewset=HospitalViewSet, basename="hospital")


urlpatterns = router.urls
