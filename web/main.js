// var serverPort = 'localhost:8081/geoserver/';
// var serverPort = 'localhost/geoserver/';

var serverPort = 'web.geospatialdev.com/geoserver/';
// var serverPort = 'geospatialdev.com/geoserver/';
// var serverPort = 'geospatialdev.com:8081/geoserver/';

// url: 'https://localhost/geoserver/data/wms',

var geoserverWorkspace = 'data';
var countyLayerName = 'counties';
var subCountiesLayerName = 'subcounties';
var locationLayerName = 'locations';
var subLocationLayerName = 'sublocations';
var adminLayerName = 'administration';
var identifyLayers = [];
var projectionName = 'EPSG:4326';
var layerList = [];


var map, geojson, layer_name, featureOverlay;
var container, content, closer;

var layerSwitcher;
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});


/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

var view = new ol.View({
    extent: [27.080, -4.930, 48.500, 5.690],
    projection: projectionName,
    center: [37.73, 0.42],
    zoom : 5,
    minZoom : 4
});


var view_ov = new ol.View({
    projection: 'EPSG:4326',
    center: [38.09, 0.82],
    zoom: 6,
});

var OSM = new ol.layer.Tile({
    type: 'base',
    title: 'OSM',
    minZoom: 3,
    maxZoom: 26,
    source: new ol.source.OSM(),
});

var satellite = new ol.layer.Tile({
    type: 'base',
    title: 'Satellite',
    visibility: false,
    source: new ol.source.XYZ({
        attributions: ['Powered by Kevin Sambuli'],
        attributionsCollapsible: false,
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 26
    }),

});

var projection = ol.proj.get('EPSG:4326');
var projectionExtent = projection.getExtent();

// var mapExtent = [-180.0, -90.0, 180.0, 90.0];
var mapExtent = [28.67197265625, -15.42552734375, 47.12802734375, 9.40552734375];
var matrixIds = new Array(22);

for (var z = 0; z < 22; ++z) {
    matrixIds[z] = "EPSG:4326:" + z;
}

var resolutions = [
    0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125,
    0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4,
    1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5,
    5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7
];

var osmTile = new ol.layer.Tile({
    title: 'Kenya',
    type: 'base',
    source: new ol.source.WMTS({
        url: 'https://' + serverPort + 'gwc/service/wmts',
        layer: 'osm:kenya',
        format: 'image/png',
        matrixSet: projectionName, //'EPSG:4326'
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    })
});

var noneTile = new ol.layer.Tile({
    title: 'None',
    type: 'base',
    visible: false
});

var stamen = new ol.layer.Tile({
    title: 'Watercolor',
    type: 'base',
    source: new ol.source.Stamen({
        layer: 'watercolor' })
});

var base_maps = new ol.layer.Group({
    'title': 'Base maps',
    fold: true,
    layers: [noneTile, osmTile,OSM] //,satellite
});

var countiesLayer = new ol.layer.Image({
    title: 'counties',
    minZoom: 2,
    maxZoom: 9,
    source: new ol.source.ImageWMS({
        url: 'https://' + serverPort + geoserverWorkspace + '/wms',
        params: {'LAYERS': countyLayerName},
        serverType: 'geoserver',
        ratio: 1
    })
})

var subCountyLayer = new ol.layer.Image({
    title: 'subcounties',
    minZoom: 8,
    maxZoom: 14,
    source: new ol.source.ImageWMS({
        url: 'https://' + serverPort + geoserverWorkspace + '/wms',
        params: {'LAYERS': subCountiesLayerName},
        serverType: 'geoserver',
        ratio: 1
    })
})

var locationLayer = new ol.layer.Image({
    title: 'locations',
    minZoom: 10,
    maxZoom: 20,
    source: new ol.source.ImageWMS({
        // url: 'https://localhost/geoserver/wms',
        url: 'https://' + serverPort + geoserverWorkspace + '/wms',
        params: {'LAYERS': locationLayerName},
        serverType: 'geoserver',
        ratio: 1
    })
})

var subLocationLayer = new ol.layer.Image({
    title: 'sublocations',
    minZoom: 15,
    maxZoom: 25,
    source: new ol.source.ImageWMS({
        url: 'https://' + serverPort + geoserverWorkspace + '/wms',
        params: {'LAYERS': subLocationLayerName},
        serverType: 'geoserver',
        ratio: 1
    })
})

var administration = new ol.layer.Group({
    'title': 'Administrative',
    fold: true,
    visible: true,
    layers: [subLocationLayer, locationLayer, subCountyLayer, countiesLayer ],
});
// map.addLayer(population);
// console.log(administration.getLayers())


var population = new ol.layer.Image({
    title: 'population',
    visible: false,
    source: new ol.source.ImageWMS({
        url: 'https://' + serverPort + geoserverWorkspace + '/wms',
        params: {'LAYERS': 'population'},
        serverType: 'geoserver',
        ratio: 1
    })
})


var overlays = new ol.layer.Group({
    'title': 'Overlays',
    visible: true,
    fold: true,
    layers: [population],
});

// overlays.getLayers().push(population);

var admin = new ol.layer.Tile({
    title: "administration",
    visible: false,
    source: new ol.source.TileWMS({
        url: 'https://' + serverPort  + geoserverWorkspace + '/wms',
        params: { 'LAYERS': adminLayerName, 'TILED': true },
        serverType: 'geoserver',
    })
});
overlays.getLayers().push(admin);
// overlays.getLayers().push(countiesLayer);
// overlays.getLayers().push(subCountyLayer);


var map = new ol.Map({
    target: 'map',
    view: view,
    layers: [base_maps, administration, overlays],
    overlays: [overlay] // pop up div overlay
});

// map.addLayer(base_maps);
// map.addLayer(administration);
// map.addLayer(overlays);




var mouse_position = new ol.control.MousePosition();
map.addControl(mouse_position);


var overview = new ol.control.OverviewMap({
    view: view_ov,
    collapseLabel: 'O',
    label: 'O',
    layers: [OSM]
});

map.addControl(overview);

var full_sc = new ol.control.FullScreen({label: 'F'});
map.addControl(full_sc);

var zoom = new ol.control.Zoom({zoomInLabel: '+', zoomOutLabel: '-'});
map.addControl(zoom);

var slider = new ol.control.ZoomSlider();
// map.addControl(slider);


var zoom_ex = new ol.control.ZoomToExtent({
    extent: [33.27, 5.36, 41.49, -4.79]
});
map.addControl(zoom_ex);

var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: true,
    tipLabel: 'Layers', // Optional label for button
    groupSelectStyle: 'children', // Can be 'children' [default], 'group' or 'none'
    collapseTipLabel: 'Collapse layers',
});
map.addControl(layerSwitcher);

function legend() {

    $('#legend').empty();

    var no_layers = overlays.getLayers().get('length');

    var head = document.createElement("h4");

    var txt = document.createTextNode("Legend");

    head.appendChild(txt);
    var element = document.getElementById("legend");
    element.appendChild(head);
    var ar = [];
    var i;
    for (i = 0; i < no_layers; i++) {
        ar.push("https://" + serverPort + geoserverWorkspace + "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + overlays.getLayers().item(i).get('title'));
        //alert(overlays.getLayers().item(i).get('title'));
    }
    for (i = 0; i < no_layers; i++) {
        var head = document.createElement("p");

        var txt = document.createTextNode(overlays.getLayers().item(i).get('title'));
        //alert(txt[i]);
        head.appendChild(txt);
        var element = document.getElementById("legend");
        element.appendChild(head);
        var img = new Image();
        img.src = ar[i];

        var src = document.getElementById("legend");
        src.appendChild(img);

    }

}

legend();


function getinfo(evt) {

    var coordinate = evt.coordinate;
    var viewResolution = /** @type {number} */ (view.getResolution());

    //alert(coordinate1);
    $("#popup-content").empty();

    document.getElementById('info').innerHTML = '';
    var no_layers = overlays.getLayers().get('length');
    // alert(no_layers);
    var url = new Array();
    var wmsSource = new Array();
    var layer_title = new Array();


    var i;
    for (i = 0; i < no_layers; i++) {
        //alert(overlays.getLayers().item(i).getVisible());
        var visibility = overlays.getLayers().item(i).getVisible();
        //alert(visibility);
        if (visibility == true) {
            //alert(i);
            layer_title[i] = overlays.getLayers().item(i).get('title');
            //alert(layer_title[i]);
            wmsSource[i] = new ol.source.ImageWMS({
                url: 'https://' + serverPort + geoserverWorkspace + '/wms',
                params: {'LAYERS': layer_title[i]},
                serverType: 'geoserver',
                crossOrigin: 'anonymous'
            });
            //alert(wmsSource[i]);
            //var coordinate2 = evt.coordinate;
            // alert(coordinate);
            url[i] = wmsSource[i].getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:4326',
                {'INFO_FORMAT': 'text/html'});
                // {'INFO_FORMAT': 'application/json'});

            console.log(url[i])
            //alert(url[i]);

            /*
                        if ( url[i] ){
                            fetch(url)
                              .then((response) => response.text())
                              .then((html) => {
                                document.getElementById('info').innerHTML = html;
                              });
                          }

             */

            //assuming you use jquery
            $.get(url[i], function (data) {

                //append the returned html data
                $("#popup-content").append(data);

                overlay.setPosition(coordinate);

                // layerSwitcher.renderPanel();

                // legend();

            });

        }
    }

}


//map.on('singleclick', getinfo);
// map.un('singleclick', getinfo);

getinfotype.onchange = function () {
    map.removeInteraction(draw);
    if (vectorLayer) {
        vectorLayer.getSource().clear();
    }
    map.removeOverlay(helpTooltip);
    if (measureTooltipElement) {
        var elem = document.getElementsByClassName("tooltip tooltip-static");

        for (var i = elem.length - 1; i >= 0; i--) {
            elem[i].remove();
        }
    }

    if (getinfotype.value == 'activate_getinfo') {

        map.on('singleclick', getinfo);


    } else if (getinfotype.value == 'select' || getinfotype.value == 'deactivate_getinfo') {
        map.un('singleclick', getinfo);
        overlay.setPosition(undefined);
        closer.blur();
    }
};

// measure tool

var source = new ol.source.Vector();
var vectorLayer = new ol.layer.Vector({
    //title: 'layer',
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

//overlays.getLayers().push(vectorLayer);
map.addLayer(vectorLayer);

layerSwitcher.renderPanel();

/**
 * Currently drawn feature.
 * @type {module:ol/Feature~Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {module:ol/Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {module:ol/Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue drawing the line';


/**
 * Handle pointer move.
 * @param {module:ol/MapBrowserEvent~MapBrowserEvent} evt The event.
 */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {

            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
    }

    // helpTooltipElement.innerHTML = helpMsg;
    // helpTooltip.setPosition(evt.coordinate);

    // helpTooltipElement.classList.remove('hidden');
};

map.on('pointermove', pointerMoveHandler);

map.getViewport().addEventListener('mouseout', function () {
    // helpTooltipElement.classList.add('hidden');
});

//var measuretype = document.getElementById('measuretype');

var draw; // global so we can remove it later


/**
 * Format length output.
 * @param {module:ol/geom/LineString~LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line, {projection: 'EPSG:4326'});
    //var length = getLength(line);
    //var length = line.getLength({projection:'EPSG:4326'});

    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';

    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';

    }
    return output;

};


/**
 * Format area output.
 * @param {module:ol/geom/Polygon~Polygon} polygon The polygon.
 * @return {string}// Formatted area.
 */
var formatArea = function (polygon) {
    // var area = getArea(polygon);
    var area = ol.sphere.getArea(polygon, {projection: 'EPSG:4326'});
    // var area = polygon.getArea();
    //alert(area);
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

function addInteraction() {

    var type;
    if (measuretype.value == 'area') {
        type = 'Polygon';
    } else if (measuretype.value == 'length') {
        type = 'LineString';
    }
    //alert(type);

    //var type = (measuretype.value == 'area' ? 'Polygon' : 'LineString');
    draw = new ol.interaction.Draw({
        source: source,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.5)'
                })
            })
        })
    });

    if (measuretype.value == 'select' || measuretype.value == 'clear') {

        map.removeInteraction(draw);
        if (vectorLayer) {
            vectorLayer.getSource().clear();
        }
        map.removeOverlay(helpTooltip);

        if (measureTooltipElement) {
            var elem = document.getElementsByClassName("tooltip tooltip-static");
//$('#measure_tool').empty();

//alert(elem.length);
            for (var i = elem.length - 1; i >= 0; i--) {

                elem[i].remove();
//alert(elem[i].innerHTML);
            }
        }

//var elem1 = elem[0].innerHTML;
//alert(elem1);

    } else if (measuretype.value == 'area' || measuretype.value == 'length') {

        map.addInteraction(draw);
        createMeasureTooltip();
        createHelpTooltip();

        var listener;
        draw.on('drawstart',
            function (evt) {
                // set sketch


                //vectorLayer.getSource().clear();

                sketch = evt.feature;

                /** @type {module:ol/coordinate~Coordinate|undefined} */
                var tooltipCoord = evt.coordinate;

                listener = sketch.getGeometry().on('change', function (evt) {
                    var geom = evt.target;

                    var output;
                    if (geom instanceof ol.geom.Polygon) {

                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();

                    } else if (geom instanceof ol.geom.LineString) {

                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            }, this);

        draw.on('drawend',
            function () {
                measureTooltipElement.className = 'tooltip tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                ol.Observable.unByKey(listener);
            }, this);

    }
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';

    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);

}


/**
 * Let user change the geometry type.
 */
measuretype.onchange = function () {
    map.un('singleclick', getinfo);
    overlay.setPosition(undefined);
    closer.blur();
    map.removeInteraction(draw);
    addInteraction();
};

// wms_layers_window

function wms_layers() {

    $(function () {
        $("#wms_layers_window").dialog({
            height: 400,
            width: 700,
            modal: true
        });

        $("#wms_layers_window").show();
    });

    $(document).ready(function () {
        $.ajax({
            type: "GET",
            // url: "https://geospatialdev.com/geoserver/data/wms?request=getCapabilities",
            url: "https://" + serverPort + geoserverWorkspace + "/wms?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                $('#table_wms_layers').empty();

                $('<tr></tr>').html('<th>Name</th><th>Title</th><th>Abstract</th>').appendTo('#table_wms_layers');

                $(xml).find('Layer').find('Layer').each(function () {

                    var name = $(this).children('Name').text();
                    var title = $(this).children('Title').text();
                    var abst = $(this).children('Abstract').text();

                    $('<tr></tr>').html('<td>' + name + '</td><td>' + title + '</td><td>' + abst + '</td>').appendTo('#table_wms_layers');

                });

                addRowHandlers();
            }
        });
    });


    var divContainer = document.getElementById("wms_layers_window");
    var table1 = document.getElementById("table_wms_layers");
    divContainer.innerHTML = "";
    divContainer.appendChild(table1);
    $("#wms_layers_window").show();

    var add_map_btn = document.createElement("BUTTON");
    add_map_btn.setAttribute("id", "add_map_btn");
    add_map_btn.innerHTML = "Add Layer to Map";
    add_map_btn.setAttribute("onclick", "add_layer()");
    divContainer.appendChild(add_map_btn);

    // Adding rows to the table
    function addRowHandlers() {
        var rows = document.getElementById("table_wms_layers").rows;
        var table = document.getElementById('table_wms_layers');
        var heads = table.getElementsByTagName('th');
        var col_no;

        for (var i = 0; i < heads.length; i++) {
            // Take each cell
            var head = heads[i];
            //alert(head.innerHTML);
            if (head.innerHTML == 'Name') {
                col_no = i + 1;
                //alert(col_no);
            }

        }
        for (i = 0; i < rows.length; i++) {

            rows[i].onclick = function () {
                return function () {

                    $(function () {
                        $("#table_wms_layers td").each(function () {
                            $(this).parent("tr").css("background-color", "white");
                        });
                    });

                    var cell = this.cells[col_no - 1];
                    layer_name = cell.innerHTML;
                    // alert(layer_name);

                    $(document).ready(function () {
                        $("#table_wms_layers td:nth-child(" + col_no + ")").each(function () {
                            if ($(this).text() == layer_name) {
                                $(this).parent("tr").css("background-color", "grey");
                            }
                        });
                    });
                };
            }(rows[i]);
        }
    }

}


function add_layer() {
    var name = layer_name.split(":");

    console.log(layer_name)
    console.log(name)

    var layer_wms = new ol.layer.Image({
        title: name[1],
        visible: true,
        source: new ol.source.ImageWMS({
            url: 'https://' + serverPort + geoserverWorkspace + '/wms',
            params: {'LAYERS': layer_name},
            ratio: 1,
            serverType: 'geoserver'
        })
    });

    // Adding the layer to the layer control
    console.log(overlays.getLayers())
    // overlays.getLayers().push(layer_wms);
    map.addLayer(layer_wms);

    var url = 'https://' + serverPort + geoserverWorkspace + '/wms?request=getCapabilities';

    // format for reading Map server getcapabilities for wms
    var parser = new ol.format.WMSCapabilities();

    // Geeting the layers extent using the wfs capabilities
    $.ajax(url).then(function (response) {

        var result = parser.read(response);

        var Layers = result.Capability.Layer.Layer;
        var extent;
        for (var i = 0, len = Layers.length; i < len; i++) {

            var layerobj = Layers[i];

            if (layerobj.Name == layer_name) {
                extent = layerobj.BoundingBox[0].extent;
                //alert(extent);
                map.getView().fit(
                    extent,
                    {duration: 1590, size: map.getSize()}
                );
            }
        }
    });

    layerSwitcher.renderPanel();
    //map.addControl(layerSwitcher);
    legend();
    //map.addLayer(layer_wms);
}



// layers_name
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://" + serverPort + geoserverWorkspace + "/wfs?request=getCapabilities",
        dataType: "xml",
        success: function (xml) {

            var select = $('#layer');

            $(xml).find('FeatureType').each(function () {

                var name = $(this).find('Name').text();

                $(this).find('Name').each(function () {
                    var value = $(this).text();
                    select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                });
            });
        }
    });
});


// attributes_dropdown
$(function () {
    $("#layer").change(function () {

        var attributes = document.getElementById("attributes");
        var length = attributes.options.length;
        for (i = length - 1; i >= 0; i--) {
            attributes.options[i] = null;
        }

        var value_layer = $(this).val();

        attributes.options[0] = new Option('Select attributes', "");

        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "https://" + serverPort + geoserverWorkspace + "/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                success: function (xml) {

                    var select = $('#attributes');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    //	alert(title);
                    $(xml).find('xsd\\:sequence').each(function () {

                        $(this).find('xsd\\:element').each(function () {
                            var value = $(this).attr('name');
                            //alert(value);
                            var type = $(this).attr('type');
                            //alert(type);
                            if (value != 'geom' && value != 'the_geom') {
                                select.append("<option class='ddindent' value='" + type + "'>" + value + "</option>");
                            }
                        });

                    });
                }
            });
        });


    });
});


// operator combo
$(function () {
    $("#attributes").change(function () {

        var operator = document.getElementById("operator");
        var length = operator.options.length;
        for (i = length - 1; i >= 0; i--) {
            operator.options[i] = null;
        }

        var value_type = $(this).val();
        // alert(value_type);
        var value_attribute = $('#attributes option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("operator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        } else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("operator");
            operator1.options[1] = new Option('Like', 'ILike');

        }

    });
});

var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,255,255,0.7)',
    }),
    stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#3399CC'
        })
    })
});

featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: highlightStyle
});
var highlight1;

function findRowNumber(cn1, v1) {

    var table = document.querySelector('#table');
    var rows = table.querySelectorAll("tr");
    var msg = "No such row exist"
    for (i = 1; i < rows.length; i++) {
        var tableData = rows[i].querySelectorAll("td");
        if (tableData[cn1 - 1].textContent == v1) {
            msg = i;
            break;
        }
    }
    return msg;
}


function addRowHandlers() {
    var rows = document.getElementById("table").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        //alert(head.innerHTML);
        if (head.innerHTML == 'id') {
            col_no = i + 1;
            //alert(col_no);
        }

    }
    for (i = 0; i < rows.length; i++) {


        rows[i].onclick = function () {
            return function () {
                featureOverlay.getSource().clear();

                $(function () {
                    $("#table td").each(function () {
                        $(this).parent("tr").css("background-color", "white");
                    });
                });
                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;


                $(document).ready(function () {
                    $("#table td:nth-child(" + col_no + ")").each(function () {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "grey");
                        }
                    });
                });

                var features = geojson.getSource().getFeatures();
//alert(features.length);


                for (i = 0; i < features.length; i++) {


                    if (features[i].getId() == id) {
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                {duration: 1590, size: map.getSize()}
                            );
                        });

                    }
                }

                //alert("id:" + id);
            };
        }(rows[i]);
    }
}


function highlight(evt) {
    featureOverlay.getSource().clear();
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            return feature;
        });

    if (feature) {

        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        var coordinate = evt.coordinate;
        //alert(feature.get('gid'));
        // alert(coordinate);
        /*var content1 = '<h3>' + feature.get([name]) + '</h3>';
        content1 += '<h5>' + feature.get('crop')+' '+ value_param +' '+ value_seas+' '+value_level+'</h5>'
        content1 += '<h5>' + feature.get([value_param]) +' '+ unit +'</h5>';

       // alert(content1);
        content.innerHTML = content1;
        overlay.setPosition(coordinate);*/

        // console.info(feature.getProperties());

        $(function () {
            $("#table td").each(function () {
                $(this).parent("tr").css("background-color", "white");
            });
        });

        featureOverlay.getSource().addFeature(feature);
    }


    /*$(function() {
$("#table td").each(function() {
if ($(this).text() == feature.get('gid')) {
 // $(this).css('color', 'red');
   $(this).parent("tr").css("background-color", "grey");
}
});
});*/


    var table = document.getElementById('table');
    var cells = table.getElementsByTagName('td');
    var rows = document.getElementById("table").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        //alert(head.innerHTML);
        if (head.innerHTML == 'id') {
            col_no = i + 1;
            //alert(col_no);
        }

    }
    var row_no = findRowNumber(col_no, feature.getId());
    //alert(row_no);

    var rows = document.querySelectorAll('#table tr');

    rows[row_no].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    $(document).ready(function () {
        $("#table td:nth-child(" + col_no + ")").each(function () {

            if ($(this).text() == feature.getId()) {
                $(this).parent("tr").css("background-color", "grey");

            }
        });
    });


};

function query() {

    $('#table').empty();

    if (geojson) {
        map.removeLayer(geojson);
    }

    if (featureOverlay) {
        featureOverlay.getSource().clear();
        map.removeLayer(featureOverlay);
    }

    var layer = document.getElementById("layer");
    var value_layer = layer.options[layer.selectedIndex].value;

    var attribute = document.getElementById("attributes");
    var value_attribute = attribute.options[attribute.selectedIndex].text;

    var operator = document.getElementById("operator");
    var value_operator = operator.options[operator.selectedIndex].value;

    var txt = document.getElementById("value");
    var value_txt = txt.value;

    if (value_operator == 'ILike') {
        value_txt = "" + value_txt + "%25";
        //alert(value_txt);
        //value_attribute = 'strToLowerCase('+value_attribute+')';
    } else {
        value_txt = value_txt;
    }

    var url = "https://" + serverPort + geoserverWorkspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"
//alert(url);

    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.7)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 3
        }),

        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    });


    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: style,

    });

    geojson.getSource().on('addfeature', function () {
        //alert(geojson.getSource().getExtent());
        map.getView().fit(
            geojson.getSource().getExtent(),
            {duration: 1590, size: map.getSize()}
        );
    });

    // overlays.getLayers().push(geojson);
    map.addLayer(geojson);

    // get the data in json and access allmproperties to be used as table headers
    $.getJSON(url, function (data) {
        //alert(data.features[0].properties);
        //alert(data.features.length);
        var col = [];
        col.push('id');
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);

                    console.log(key)
                    // console.log(data.features[i].properties)
                }
            }
        }
        // console.log(length(col));
        console.log(col);

        var table = document.createElement("table");


        table.setAttribute("class", "table table-bordered");
        table.setAttribute("id", "table");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) {
                    tabCell.innerHTML = data.features[i]['id'];
                } else {
                    //alert(data.features[i]['id']);
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                    //alert(tabCell.innerHTML);
                }
            }
        }


        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("table_data");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
        addRowHandlers();

        document.getElementById('map').style.height = '71%';
        document.getElementById('table_data').style.height = '25%';
        //map.updateSize();
    });


    map.on('click', highlight);

    addRowHandlers();

}

// Draw_layer_dropdown

//
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://" + serverPort + geoserverWorkspace + "/wfs?request=getCapabilities",
        dataType: "xml",
        success: function (xml) {
            var select = $('#layer1');
            $(xml).find('FeatureType').each(function () {

                var name = $(this).find('Name').text();

                $(this).find('Name').each(function () {
                    var value = $(this).text();
                    select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                });
            });

        }
    });
});


// draw shapes

var source1 = new ol.source.Vector({wrapX: false});

var vector1 = new ol.layer.Vector({
    source: source1
});
map.addLayer(vector1);
var draw_typeSelect = document.getElementById('draw_type');


var draw1; // global so we can remove it later
function add_draw_Interaction() {
    var value = draw_typeSelect.value;
    //alert(value);
    if (value !== 'None') {
        var geometryFunction;
        if (value === 'Square') {
            value = 'Circle';
            geometryFunction = new ol.interaction.Draw.createRegularPolygon(4);

        } else if (value === 'Box') {
            value = 'Circle';

            geometryFunction = new ol.interaction.Draw.createBox();

        } else if (value === 'Star') {
            value = 'Circle';
            geometryFunction = function (coordinates, geometry) {
                //alert(value);
                var center = coordinates[0];
                var last = coordinates[1];
                var dx = center[0] - last[0];
                var dy = center[1] - last[1];
                var radius = Math.sqrt(dx * dx + dy * dy);
                var rotation = Math.atan2(dy, dx);
                var newCoordinates = [];
                var numPoints = 12;
                for (var i = 0; i < numPoints; ++i) {
                    var angle = rotation + i * 2 * Math.PI / numPoints;
                    var fraction = i % 2 === 0 ? 1 : 0.5;
                    var offsetX = radius * fraction * Math.cos(angle);
                    var offsetY = radius * fraction * Math.sin(angle);
                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                }
                newCoordinates.push(newCoordinates[0].slice());
                if (!geometry) {
                    geometry = new ol.geom.Polygon([newCoordinates]);
                } else {
                    geometry.setCoordinates([newCoordinates]);
                }
                return geometry;
            };
        }
        draw1 = new ol.interaction.Draw({
            source: source1,
            type: value,
            geometryFunction: geometryFunction
        });
        // map.addInteraction(draw1);

        if (draw_typeSelect.value == 'select' || draw_typeSelect.value == 'clear') {

            map.removeInteraction(draw1);
            vector1.getSource().clear();
            if (geojson) {
                geojson.getSource().clear();
                map.removeLayer(geojson);
            }

        } else if (draw_typeSelect.value == 'Square' || draw_typeSelect.value == 'Polygon' || draw_typeSelect.value == 'Circle' || draw_typeSelect.value == 'Star' || draw_typeSelect.value == 'Box') {

            map.addInteraction(draw1);

            draw1.on('drawstart', function (evt) {
                if (vector1) {
                    vector1.getSource().clear();
                }
                if (geojson) {
                    geojson.getSource().clear();
                    map.removeLayer(geojson);
                }

//alert('bc');

            });

            draw1.on('drawend', function (evt) {
                var feature = evt.feature;
                var coords = feature.getGeometry();
                //alert(coords.toString());
                var format = new ol.format.WKT();
                var wkt = format.writeGeometry(coords);
//alert(wkt);
                var layer_name = document.getElementById("layer1");
                var value_layer = layer_name.options[layer_name.selectedIndex].value;

                var url = "https://" + serverPort + geoserverWorkspace + "/wfs?request=GetFeature&version=1.0.0&typeName=" + value_layer + "&outputFormat=json&cql_filter=INTERSECTS(the_geom," + wkt + ")";
                //alert(url);
                /*var style = new ol.style.Style({
                      fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.7)'
                      }),
                      stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 3
                      }),

                      image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                          color: '#ffcc33'
                        })
                      })
                    });*/

                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.7)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 3
                    }),
                    image: new ol.style.Icon({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: 'img/marker.png',
                    }),
                    /*image: new ol.style.Circle({
                      radius: 7,
                      fill: new ol.style.Fill({
                        color: '#ffcc33'
                      })
                    })*/
                });

                geojson = new ol.layer.Vector({

                    //title: '<h5>' + value_crop+' '+ value_param +' '+ value_seas+' '+value_level+'</h5>',
                    source: new ol.source.Vector({
                        url: url,

                        format: new ol.format.GeoJSON()
                    }),
                    style: style,

                });

                geojson.getSource().on('addfeature', function () {
                    //alert(geojson.getSource().getExtent());
                    map.getView().fit(
                        geojson.getSource().getExtent(),
                        {duration: 1590, size: map.getSize()}
                    );
                });

                //overlays.getLayers().push(geojson);
                map.addLayer(geojson);
                map.removeInteraction(draw1);
                $.getJSON(url, function (data) {
                    //alert(data.features[0].properties);
                    //alert(data.features.length);
                    var col = [];
                    col.push('id');
                    for (var i = 0; i < data.features.length; i++) {

                        for (var key in data.features[i].properties) {

                            if (col.indexOf(key) === -1) {
                                col.push(key);
                            }
                        }
                    }


                    var table = document.createElement("table");


                    table.setAttribute("class", "table table-bordered");
                    table.setAttribute("id", "table");
                    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

                    var tr = table.insertRow(-1);                   // TABLE ROW.

                    for (var i = 0; i < col.length; i++) {
                        var th = document.createElement("th");      // TABLE HEADER.
                        th.innerHTML = col[i];
                        tr.appendChild(th);
                    }

                    // ADD JSON DATA TO THE TABLE AS ROWS.
                    for (var i = 0; i < data.features.length; i++) {

                        tr = table.insertRow(-1);

                        for (var j = 0; j < col.length; j++) {
                            var tabCell = tr.insertCell(-1);
                            if (j == 0) {
                                tabCell.innerHTML = data.features[i]['id'];
                            } else {
                                //alert(data.features[i]['id']);
                                tabCell.innerHTML = data.features[i].properties[col[j]];
                                //alert(tabCell.innerHTML);
                            }
                        }
                    }


                    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                    var divContainer = document.getElementById("table_data");
                    divContainer.innerHTML = "";
                    divContainer.appendChild(table);
                    addRowHandlers();

                    document.getElementById('map').style.height = '71%';
                    document.getElementById('table_data').style.height = '25%';
                    map.updateSize();
                });


                map.on('click', highlight);

                addRowHandlers();

            });


        }


    }
}


/**
 * Handle change event.
 */

draw_typeSelect.onchange = function () {
    map.removeInteraction(draw1);
    //	if (draw2) {map.removeInteraction(draw2)};
    if (draw) {
        map.removeInteraction(draw);
        map.removeOverlay(helpTooltip);
        map.removeOverlay(measureTooltip);
    }
    if (vectorLayer) {
        vectorLayer.getSource().clear();
    }
    if (vector1) {
        vector1.getSource().clear();
    }

    if (measureTooltipElement) {
        var elem = document.getElementsByClassName("tooltip tooltip-static");
//$('#measure_tool').empty();

//alert(elem.length);
        for (var i = elem.length - 1; i >= 0; i--) {

            elem[i].remove();
//alert(elem[i].innerHTML);
        }
    }

    add_draw_Interaction();
};

function clear_all() {
    document.getElementById('map').style.height = '96%';
    document.getElementById('table_data').style.height = '0%';
    map.updateSize();
    $('#table').empty();
    //$('#table1').empty();
    if (geojson) {
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }
    if (featureOverlay) {
        featureOverlay.getSource().clear();
        map.removeLayer(featureOverlay);
    }
    map.removeInteraction(draw);
    if (draw1) {
        map.removeInteraction(draw1);
    }
    if (vector1) {
        vector1.getSource().clear();
    }

    if (vectorLayer) {
        vectorLayer.getSource().clear();
    }
    map.removeOverlay(helpTooltip);
    if (measureTooltipElement) {
        var elem = document.getElementsByClassName("tooltip tooltip-static");

        for (var i = elem.length - 1; i >= 0; i--) {

            elem[i].remove();
//alert(elem[i].innerHTML);
        }
    }
    map.un('singleclick', getinfo);
    overlay.setPosition(undefined);
    closer.blur();

    map.un('click', highlight);


}

