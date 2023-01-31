import {Fragment, useState, useEffect} from "react";
import {FeatureGroup, useMap} from 'react-leaflet';
import Draw from 'leaflet-draw';
import L from 'leaflet';
// import './MapDraw.css';
import {centroid} from "@turf/turf";
import CreateFormPopup from '../FormPopup';
import {EditControl} from "react-leaflet-draw";


const DrawControls = ({exportHandler}) => {
    const map = useMap();
    const [coords, setCoords] = useState({
        id: null,
        data: null,
        latlngs: null
    });
    // const [editLayer, setMapLayers] = useState([])
    const [editLayer, setMapLayers] = useState()

    // var editableLayers = new L.FeatureGroup();
    // var layerEditable = new L.FeatureGroup();

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const handleExport = () => {
        // exportHandler(editableLayers);
    }

    const createPopup = (layer) => {
        var popupContent =
            `<div class="form">
                <form id="geoform">
                    <h3 style="color: whitesmoke">Parcel Information</h3>
                    <input type="text" name="lrnumber" id="lrnumber" placeholder="LRN0/0001" required></input><br><br>
                    <input type="number" name="plotno" id="plotno" placeholder="Plot Number" required></input><br><br>

                    <input style="color: #ffffff" class="btn btn-primary btn-block" id='saved' type="button"
                           value="Save"></input>
                </form>
            </div>`

        layer.bindPopup(popupContent).openPopup();
    };


    const drawCreated = (e) => {
        var layerType = e.layerType,
            layer = e.layer;

        console.log(e.layer.getCenter())

        // layer.addTo(editableLayers);

        // console.log('editable layers', editableLayers)

        // console.log(JSON.stringify(layer.toGeoJSON().geometry));
        // console.log(layer.getLatLngs()[0]);
        // console.log(layer.toGeoJSON().geometry);
        // console.log(layer.toGeoJSON().geometry.coordinates[0].length);

        if (layerType === 'polygon') {
            const id = e.layer._leaflet_id
            console.log('id', id);
            // setCoords(prevState => ({
            //         ...prevState,
            //         id: 'e.layer._leaflet_id',
            //         data: 'e.layer.toGeoJSON().geometry',
            //         latlngs: 'e.layer.getLatLngs()[0]'
            //     })
            // )
            createPopup(layer);
        };
        console.log('coords', coords);
    };

    const drawEdited = (e) => {

        const {layers: {_layers},} = e;
        // const { layers } = e;
        // const { _layers } =  layers;

        Object.values(_layers).map(({_leaflet_id, editing}) => {
            setMapLayers((layers) =>
                layers.map((l) =>
                    l.id === _leaflet_id ? {...l, latlngs: {...editing.latlngs[0]}} : l
                )
            );
        });
    };

    const drawDeleted = (e) => {
        console.log(e);
        const {layers: {_layers},} = e;

        Object.values(_layers).map(({_leaflet_id}) => {
            setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
        });
    };


    return (
        <Fragment>
            <FeatureGroup>
                <EditControl
                    position='bottomleft'
                    onCreated={drawCreated}
                    onEdited={drawEdited}
                    onDeleted={drawDeleted}
                    draw={
                        {
                            polyline: {
                                shapeOptions: {
                                    color: '#2b542c',
                                    weight: 5,
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
                            marker: true,
                            // marker: {icon: new MyCustomMarker()}

                            polygon: {
                                shapeOptions: {
                                    stroke: true,
                                    color: '#2b542c',
                                    weight: 5,
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
                                    color: "#880000", // Color the shape will turn when intersects
                                    message: "<strong>Polygon cant Intersect!!!  <strong>  Correct the shape!" // Message that will show when intersect
                                },
                                showArea: true,
                                showLength: true,
                                strings: `['ha', 'm']`,
                                metric: true,
                                feet: false,
                                nautic: false,
                                precision: {km: 2, ft: 0}
                            }
                        }
                    }
                    edit={
                        {
                            edit: true,
                            featureGroup: drawnItems,
                            remove: true,
                            poly: {
                                allowIntersection: false
                            }
                        }
                    }
                >
                </EditControl>

                {/*<CreateFormPopup></CreateFormPopup>*/}

            </FeatureGroup>
        </Fragment>
    )
};

export default DrawControls;