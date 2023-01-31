import ee

## Trigger the authentication flow. You only need to do this once
ee.Authenticate()

# Initialize the library.
ee.Initialize()


# Print the elevation of Mount Everest.
dem = ee.Image("USGS/SRTMGL1_003")
xy = ee.Geometry.Point([86.9250, 27.9881])
elev = dem.sample(xy, 30).first().get("elevation").getInfo()
print("Mount Everest elevation (m):", elev)


# Import the Image function from the IPython.display module.
from IPython.display import Image

# Display a thumbnail of global elevation.
Image(
    url=dem.updateMask(dem.gt(0)).getThumbUrl(
        {
            "min": 0,
            "max": 4000,
            "dimensions": 512,
            "palette": ["006633", "E5FFCC", "662A00", "D8D8D8", "F5F5F5"],
        }
    )
)

"""
The folium library can be used to display ee.Image objects on an interactive Leaflet map. Folium has no default method for handling tiles from Earth Engine, so one must be definedand added to the folium.Map module before use.

The following cells provide an example of adding a method for handing Earth Engine tiles and using it to display an elevation model to a Leaflet map.
"""

# Import the folium library.
import folium
from folium import plugins

# Add custom basemaps to folium
basemaps = {
    "Google Maps": folium.TileLayer(
        tiles="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        attr="Google",
        name="Google Maps",
        overlay=True,
        control=True,
    ),
    "Google Satellite": folium.TileLayer(
        tiles="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        attr="Google",
        name="Google Satellite",
        overlay=True,
        control=True,
    ),
    "Google Terrain": folium.TileLayer(
        tiles="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        attr="Google",
        name="Google Terrain",
        overlay=True,
        control=True,
    ),
    "Google Satellite Hybrid": folium.TileLayer(
        tiles="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        attr="Google",
        name="Google Satellite",
        overlay=True,
        control=True,
    ),
    "Esri Satellite": folium.TileLayer(
        tiles="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attr="Esri",
        name="Esri Satellite",
        overlay=True,
        control=True,
    ),
}


# Define a method for displaying Earth Engine image tiles on a folium map.
def add_ee_layer(self, ee_object, vis_params, name):
    try:
        # display ee.Image()
        if isinstance(ee_object, ee.image.Image):
            map_id_dict = ee.Image(ee_object).getMapId(vis_params)
            folium.raster_layers.TileLayer(
                tiles=map_id_dict["tile_fetcher"].url_format,
                attr="Google Earth Engine",
                name=name,
                overlay=True,
                control=True,
            ).add_to(self)
        # display ee.ImageCollection()
        elif isinstance(ee_object, ee.imagecollection.ImageCollection):
            ee_object_new = ee_object.mosaic()
            map_id_dict = ee.Image(ee_object_new).getMapId(vis_params)
            folium.raster_layers.TileLayer(
                tiles=map_id_dict["tile_fetcher"].url_format,
                attr="Google Earth Engine",
                name=name,
                overlay=True,
                control=True,
            ).add_to(self)
        # display ee.Geometry()
        elif isinstance(ee_object, ee.geometry.Geometry):
            folium.GeoJson(
                data=ee_object.getInfo(), name=name, overlay=True, control=True
            ).add_to(self)
        # display ee.FeatureCollection()
        elif isinstance(ee_object, ee.featurecollection.FeatureCollection):
            ee_object_new = ee.Image().paint(ee_object, 0, 2)
            map_id_dict = ee.Image(ee_object_new).getMapId(vis_params)
            folium.raster_layers.TileLayer(
                tiles=map_id_dict["tile_fetcher"].url_format,
                attr="Google Earth Engine",
                name=name,
                overlay=True,
                control=True,
            ).add_to(self)

    except:
        print("Could not display {}".format(name))


# Add EE drawing method to folium.
folium.Map.add_ee_layer = add_ee_layer


# Set visualization parameters.
vis_params = {
    "min": 0,
    "max": 4000,
    "palette": ["006633", "E5FFCC", "662A00", "D8D8D8", "F5F5F5"],
}

# Create a folium map object.
my_map = folium.Map(location=[20, 0], zoom_start=3, height=500)

# Add custom basemaps
basemaps["Google Maps"].add_to(my_map)
basemaps["Google Satellite Hybrid"].add_to(my_map)

# Add the elevation model to the map object.
my_map.add_ee_layer(dem.updateMask(dem.gt(0)), vis_params, "DEM")

# Add a layer control panel to the map.
my_map.add_child(folium.LayerControl())

# Add fullscreen button
plugins.Fullscreen().add_to(my_map)

# Display the map.
# display(my_map)


""" full Example"""
# Set visualization parameters.
vis_params = {
    "min": 0,
    "max": 4000,
    "palette": ["006633", "E5FFCC", "662A00", "D8D8D8", "F5F5F5"],
}

# Create a folium map object.
my_map = folium.Map(location=[40.33, -99.42], zoom_start=4, height=500)

# Add custom basemaps
basemaps["Google Maps"].add_to(my_map)
basemaps["Google Satellite Hybrid"].add_to(my_map)

# Add the elevation model to the map object.
my_map.add_ee_layer(dem.updateMask(dem.gt(0)), vis_params, "DEM")

# Display ee.Image
dataset = ee.Image("JRC/GSW1_1/GlobalSurfaceWater")
occurrence = dataset.select("occurrence")
occurrenceVis = {"min": 0.0, "max": 100.0, "palette": ["ffffff", "ffbbbb", "0000ff"]}
my_map.add_ee_layer(occurrence, occurrenceVis, "JRC Surface Water")

# Display ee.Geometry
holePoly = ee.Geometry.Polygon(
    coords=[[[-35, -10], [-35, 10], [35, 10], [35, -10], [-35, -10]]],
    proj="EPSG:4326",
    geodesic=True,
    maxError=1.0,
    evenOdd=False,
)
my_map.add_ee_layer(holePoly, {}, "Polygon")

# Display ee.FeatureCollection
fc = ee.FeatureCollection("TIGER/2018/States")
my_map.add_ee_layer(fc, {}, "US States")

# Add a layer control panel to the map.
my_map.add_child(folium.LayerControl())
plugins.Fullscreen().add_to(my_map)

# Display the map.
display(my_map)


"""
Chart visualization
Some Earth Engine functions produce tabular data that can be plotted by data visualization packages such as matplotlib. The following example
 demonstrates the display of tabular data from Earth Engine as a scatter plot. See Charting in Colaboratory for more information.
 """

# Import the matplotlib.pyplot module.
import matplotlib.pyplot as plt

# Fetch a Landsat image.
img = ee.Image("LANDSAT/LT05/C01/T1_SR/LT05_034033_20000913")

# Select Red and NIR bands, scale them, and sample 500 points.
samp_fc = img.select(["B3", "B4"]).divide(10000).sample(scale=30, numPixels=500)

# Arrange the sample as a list of lists.
samp_dict = samp_fc.reduceColumns(ee.Reducer.toList().repeat(2), ["B3", "B4"])
samp_list = ee.List(samp_dict.get("list"))

# Save server-side ee.List as a client-side Python list.
samp_data = samp_list.getInfo()

# Display a scatter plot of Red-NIR sample pairs using matplotlib.
plt.scatter(samp_data[0], samp_data[1], alpha=0.2)
plt.xlabel("Red", fontsize=12)
plt.ylabel("NIR", fontsize=12)
plt.show()


"""render graph as html"""
import base64
from io import BytesIO

import matplotlib.pyplot as plt

fig = plt.figure()

# plot sth

tmpfile = BytesIO()
fig.savefig(tmpfile, format="png")
encoded = base64.b64encode(tmpfile.getvalue()).decode("utf-8")

html = (
    "Some html head"
    + "<img src='data:image/png;base64,{}'>".format(encoded)
    + "Some more html"
)

with open("test.html", "w") as f:
    f.write(html)
