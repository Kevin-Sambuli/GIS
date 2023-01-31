
// set the WMS
var geoserver_url = "http://localhost:8080/geoserver/wms";

// <script defer="defer" type="text/javascript">
// 	// instantiate the map object
// 	var map = new OpenLayers.Map("map", {
// 	controls: [],
// 	projection: new OpenLayers.Projection("EPSG:900913")
// 	});
// </script>

// add layers to map and center it
map.addLayers([osm, wfs]);
var fromProjection = new OpenLayers.Projection("EPSG:4326");
var toProjection = new OpenLayers.Projection("EPSG:900913");
var cpoint = new OpenLayers.LonLat(12.5, 41.85).transform(
	fromProjection, toProjection);
map.setCenter(cpoint, 10);


// add some controls on the map
map.addControl(new OpenLayers.Control.Navigation());
map.addControl(new OpenLayers.Control.PanZoomBar()),
map.addControl(new OpenLayers.Control.LayerSwitcher(
{"div":OpenLayers.Util.getElement("layerswitcher")}));
map.addControl(new OpenLayers.Control.MousePosition());

// center map
var cpoint = new OpenLayers.LonLat(-11000000, 4800000);
map.setCenter(cpoint, 3);


var info = new OpenLayers.Control.WMSGetFeatureInfo({
	url: geoserver_url,
	title: 'Identify',
	queryVisible: true,
	eventListeners: {
		getfeatureinfo: function(event) {
			map.addPopup(new OpenLayers.Popup.FramedCloud(
			"WMSIdentify",
			map.getLonLatFromPixel(event.xy),
			null,
			event.text,
			null, true
			));
			}
		}
	});
map.addControl(info);
info.activate();



map.addLayers([mapserver_wms, geoserver_wms, google_ter, google_hyb]);


// wms-t
// create the wfs layer
var saveStrategy = new OpenLayers.Strategy.Save();
var wfs = new OpenLayers.Layer.Vector(
	"Sites",
	{strategies: [new OpenLayers.Strategy.BBOX(),saveStrategy],
	projection: new OpenLayers.Projection("EPSG:4326"),
	styleMap: new OpenLayers.StyleMap({
			pointRadius: 7,
			fillColor: "#FF0000"
		}),
	protocol: new OpenLayers.Protocol.WFS({
		version: "1.1.0",
		srsName: "EPSG:4326",
		url: "http://localhost:8080/geoserver/wfs",
		featurePrefix: 'postgis_cookbook',
		featureType: "sites",
		featureNS: "http://www.packtpub.com/postgiscookbook/book",
		geometryName: "the_geom"
		})
	});




// create a panel for tools
var panel = new OpenLayers.Control.Panel({
	displayClass: "olControlEditingToolbar"
});

// create a draw point tool
var draw = new OpenLayers.Control.DrawFeature(
	wfs, 
	OpenLayers.Handler.Point,
	{
		handlerOptions: {freehand: false, multi: false},
		displayClass: "olControlDrawFeaturePoint"
	}
);

// create a save tool
var save = new OpenLayers.Control.Button({
	title: "Save Features",
	trigger: function() {
		saveStrategy.save();
		},
	displayClass: "olControlSaveFeatures"
});

// add tools to panel and add it to map
panel.addControls([
	new OpenLayers.Control.Navigation(),
	save, draw
	]);
map.addControl(panel);