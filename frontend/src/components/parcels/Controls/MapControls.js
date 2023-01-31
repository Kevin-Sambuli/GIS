import React, {Fragment, useEffect, useState} from "react";
import useGeoLocation from "../hooks/useGeolocation";
import {Marker, useMap} from 'react-leaflet';
import CustomControls from "./CustomControls";
import '../Draw/DrawControl.css'
import L from 'leaflet';



const MapControls = () => {
    const [pin, showPin] = useState(false);
    const map = useMap();
    const ZOOM_LEVEL = 16;

    const location = useGeoLocation();

    useEffect(() => {

        // var wfsLayer = L.Geoserver.wfs("http://localhost:8080/geoserver/wfs", {
        //     layers: "kenya:airports",
        // }).addTo(map);
        // wfsLayer.addTo(map);

        // var layerLegend = L.Geoserver.legend("http://localhost:8080/geoserver/wms", {
        //     layers: "kenya:nairobi",
        //     // style: `stylefile`,
        // }).addTo(map);

        // layerLegend.addTo(map);

        var nairobiPlots = L.tileLayer.wms("http://localhost:8080/geoserver/wms",
            {
                layers: 'nairobi',
                format: 'image/png',
                transparent: true,
                tiled: true,
                opacity: 0.6,
                zIndex: 100,
                attribution: "Nairobi Land Parcels"
            }).addTo(map);
        var counties = L.tileLayer.wms("http://localhost:8080/geoserver/wms",
            {
                layers: 'counties',
                format: 'image/png',
                transparent: true,
                tiled: true,
                opacity: 0.6,
                zIndex: 100,
                attribution: "Kenya Counties"
            }).addTo(map);


        const marker = L.marker([-1.667, 36.9876], {draggable: true});
        marker.bindPopup('My Marker')
        marker.on('click', () => {
            console.log('marker clicked')
        })
        marker.addTo(map);

        //  map.locate({
        //     setView: true,
        // });
        const locationFound = (event) => {
            console.log(event.latlng)
            const latlng = event.latlng;
            const marker = L.marker(latlng);

            marker.addTo(map);

            const radius = event.accuracy;

            const circle = L.circle(latlng, {
                radius: radius,
                color: '#26c6da'
            });
            circle.addTo(map)
        };
        map.on('locationfound', locationFound);
    }, [])


    var centerBounds = map.getBounds().getCenter();


    const fullScreenView = () => {
        const elm = document.getElementById("root");
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            elm.requestFullscreen();
        }
    };

    const fullScreenToggler = () => {
        var doc = document,
            elm = document.getElementById("root");

        if (elm.requestFullscreen) {
            !doc.fullscreenElement ? elm.requestFullscreen() : doc.exitFullscreen();
        } else if (elm.mozRequestFullScreen) {
            !doc.mozFullScreen ? elm.mozRequestFullScreen() : doc.mozCancelFullScreen();
        } else if (elm.msRequestFullscreen) {
            !doc.msFullscreenElement
                ? elm.msRequestFullscreen()
                : doc.msExitFullscreen();
        } else if (elm.webkitRequestFullscreen) {
            !doc.webkitIsFullscreen
                ? elm.webkitRequestFullscreen()
                : doc.webkitCancelFullscreen();
        } else {
            console.log("Fullscreen support not detected.");
        }
    }

    const defaultView = () => {
        map.setView(centerBounds, 6)
    };
    map.setMaxBounds(map.getBounds());


    const showTable = () => {
        alert('change state to toggle between view')
    }

    const showMyLocation = () => {
        if (location.loaded && !location.error) {
            showPin(true)
            map.flyTo(
                [location.coordinates.lat, location.coordinates.lng],
                ZOOM_LEVEL,
                {animate: true}
            );
        } else {
            alert(location.error.message);
        }
    };


    return (
        <Fragment>
            {pin && (
                <Marker
                    position={[
                        location.coordinates.lat,
                        location.coordinates.lng,
                    ]}
                ></Marker>
            )}
            <CustomControls></CustomControls>
            <div className="leaflet-control map-functions">
                <div className="default-view controls" onClick={defaultView} data-toggle="tooltip"
                     title="Zoom full extent">
                    <i className="fas fa-home"></i>
                </div>

                <div className="full-screen controls" onClick={fullScreenView} data-toggle="modal"
                     title="Toggle Full screen">
                    <i className="fas fa-arrows-alt"></i>
                </div>

                <div className="print controls" data-toggle="tooltip" title="Print The Map extent">
                    <i className="fas fa-print"></i>
                </div>

                <div className="info controls" data-target="tooltip" onClick={showTable}
                     title="Get Feature Info in table">
                    <i class="fas fa-info"></i>
                </div>

                <div className="locate controls" data-target="tooltip" onClick={showMyLocation} title="Get My Loation">
                    <i className="fas fa-street-view"></i>
                </div>

                <div className="controls disabled  leaflet-prevent" id="pin" data-toggle="tooltip"
                     title="Toggle Map Interaction">
                    <i className="fas fa-map-pin"></i>
                </div>
            </div>
        </Fragment>
    )
}

export default MapControls;