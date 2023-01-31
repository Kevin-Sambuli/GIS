import json

from django.core.serializers import serialize
from django.http import HttpResponse, JsonResponse
from djgeojson.views import GeoJSONLayerView

from .map import my_map
from .models import Nairobi, Locations, SubCounties, SubLocations


from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import SubCountiesFilter, LocationFilter, SubLocationFilter
from .models import Nairobi, SubCounties, Locations, SubLocations
from .serializers import CountiesSerializer, SubCountiesSerializer, LocationSerializer, SubLocationSerializer


class SubCountiesViewSet(viewsets.ModelViewSet):
    queryset = SubCounties.objects.all()
    serializer_class = SubCountiesSerializer
    filter_class = SubCountiesFilter
    filter_backends = (DjangoFilterBackend,)

    # @action(detail=False, methods=["get"])
    # def total_bed_capacity(self, request):
    #     bed_capacity = SubCounties.objects.aggregate(bed_capacity=Sum("beds"))
    #     return Response(bed_capacity)
    #
    # @action(detail=False, methods=["get"])
    # def province_beds_capacity(self, request):
    #     province_bed_capacity = SubCounties.objects.values("name").annotate(
    #         bed_capacity=Sum("beds")
    #     )
    #     return Response(province_bed_capacity)

    @action(detail=False, methods=["get"])
    def closest_hospitals(self, request):
        """Get Sub Counties that are at least 3km or less from a users location"""
        longitude = request.GET.get("lon", None)
        latitude = request.GET.get("lat", None)

        if longitude and latitude:
            user_location = Point(float(longitude), float(latitude), srid=4326)
            closest_hospitals = SubCounties.objects.filter(geom__distance_lte=(user_location, D(km=3)))
            serializer = self.get_serializer_class()
            serialized_hospitals = serializer(closest_hospitals, many=True)
            return Response(serialized_hospitals.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)



def region_map(request):
    counties = serialize("geojson", Nairobi.objects.filter(coucode=47))
    map2 = my_map(
        counties=counties,
    )  # subcounties=subcounty, locations=locations, sublocations=subloc)
    map2.save("regions/templates/regions/map.html")

    return HttpResponse(counties, content_type="json")
