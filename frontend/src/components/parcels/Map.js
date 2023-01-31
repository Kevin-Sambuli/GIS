import {useState, useEffect, useRef} from "react";
import {MapContainer, Marker, Popup, TileLayer, LayersControl, useMap, useMapEvents} from 'react-leaflet';
import L, {latLng} from 'leaflet'
import CustomControls from "./Controls/CustomControls";
import MapControls from "./Controls/MapControls"
import DrawControls from "./Draw/MapDraw";
import MapDrawControls from "./Draw/DrawControls";
import SideBar from "./SideBar"
import './Map.css';
import {basemaps} from "./utils/baseLayers";
import BaseLayers from "./BaseLayers";
// import  L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const MapElement = () => {
    const [center, setCenter] = useState({lat: -1.29627, lng: 36.8748});
    const [coords, setCords] = useState(null);
    const [click, setClick] = useState(null);

    const position = [center.lat, center.lng];

    const MapEvents = () => {
    const map = useMap();
        useMapEvents({
            mousemove(e) {
                // setState your coords here coords exist in "e.latlng.lat" and "e.latlng.lng"
                setCords(e.latlng.lat.toFixed(5) + " " + e.latlng.lng.toFixed(5))
            },

            // click(e) {
            //     setClick(e.latlng.lat + " " + e.latlng.lng);
            //     map.locate();
            // },
            // locationfound(e) {
            //     setPosition(e.latlng)
            //     map.flyTo(e.latlng, map.getZoom())
            // },
        });
        return false;
    };


    return (
        // <MapContainer bounds={outerBounds} scrollWheelZoom={false}>
        <MapContainer layers={[basemaps.OpenStreetMaps]} center={center} zoomSnap={0.5} minZoom={12} zoom={12}
                      attributionControl={false} scrollWheelZoom={false}>
            <LayersControl collapsed={true} position="topright">
                <BaseLayers></BaseLayers>
                <LayersControl.Overlay checked name="Marker with popup">
                    <Marker position={position} draggable={true}>
                        <Popup>
                            <div>My pop up</div>
                            <div>{click}</div>
                        </Popup>
                    </Marker>
                </LayersControl.Overlay>
            </LayersControl>
            <MapControls/>
            <SideBar/>
            <MapEvents/>
            <div className='leaflet-control map-coordinate'>{coords}</div>
        </MapContainer>
    )
};

export default MapElement;