
// var parser = new ol.format.WFS();


// fetch('http://geospatialdev.com/geoserver/data/wfs?service=wfs&version=1.1.0&request=GetCapabilities')
fetch('http://127.0.0.1:8000/parcels/get_capabilities/')
    .then(function(response) {
        return response.text();
    })
    .then(function(text) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(text, "application/xml");
        console.log(xmlDoc);
        var layerList = xmlDoc.getElementsByTagName("FeatureType");
        console.log(layerList);
        var layers = [];
        for (var i = 0; i < layerList.length; i++) {
            var name = layerList[i].getElementsByTagName("Name")[0].textContent;
            var title = layerList[i].getElementsByTagName("Title")[0].textContent;
            console.log('name', name);
            console.log('title', title);

            var layer = new ol.layer.Vector({
                title: title,
                source: new ol.source.Vector({
                    url: 'http://geospatialdev.com/geoserver/data/wfs?service=wfs&version=1.0.0&request=GetFeature&typeName=' + name + '&outputFormat=application/json',
                    format: new ol.format.GeoJSON()
                }),
            });
            layers.push(layer);
        }
        console.log(layers);
        // Add the layers to the map
        map.addLayers(layers);
    });




// fetch(`https://jsonplaceholder.typicode.com/posts`, {
//     method: 'POST',
//     body: JSON.stringify(values),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// }).then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.error("Error:", err));

// (function (open) {
//     XMLHttpRequest.prototype.open = function () {
//         var method = arguments[0].toLowerCase();
//         var url = arguments[1];
//         if (url == undefined) {
//             console.log(arguments)
//         }
//         if ((method === 'get' || method === 'post')) {
//             this.withCredentials = true;
//             open.apply(this, arguments);
//             this.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + pwd));
//         } else {
//             open.apply(this, arguments);
//         }
//     };
// })(XMLHttpRequest.prototype.open);
//
// var user = 'poi'; //geoserver username
// var pwd = 'geoserver'; //geoserver password
//
// function xhrTileLoadFunction(tile, src) {
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = "arraybuffer";
//     xhr.onload = function () {
//         var arrayBufferView = new Uint8Array(this.response);
//         var blob = new Blob([arrayBufferView], {type: 'image/png'});
//         var urlCreator = window.URL || window.webkitURL;
//         var imageUrl = urlCreator.createObjectURL(blob);
//         tile.getImage().src = imageUrl;
//     };
//     xhr.open("GET", src);
//     xhr.send();
// }
//
//
// var wmsSource = new ol.source.TileWMS({
//     url: 'http://' + serverPort + geoserverWorkspace + '/wms',
//     params: {'LAYERS': geoserverWorkspace + ':' + countyLayerName},
//     tileLoadFunction: xhrTileLoadFunction,
//     serverType: 'geoserver',
//     crossOrigin: 'use-credentials'
// });
//
// var wmsLayer = new ol.layer.Tile({
//     source: wmsSource
// });
//
// var view = new ol.View({
//     projection: 'EPSG:4326',
//     center: [-74, 40],
//     zoom: 5
// });
//
// var map = new ol.Map({
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.OSM()
//         }),
//         wmsLayer],
//     target: 'map',
//     view: view
// });
//
// //on click info
// map.on('singleclick', function (evt) {
//     document.getElementById('info').innerHTML = '';
//     var viewResolution = /** @type {number} */ (view.getResolution());
//     var url = wmsSource.getGetFeatureInfoUrl(
//         evt.coordinate, viewResolution, 'EPSG:4326',
//         {'INFO_FORMAT': 'application/json'});
//     if (url) {
//         fetch(url, {
//             headers: new Headers({
//                 'Authorization': 'Basic ' + btoa(user + ":" + pwd),
//             }),
//         })
//             .then(res => res.json())
//             .then(data => console.log(data))
//     }
// });
