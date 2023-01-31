
var content = ` <div class='userPopup'>
                                    <h4>User Information</h4>
                                    <div class='userData'>
                                        <p> Name : ${profile.properties.first_name} ${profile.properties.last_name}</p>
                                        <p> Username: ${profile.properties.username}</p>
                                        <p> Email: ${profile.properties.email}</p>
                                        <p> Address: ${profile.properties.address}</p>
                                    </div>

                                    <div class="phone-number">
                                        <a href="tel:${profile.properties.phone}">${profile.properties.phone}</a>
                                    </div>
                                    <hr>
                                    <div class="coordinates">
                                        <p>
                                            Lat : ${profile.geometry.coordinates[1].toFixed(5)}
                                            Lng : ${profile.geometry.coordinates[0].toFixed(5)}
                                        </p>
                                    </div>
                                </div> `;


var latlng = getLatLng()
// var popup = L.popup(latlng ,{

var popup = L.popup({
    closeButton: false,
    autoClose: false,
    autoPan:true,
    maxHeight: 400,
    maxWidth: 400,
    minWidth : 400,
    className : "popup"
})

    .setLatLng(getLatLng())
    // .setLatLng([39.7392, -104.9903])
    // .setContent('<p>Text box on a map</p>')
    .setContent(content)
    .openOn(map);

marker.bindPopup(popupContent).openPopup();

var popup = L.popup(latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(map);

 var singleMarker = L.marker([28.3949, 84.1240], { icon: myIcon, draggable: true });
    var popup = singleMarker.bindPopup('This is the Nepal. ' + singleMarker.getLatLng()).openPopup()
    popup.addTo(map);

    var secondMarker = L.marker([29.3949, 83.1240], { icon: myIcon, draggable: true });

    console.log(singleMarker.toGeoJSON())


 .leaflet-popup-content-wrapper {
            background-color: #000000;
            color: #fff;
            border: 1px solid red;
            border-radius: 0px;