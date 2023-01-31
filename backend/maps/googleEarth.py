"""
Google Earth Engine as WMS Layer - Using Python API

https://bikeshbade.com.np/tutorials/Detail/?title=Google%20Earth%20Engine%20as%20WMS%20Layer%20-%20Using%20Python%20API&code=1
https://bikeshbade.com.np/tutorials/Detail/?title=Introduction%20to%20the%20Google%20Earth%20Engine%20Python%20API&code=10
https://bikeshbade.com.np/tutorials/Detail/?title=Google%20earth%20engine%20with%20python&code=17
https://courses.spatialthoughts.com/end-to-end-gee.html
"""


# import Google earth engine module
import ee
import folium

# Authenticate the Google earth engine with google account
# Trigger the authentication flow.
ee.Authenticate()
ee.Initialize()

# Define year
# startyear = 2019
# endyear = 2019
#
# # Create the Date object
# startdate = ee.Date.fromYMD(startyear, 1, 1)
# enddate = ee.Date.fromYMD(endyear, 12, 1)
#
#
# # Define a method for displaying Earth Engine image tiles on a folium map.
# def add_ee_layer(self, ee_object, vis_params, name):
#     try:
#         # display ee.Image()
#         if isinstance(ee_object, ee.image.Image):
#             map_id_dict = ee.Image(ee_object).getMapId(vis_params)
#             folium.raster_layers.TileLayer(
#                 tiles=map_id_dict["tile_fetcher"].url_format,
#                 attr="Google Earth Engine",
#                 name=name,
#                 overlay=True,
#                 control=True,
#             ).add_to(self)
#     except:
#         print("Could not display {}".format(name))
#
#
# # Add EE drawing method to folium.
# folium.Map.add_ee_layer = add_ee_layer
#
# # modis Data for NDVI
# dataset = (
#     ee.ImageCollection("MODIS/006/MOD13Q1")
#     .filter(ee.Filter.date(startdate, enddate))
#     .first()
# )
# modisndvi = dataset.select("NDVI")
#
# # Set visualization parameters.
# visParams = {
#     "min": 0.0,
#     "max": 8000.0,
#     "palette": [
#         "FFFFFF",
#         "CE7E45",
#         "DF923D",
#         "F1B555",
#         "FCD163",
#         "99B718",
#         "74A901",
#         "66A000",
#         "529400",
#         "3E8601",
#         "207401",
#         "056201",
#         "004C00",
#         "023B01",
#         "012E01",
#         "011D01",
#         "011301",
#     ],
# }
#
# # Create a folium map object.
# my_map = folium.Map(location=[28.5973518, 83.54495724], zoom_start=6, height=500)
#
# # Add the data to the map object.
# my_map.add_ee_layer(modisndvi, visParams, "Modis NDVI")
#
# # Display the map.
# # display(my_map)
#
#
# my_map.save("index.html")
