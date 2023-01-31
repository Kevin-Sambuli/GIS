import L from "leaflet";

let legend = L.control({position: "bottomleft"});
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = `<p><b>Simple shapes in Leaflet</b></p><hr>
        <p>This map shows an example of adding shapes on a Leaflet map</p>
        The following shapes were added:<br>
        <p><ul>
        <li>A marker</li> 
        <li>A line</li>
        <li>A polygon</li>
        </ul></p>
        The line layer has a <b>popup</b>.
        Click on the line to see it!<hr>
         Created with the Leaflet library<br>
        <img src="images/leaflet.png">`;
    return div;
};
legend.addTo(map);


const GetCoordinates = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const info = L.DomUtil.create('div', 'legend');

    const positon = L.Control.extend({
      options: {
        position: 'bottomleft'
      },

      onAdd: function () {
        info.textContent = 'Click on map';
        return info;
      }
    })

    map.on('click', (e) => {
      info.textContent = e.latlng;
    })

    map.addControl(new positon());

  }, [map])


  return null

}

const MapWrapper = () => {
  return (
    <MapContainer center={center} zoom={18} scrollWheelZoom={false}>
      <TileLayer {...tileLayer} />

      <GetCoordinates />

    </MapContainer>
  )
}

export default MapWrapper;
