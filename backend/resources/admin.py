# from django.contrib.gis.admin import GeoModelAdmin, OSMGeoAdmin
from django.contrib.gis import admin

# from django.contrib.gis.admin import OSMGeoAdmin
from leaflet.admin import LeafletGeoAdmin

# Register your models here.
from .models import Nairobi, Locations, SubCounties, SubLocations

# admin.site.register(Nairobi, admin.GeoModelAdmin)  # using django openlayers
# admin.site.register(SubCounties, admin.OSMGeoAdmin)  # using open street map
# admin.site.register(Locations, LeafletGeoAdmin)  # using leaflet_lib
# admin.site.register(SubLocations, LeafletGeoAdmin)  # using leaflet_lib


# Register your models here.
class CountiesAdmin(LeafletGeoAdmin):
    list_display = ("id", "code", "county")
    list_display_links = ("county",)
    search_fields = ("code", "county")
    readonly_fields = ("id", "code", "county")
    list_per_page = 10
    filter_horizontal = ()
    list_filter = ("county",)
    fieldsets = ()


class SubCountyAdmin(LeafletGeoAdmin):
    list_display = ("id", "code", "name")
    list_display_links = ("name",)
    list_per_page = 10
    readonly_fields = ("id", "code", "name")
    search_fields = ("code", "name")
    filter_horizontal = ()
    # list_filter = ('first_scou',)
    fieldsets = ()


class LocationAdmin(LeafletGeoAdmin):
    list_display = ("id", "code", "name")
    list_display_links = ("name",)
    list_per_page = 10
    readonly_fields = ("code", "name")
    search_fields = (
        "name",
        "code",
    )
    filter_horizontal = ()
    # list_filter = ('first_locn',)
    fieldsets = ()


class SubLocationAdmin(LeafletGeoAdmin):
    list_display = ("id", "code", "name")
    list_display_links = ("name",)
    list_per_page = 10
    readonly_fields = ("code", "name")
    search_fields = ("code", "name")
    filter_horizontal = ()
    # list_filter = ('first_slna',)
    fieldsets = ()


# Register your models here.
admin.site.register(Nairobi, CountiesAdmin)
admin.site.register(SubCounties, SubCountyAdmin)
admin.site.register(Locations, LocationAdmin)
admin.site.register(SubLocations, SubLocationAdmin)
