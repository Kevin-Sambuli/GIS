from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Parcels
from .serializers import ParcelSerializer


class ParcelsViewSet(viewsets.ModelViewSet):
    queryset = Parcels.objects.all()
    serializer_class = ParcelSerializer
    permission_classes = [permissions.AllowAny]
    # filter_class = HospitalsFilter
    # filter_backends = (DjangoFilterBackend,)


    @action(detail=False, methods=["get"])
    def closest_parcels(self, request):
        """Get Hospitals that are at least 3km or less from a users location"""
        longitude = request.GET.get("lon", None)
        latitude = request.GET.get("lat", None)

        if longitude and latitude:
            user_location = Point(float(longitude), float(latitude), srid=4326)
            closest_parcels = Parcels.objects.filter(geom__distance_lte=(user_location, D(km=3)))
            serializer = self.get_serializer_class()
            serialized_parcels = serializer(closest_parcels, many=True)
            return Response(serialized_parcels.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

