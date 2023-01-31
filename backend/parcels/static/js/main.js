var map;
var wfsLayer = new L.featureGroup();
var newgroup = new L.featureGroup();
var drawgeojson = new L.featureGroup();
var wfsLayerSearch = new L.featureGroup();
var editableLayers = new L.FeatureGroup();
var layerEditable = new L.FeatureGroup();

var geojsonlayer;


// Geoserver settings
var wms_Layer_url = "http://localhost:8080/geoserver/kenya/wms?";
var wfs_layer_url = "http://localhost:8080/geoserver/kenya/ows?"; //add  trailing question when using ajax
var getcaps = "http://localhost:8080/geoserver/kenya/wms?service=wms&version=1.3.0&request=GetCapabilities";
var attribution = "Map by Kevin Sambuli Amuhaya";

// initializing system variables
var queryValue = null;
var geoLayer = null;
var cqlFilter = null;
var selectedArea = null;
var area = null;


var basemaps = {
    "OpenStreetMaps": L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            minZoom: 2,
            maxZoom: 19,
            id: "osm.streets"
        }
    ),
    "Google-Map": L.tileLayer(
        "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
        {
            minZoom: 2,
            maxZoom: 19,
            id: "google.street"
        }
    ),
    "Google-Satellite": L.tileLayer(
        "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
            minZoom: 2,
            maxZoom: 19,
            id: "google.satellite",
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
    ),

    "Satellite": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
    ),

    "OpenTopoMap": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {maxZoom: 17}
    ),

    "Terrain": L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }),

    "Google-Hybrid": L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        {
            minZoom: 2,
            maxZoom: 20,
            id: "google.hybrid",
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
    ),

    "Terrain": L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
    ),

    "Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {maxZoom: 20}
    ),
    "OpenTopoMap": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        {maxZoom: 17}
    ),
    "Osm_Mapnik": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {maxZoom: 19,}),

};


// Map Options
var mapOptions = {
    zoomControl: false,
    attributionControl: false,
    center: [-1.22488, 36.827164],
    minZoom: 6.2,
    zoom: 6.2,
    layers: [basemaps.Dark],
};



//create the map object
map = L.map('map', mapOptions);


// Get Map's Center
var centerBounds = map.getBounds().getCenter();

// map.addLayer(editableLayers);


// Geojson style file
var myStyle = {
    stroke: true,
    fillColor: '#B04173',
    fillOpacity: 0.5,
    color: 'yellow ',
    weight: 1,
    Opacity: 1.0,
};


// scale control layer
L.control.scale({
    metric: true,
    imperial: false,
    updateWhenIdle: true,
    maxWidth: 200
}).addTo(map);


L.control.zoom({position: "topleft"}).addTo(map);

// Creating an attribution with an Attribution options
var attrOptions = {
    prefix: 'Made by Kevin Sambuli'
};


var attr = L.control.attribution(attrOptions).addTo(map);


// function to open up the pop up on draw end
var popup = L.popup({
    closeButton: true,
    autoClose: true,
    className: "custom-popup"
});

// define custom marker
var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
    }
});

 var sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'right'
    });
    map.addControl(sidebar);

    setTimeout(function () {
        sidebar.show();
    }, 500);

    var marker2 = L.marker([-1.22488, 36.827164]).addTo(map).on('click', function () {
        sidebar.toggle();
    });

    map.on('click', function () {
        sidebar.hide();
    })

    sidebar.on('show', function () {
        console.log('Sidebar will be visible.');
    });

    sidebar.on('shown', function () {
        console.log('Sidebar is visible.');
    });

    sidebar.on('hide', function () {
        console.log('Sidebar will be hidden.');
    });

    sidebar.on('hidden', function () {
        console.log('Sidebar is hidden.');
    });

    L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
        console.log('Close button clicked.');
    });



var drawOptions = {
    position: "bottomleft",
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10,
            },
            metric: true
        },
        // circle: true, // Turns off this drawing tool
        // rectangle: false,
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
        // marker: true,
        marker: {icon: new MyCustomMarker()},

        polygon: {
            shapeOptions: {
                stroke: true,
                color: '#f357a1',
                weight: 10,
                lineCap: 'round',
                lineJoin: 'round',
                opacity: 0.5,
                fill: true,
                fillColor: null,
                fillOpacity: 0.2,
                clickable: true
            },
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: "#e1e100", // Color the shape will turn when intersects
                timeout: 3000,
                message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
            },
            showArea: true,
            showLength: true,
            strings: `['ha', 'm']`,
            metric: true,
            feet: false,
            nautic: false,
            // repeatMode: true,
            precision: {km: 2, ft: 0}
        }
    },

    // edit:false
    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true,
        poly: {
            allowIntersection: false
        }
    }
};

// adding the draw custom controls to the map
var drawControl = new L.Control.Draw(drawOptions);


// toggle between full screen and normal screen
var mapId = document.getElementById('map');

function fullScreenView() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        mapId.requestFullscreen();
    }
}



// https://astuntechnology.github.io/osgis-ol3-leaflet/leaflet/05-WMS-INFO.html

var geojson;
var featureOverlay;

var qryFlag = false;
var qryButton = document.getElementById('query');

qryButton.addEventListener("click", () => {
/// disableOtherInteraction('lengthButton');
    qryButton.classList.toggle('clicked');
    qryFlag = !qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
            if (geojson) {
                //geojson.getSource().clear();
                //map.removeLayer(geojson);
            }

            if (featureOverlay) {
                //featureOverlay.getSource().clear();
                //map.removeLayer(featureOverlay);
            }
        // document.getElementById("map").style.cursor = "default";
        document.getElementById("attQueryDiv").style.display = "block";

        // bolIdentify = false;

        addMapLayerList();
    } else {
        // document.getElementById("map").style.cursor = "default";
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
        //     geojson.getSource().clear();
        //     map.removeLayer(geojson);
        }

        if (featureOverlay) {
        //     featureOverlay.getSource().clear();
        //     map.removeLayer(featureOverlay);
        }
    }
});


function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/kenya/ows?service=wfs&version=1.1.0&request=GetCapabilities",
            // url: "http://localhost:8080/geoserver/kenya/wfs?service=wfs&version=1.1.0&request=GetCapabilities",
            dataType: "xml",
            success: function (xml) {
                console.log(xml);
                var select = $('#selectLayer');
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                    });
                });
            }
        });
    });
};




$(function () {
    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                success: function (xml) {

                    var select = $('#selectAttribute');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    //	alert(title);
                    select.append("<option class='ddindent' value=''></option>");
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
    }
    document.getElementById("selectAttribute").onchange = function () {
        var operator = document.getElementById("selectOperator");
        while (operator.options.length > 0) {
            operator.remove(0);
        }

        var value_type = $(this).val();
        // alert(value_type);
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        } else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }
    }

    document.getElementById('attQryRun').onclick = function () {
        //map.set("isLoading", 'YES');

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        } else if (attribute.options.selectedIndex == -1) {
            alert("Select Attribute");
        } else if (operator.options.selectedIndex <= 0) {
            alert("Select Operator");
        } else if (txt.value.length <= 0) {
            alert("Enter Value");
        } else {
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
            if (value_operator == 'Like') {
                value_txt = "%25" + value_txt + "%25";
            } else {
                value_txt = value_txt;
            }
            var url = "http://localhost:8080/geoserver/kenya/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"
            // console.log(url);
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () {
                newaddRowHandlers(url);
            }, 300);
            map.set("isLoading", 'NO');
        }
    };
});



function newaddGeoJsonToMap(url) {

    if (geojson) {
        //geojson.getSource().clear();
       // map.removeLayer(geojson);
    }

    // var style = new ol.style.Style({
    //     // fill: new ol.style.Fill({
    //     //   color: 'rgba(0, 255, 255, 0.7)'
    //     // }),
    //     stroke: new ol.style.Stroke({
    //         color: '#FFFF00',
    //         width: 3
    //     }),
    //     image: new ol.style.Circle({
    //         radius: 7,
    //         fill: new ol.style.Fill({
    //             color: '#FFFF00'
    //         })
    //     })
    // });
    //
    // geojson = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         url: url,
    //         format: new ol.format.GeoJSON()
    //     }),
    //     style: style,
    //
    // });
    //
    // geojson.getSource().on('addfeature', function () {
    //     map.getView().fit(
    //         geojson.getSource().getExtent(),
    //         { duration: 1590, size: map.getSize(), maxZoom: 21 }
    //     );
    // });
    // map.addLayer(geojson);
};

function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
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

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");
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
                if (j == 0) { tabCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        // var tabDiv = document.createElement("div");
        var tabDiv = document.getElementById('attListDiv');

        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);

        document.getElementById("attListDiv").style.display = "block";
    });

};



// var highlightStyle = new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: 'rgba(255,0,255,0.3)',
//     }),
//     stroke: new ol.style.Stroke({
//         color: '#FF00FF',
//         width: 3,
//     }),
//     image: new ol.style.Circle({
//         radius: 10,
//         fill: new ol.style.Fill({
//             color: '#FF00FF'
//         })
//     })
// });
//
//
// var featureOverlay = new ol.layer.Vector({
//     source: new ol.source.Vector(),
//     map: map,
//     style: highlightStyle
// });
//
// function newaddRowHandlers() {
//     var table = document.getElementById("attQryTable");
//     var rows = document.getElementById("attQryTable").rows;
//     var heads = table.getElementsByTagName('th');
//     var col_no;
//     for (var i = 0; i < heads.length; i++) {
//         // Take each cell
//         var head = heads[i];
//         if (head.innerHTML == 'id') {
//             col_no = i + 1;
//         }
//
//     }
//     for (i = 0; i < rows.length; i++) {
//         rows[i].onclick = function () {
//             return function () {
//                 featureOverlay.getSource().clear();
//
//                 $(function () {
//                     $("#attQryTable td").each(function () {
//                         $(this).parent("tr").css("background-color", "white");
//                     });
//                 });
//                 var cell = this.cells[col_no - 1];
//                 var id = cell.innerHTML;
//                 $(document).ready(function () {
//                     $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
//                         if ($(this).text() == id) {
//                             $(this).parent("tr").css("background-color", "#d1d8e2");
//                         }
//                     });
//                 });
//
//                 var features = geojson.getSource().getFeatures();
//
//                 for (i = 0; i < features.length; i++) {
//                     if (features[i].getId() == id) {
//                         featureOverlay.getSource().addFeature(features[i]);
//
//                         featureOverlay.getSource().on('addfeature', function () {
//                             map.getView().fit(
//                                 featureOverlay.getSource().getExtent(),
//                                 { duration: 1500, size: map.getSize(), maxZoom: 24 }
//                             );
//                         });
//
//                     }
//                 }
//             };
//         }(rows[i]);
//     }
// }

// end : attribute query


/* SPATIAL QUERY bUILDER */

// start : spatial query
/*
var bufferButton = document.createElement('button');
bufferButton.innerHTML = '<img src="resources/images/mapSearch.png" alt="" class="myImg"></img>';
bufferButton.className = 'myButton';
bufferButton.id = 'bufferButton';
bufferButton.title = 'Spatial Query';

var bufferElement = document.createElement('div');
bufferElement.className = 'myButtonDiv';
bufferElement.appendChild(bufferButton);
toolbarDivElement.appendChild(bufferElement);

*/

var bufferFlag = false;
var bufferButton = document.getElementById('spatialQuery');
bufferButton.addEventListener("click", () => {
    bufferButton.classList.toggle('clicked');
    bufferFlag = !bufferFlag;
    document.getElementById("map").style.cursor = "default";
    if (bufferFlag) {
        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        document.getElementById("spQueryDiv").style.display = "block";

        addMapLayerList_spQry();
    } else {
        document.getElementById("map").style.cursor = "default";
        document.getElementById("spQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        map.removeInteraction(draw);
        if (document.getElementById('spUserInput').classList.contains('clicked')) { document.getElementById('spUserInput').classList.toggle('clicked'); }
    }

})

function addMapLayerList_spQry() {
    var select = $('#buffSelectLayer');
    select.empty();
    select.append("<option class='ddindent' value=''></option>");
    for (i = 0; i < layerList.length; i++) {
        var value = layerList[i];
        select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
    }
};
// end : spatial query


// finally add all main control to map
var allControl = new ol.control.Control({
    element: toolbarDivElement
})
map.addControl(allControl);


// start : onload functions
$(function () {

    // render layerswitcher control
    var toc = document.getElementById('layerSwitcherContent');
    layerSwitcherControl = new ol.control.LayerSwitcher.renderPanel(map, toc, { reverse: true });

    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://" + serverPort + "/geoserver/kenya/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                success: function (xml) {

                    var select = $('#selectAttribute');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    //	alert(title);
                    select.append("<option class='ddindent' value=''></option>");
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
    }
    document.getElementById("selectAttribute").onchange = function () {
        var operator = document.getElementById("selectOperator");
        while (operator.options.length > 0) {
            operator.remove(0);
        }

        var value_type = $(this).val();
        // alert(value_type);
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        }
        else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }
    }

    document.getElementById('attQryRun').onclick = function () {
        map.set("isLoading", 'YES');

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        } else if (attribute.options.selectedIndex == -1) {
            alert("Select Attribute");
        } else if (operator.options.selectedIndex <= 0) {
            alert("Select Operator");
        } else if (txt.value.length <= 0) {
            alert("Enter Value");
        } else {
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
            if (value_operator == 'Like') {
                value_txt = "%25" + value_txt + "%25";
            }
            else {
                value_txt = value_txt;
            }
            var url = "http://" + serverPort + "/geoserver/" + geoserverWorkspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 1000);
            map.addLayer(clickSelectedFeatureOverlay);
            map.set("isLoading", 'NO');
        }
    }

    document.getElementById('attQryClear').onclick = function () {
        if (queryGeoJSON) {
            queryGeoJSON.getSource().clear();
            map.removeLayer(queryGeoJSON);
        }

        if (clickSelectedFeatureOverlay) {
            clickSelectedFeatureOverlay.getSource().clear();
            map.removeLayer(clickSelectedFeatureOverlay);
        }
        coordList = '';
        markerFeature = undefined;
        document.getElementById("attListDiv").style.display = "none";
    }

    document.getElementById("qryType").onchange = function () {
        var value_attribute = $('#qryType option:selected').text();
        var buffDivElement = document.getElementById("bufferDiv");

        if (value_attribute == 'Within Distance of') {
            buffDivElement.style.display = "block";
        } else {
            buffDivElement.style.display = "none";
        }
    }

    document.getElementById("srcCriteria").onchange = function () {
        if (queryGeoJSON) {
            queryGeoJSON.getSource().clear();
            map.removeLayer(queryGeoJSON);
        }

        if (clickSelectedFeatureOverlay) {
            clickSelectedFeatureOverlay.getSource().clear();
            map.removeLayer(clickSelectedFeatureOverlay);
        }
        if (document.getElementById('spUserInput').classList.contains('clicked')) { document.getElementById('spUserInput').classList.toggle('clicked'); }
    }

    document.getElementById('spUserInput').onclick = function () {
        document.getElementById('spUserInput').classList.toggle('clicked');
        if (document.getElementById('spUserInput').classList.contains('clicked')) {
            if (queryGeoJSON) {
                queryGeoJSON.getSource().clear();
                map.removeLayer(queryGeoJSON);
            }

            if (clickSelectedFeatureOverlay) {
                clickSelectedFeatureOverlay.getSource().clear();
                map.removeLayer(clickSelectedFeatureOverlay);
            }
            var srcCriteriaValue = document.getElementById('srcCriteria').value;
            if (srcCriteriaValue == 'pointMarker') {
                addInteractionForSpatialQuery('Point');

            }
            if (srcCriteriaValue == 'lineMarker') {
                addInteractionForSpatialQuery('LineString');
            }
            if (srcCriteriaValue == 'polygonMarker') {
                addInteractionForSpatialQuery('Polygon');
            }
        } else {
            coordList = '';
            markerFeature = undefined;
            map.removeInteraction(draw);
        }
    }

    document.getElementById('spQryRun').onclick = function () {

        var layer = document.getElementById("buffSelectLayer");
        var value_layer = layer.options[layer.selectedIndex].value;

        var srcCriteria = document.getElementById("srcCriteria");
        var value_src = srcCriteria.options[srcCriteria.selectedIndex].value;
        var coordList = '';
        var url;
        var markerType = '';
        if (markerFeature) {
            if (value_src == 'pointMarker') {
                coordList = markerFeature.getGeometry().getCoordinates()[0] + " " + markerFeature.getGeometry().getCoordinates()[1];
                markerType = 'Point';
            }
            if (value_src == 'lineMarker') {
                var coordArray = markerFeature.getGeometry().getCoordinates();

                for (i = 0; i < coordArray.length; i++) {
                    if (i == 0) {
                        coordList = coordArray[i][0] + " " + coordArray[i][1];
                    } else {
                        coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
                    }
                }
                markerType = 'LineString';
            }
            if (value_src == 'polygonMarker') {
                var coordArray = markerFeature.getGeometry().getCoordinates()[0];
                for (i = 0; i < coordArray.length; i++) {
                    if (i == 0) {
                        coordList = coordArray[i][0] + " " + coordArray[i][1];
                    } else {
                        coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
                    }
                }
                coordList = "(" + coordList + ")";
                markerType = 'Polygon';
            }

            var value_attribute = $('#qryType option:selected').text();
            if (value_attribute == 'Within Distance of') {

                var dist = document.getElementById("bufferDistance");
                var value_dist = Number(dist.value);
                // value_dist = value_dist / 111.325;

                var distanceUnit = document.getElementById("distanceUnits");
                var value_distanceUnit = distanceUnit.options[distanceUnit.selectedIndex].value;
                url = "http://" + serverPort + "/geoserver/" + geoserverWorkspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=DWITHIN(geom," + markerType + "(" + coordList + ")," + value_dist + "," + value_distanceUnit + ")&outputFormat=application/json";


            } else if (value_attribute == 'Intersecting') {
                url = "http://" + serverPort + "/geoserver/" + geoserverWorkspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=INTERSECTS(geom," + markerType + "(" + coordList + "))&outputFormat=application/json";
            } else if (value_attribute == 'Completely Within') {
                url = "http://" + serverPort + "/geoserver/" + geoserverWorkspace + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=WITHIN(geom," + markerType + "(" + coordList + "))&outputFormat=application/json";
            }
            newaddGeoJsonToMap(url);
            coordList = '';
            markerFeature = undefined;
        }
    }

    document.getElementById('spQryClear').onclick = function () {
        if (queryGeoJSON) {
            queryGeoJSON.getSource().clear();
            map.removeLayer(queryGeoJSON);
        }

        if (clickSelectedFeatureOverlay) {
            clickSelectedFeatureOverlay.getSource().clear();
            map.removeLayer(clickSelectedFeatureOverlay);
        }
        coordList = '';
        markerFeature = undefined;
    }

    var mapInteractions = map.getInteractions();
    for (var x = 0; x < mapInteractions.getLength(); x++) {
        var mapInteraction = mapInteractions.item(x);
        if (mapInteraction instanceof ol.interaction.DoubleClickZoom) {
            map.removeInteraction(mapInteraction);
            break;
        }
    }

    for (var x = 0; x < mapInteractions.getLength(); x++) {
        var mapInteraction = mapInteractions.item(x);
        if (mapInteraction instanceof ol.interaction.DragPan) {
            map.removeInteraction(mapInteraction);
            break;
        }
    }

});
// end : onload functions