import os

from django.contrib.gis.utils import LayerMapping

from .models import Nairobi, Locations, SubCounties, SubLocations

# python manage.py ogrinspect world\data\TM_WORLD_BORDERS-0.3.shp Parcels --srid=4326 --mapping --multi

nairobi_mapping = {
    'code': 'COUNTY3_ID',
    'county': 'COUNTY',
    'geom': 'MULTIPOLYGON',
}

subcounties_mapping = {
    "code": "SCCodeFull",
    "name": "FIRST_SCou",
    "geom": "MULTIPOLYGON",
}

locations_mapping = {
    "code": "LocCodeFul",
    "name": "FIRST_LocN",
    "geom": "MULTIPOLYGON",
}

sublocations_mapping = {
    "code": "SlCodeFull",
    "name": "FIRST_SLNa",
    "geom": "MULTIPOLYGON",
}

counties_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), "shapefile", "Nairobi.shp"), )

subcounty_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), "shapefile", "SubCounty.shp"), )

location_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), "shapefile", "Locations.shp"), )

subloc_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), "shapefile", "SubLocation.shp"), )


def county_run(verbose=True):
    lm = LayerMapping(Nairobi, counties_shp, nairobi_mapping, transform=False, encoding="utf-8")
    lm.save(strict=True, verbose=verbose)


def subcounty_run(verbose=True):
    lm = LayerMapping(SubCounties, subcounty_shp, subcounties_mapping, transform=False, encoding="utf-8", )
    lm.save(strict=True, verbose=verbose)


def location_run(verbose=True):
    lm = LayerMapping(
        Locations, location_shp, locations_mapping, transform=False, encoding="utf-8"
    )
    lm.save(strict=True, verbose=verbose)


def subloc_run(verbose=True):
    lm = LayerMapping(
        SubLocations,
        subloc_shp,
        sublocations_mapping,
        transform=False,
        encoding="utf-8",
    )
    lm.save(strict=True, verbose=verbose)
