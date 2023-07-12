//
var southWest = L.latLng(-5, 32)
var northEast = L.latLng(6, 44)
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    // maxBounds: bounds,
    maxZoom: 15,
    minZoom: 7
}).setView([0.4, 38], 7)

map.setMaxBounds(map.getBounds());

// Get Map's Center
var centerBounds = map.getBounds().getCenter();

//zoom to extent button
$(".default-view").on("click", function () {
    map.setView(centerBounds, 6.2)
});


// zoom control options
var zoomOptions = {
    position: 'topright'
    // position: 'bottomleft'
};
// Creating zoom control
var zoom = L.control.zoom(zoomOptions);

// Adding zoom control to the map
zoom.addTo(map);

// scale control layer
L.control.scale({
    metric: true,
    imperial: false,
    position: 'bottomright',
    updateWhenIdle: true,
    maxWidth: 200
}).addTo(map);

// basemaps["None"].addTo(map);
basemaps["Terrain"].addTo(map);


//mouse hover coordinates
map.on("mousemove", function (e) {
    lat = e.latlng.lat.toFixed(5);
    lng = e.latlng.lng.toFixed(5)

    $(".map-coordinate").html("Lat : " + lat + " Lng : " + lng);

});


var roads = L.tileLayer.wms("http://localhost:8080/geoserver/kenya/wms",
    {
        layers: 'kenya:road',
        format: 'image/png',
        tiled: true,
        transparent: true,
        attribution: 'attribution'
    })//.addTo(map);
var lulc = L.tileLayer.wms("http://localhost:8080/geoserver/kenya/wms",
    {
        layers: 'kenya:kenya_lulc',
        format: 'image/png',
        tiled: true,
        transparent: true,
        attribution: 'attribution'
    }).addTo(map);

var country = L.tileLayer.wms("http://localhost:8080/geoserver/kenya/wms",
    {
        layers: 'kenya:counties',
        format: 'image/png',
        tiled: true,
        transparent: true,
        attribution: 'attribution'
    }).addTo(map);


var overLays = {
    'Lulc': lulc,
    'Roads': roads,
    'Counties': country,
}
L.control.layers(basemaps, overLays, {collapsed: true, position: 'topleft'}).addTo(map);


// L.control.sideBySide(basemaps.Dark.addTo(map), basemaps.Osm_Mapnik.addTo(map)).addTo(map)


var sideBySide;
var drawToggler = true;

function compareLayers() {
    if (drawToggler) {
        sideBySide = L.control.sideBySide(roads, country)
        sideBySide.addTo(map);
        // sideBySide.setLeftLayers(roads)
        // sideBySide.setRightLayers(country)
        drawToggler = !drawToggler;

    } else {
        drawToggler = true;
        map.removeControl(sideBySide)
    }

}


// function makePopupContent(profile) {
//     return ` <div class='userPopup'>
//                 <h4>Layer Information</h4>
//                 <div class='userData'>
//                     <p> Name : ${profile.properties.first_name} ${profile.properties.last_name}</p>
//                     <p> Username: ${profile.properties.username}</p>
//                     <p> Email: ${profile.properties.email}</p>
//                     <p> Address: ${profile.properties.address}</p>
//                 </div>
//
//                 <div class="phone-number">
//                     <a href="tel:${profile.properties.phone}">${profile.properties.phone}</a>
//                 </div>
//                 <hr>
//                 <div class="coordinates">
//                     <p>
//                         Lat : ${profile.geometry.coordinates[1].toFixed(5)}
//                         Lng : ${profile.geometry.coordinates[0].toFixed(5)}
//                     </p>
//                 </div>
//             </div> `;
// };

const onEachFeature = (feature, layer) => {
    layer.bindPopup(makePopupContent(feature), {closeButton: true, offset: L.point(0, -8)});
};

// $.getJSON("{% url 'user_profiles' %}", function (data) {
//     info.update(`Total = ${data.features.length}`);
//     geojsonLayer = new L.geoJSON(data, {
//         onEachFeature: onEachFeature
//     }).addTo(users)
// });
// users.addTo(map);


function makePopupContent() {
    return `<div class='layerPopup '>
                <h4>Layer Information</h4>
                <div class='layerData'>
                    <p> Name : kevin</p> 
                    <p> Username: sambuli</p>
                    <p> Email: sambulikevin@gmail.com</p>
                    <p> Address: Nairobi</p>
                </div>
                
                <hr class="m-2">
                
                <div class="p-2 image">
                    <img src="../assets/kenya3.png">
                </div>
                
                <hr class="m-2">
                <div class="coordinates">
                    <p>
                        Lat : -1
                        Lng : 36
                    </p>
                </div>
            </div> `;
};


var marker = L.marker([1, 40], {
    draggable: true,
    title: "Click to Open",
    // opacity: 0.7
});

var popup = marker
    .bindPopup(makePopupContent())
    .addTo(map)
    // .openPopup();


L.marker([-2, 36], {
    draggable: true,
    title: "Click to Open",
}).bindPopup(makePopupContent())
    .addTo(map)
    // .openPopup();



