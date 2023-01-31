import {Fragment, useState, useEffect} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import L from 'leaflet'
import Draw from 'leaflet-draw';
import MapDrawControls from "../Draw/DrawControls";
import drawOptionFunc from "../utils/drawOptions";
import './CustomControls.css';


const CustomControls = () => {
    const map = useMap();
    const [draw, toggleDraw] = useState(false)

    // animateRef.current = !animateRef.current
    const showDrawHandler = () => {
        if (!draw) {
            toggleDraw(true);
            // map.addControl(drawControl);
        } else {
            toggleDraw(false);
            // map.removeControl(drawControl);
            map.off('click');
        }
    };

    const exportHandler = (editableLayers) => {
        alert('exported')
        const geodata = JSON.stringify(editableLayers.toGeoJSON(), null, 4);
        console.log('serialized data', geodata);

        // Stringify the GeoJson
        const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(geodata);

        // Create export
        document.getElementById('export').setAttribute('href', 'data:' + convertedData);
        document.getElementById('export').setAttribute('download', 'data.geojson');
    };

    return (
        <Fragment>
            {draw ? <MapDrawControls exportHandler={exportHandler}/> : null }

            <div className='controls'>
                <div className="toggler" id='draw' data-toggle="tooltip" title="Toggle Digitization"
                     onClick={showDrawHandler}>Draw
                </div>
                <a href='#' className='export' id='export' title="Save Features to the database"
                   onClick={exportHandler}>Export
                </a>
                <div className='delete' id='delete' title="Delete the Digitized features">Delete
                </div>
            </div>

            <div className="leaflet-control basic-functions">
                <div className="upload btns" data-toggle="modal" data-target="#form2" title="Upload Shapefile">
                    <i className="fas fa-upload"></i>
                </div>

                <div className="download btns" data-toggle="tooltip" title="Download Shapefile">
                    <i className="fas fa-download"></i>
                </div>

                <div className="statistics btns" data-toggle="modal" data-target="#form" title="Statistics">
                    <i className="fas fa-signal"></i>
                </div>


                <div className="query btns" data-toggle="modal" data-target="#form" title="Query Builder">
                    <i className="fas fa-cogs"></i>
                </div>

                <div className="lock-map btns" data-toggle="modal" data-target="#form" title="Open Map Controls">
                    <i className="fas fa-lock-open"></i>
                </div>

            </div>


        </Fragment>
    )
};

export default CustomControls;