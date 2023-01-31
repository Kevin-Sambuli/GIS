import {useEffect, useState} from "react";
import {useMap} from "react-leaflet";
import drawOptionFunc from "../utils/drawOptions";
import FormPopup from "../FormPopup";
import L from "leaflet";
import {bbox} from "@turf/turf";
// import layers from "leaflet";
import {bboxPolygon} from "@turf/turf"

const format = {
    "type": "Feature",
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
            [
                [
                    [
                        36.9727850703337,
                        -1.2665947750621
                    ],
                    [
                        36.9725874462042,
                        -1.26644557834928
                    ],
                    [
                        36.9727491571652,
                        -1.26622858905747
                    ],
                    [
                        36.9729467813273,
                        -1.26637778574649
                    ],
                    [
                        36.9727850703337,
                        -1.2665947750621
                    ]
                ]
            ]
        ]
    },
    "properties": {
        "areah": 0.0825002,
        "perm": 115.0,
        "plotno": 2000,
        "lrnumber": "LRNO/2000",
        "owner": null
    }
}

const MapDrawControls = ({exportHandler}) => {
    const map = useMap();
    const [popup, setPopup] = useState(false);
    const [editLayer, setMapLayers] = useState([]);
    const [formData, setFormData] = useState({
        lrnumber: null,
        plotno: null,
    });
    const [coords, setCoords] = useState({
        id: '',
        data: '',
        latlngs: '',
        centroid: ''
    });

    var editableLayers = new L.FeatureGroup().addTo(map);
    var drawOptions = drawOptionFunc(editableLayers);
    var drawControl = new L.Control.Draw(drawOptions);


    const setData = (e) => {
        /* the function below received data from the form and updates the state*/
        if (e.target && e.target.id === "save") {
            let lrnumber = document.getElementById("lrnumber").value;
            let parcelid = document.getElementById("plotno").value;

            console.log("------------", lrnumber);
            console.log("------------", parcelid);

            setFormData(prevState => ({
                    ...prevState,
                    lrnumber: lrnumber,
                    parcelid: parcelid
                })
            );
        }
        ;
        // editableLayers.eachLayer(function (layer) {
        //     layer.closePopup();
        // });
    };

    const createPopup = (layer) => {
        var popupContent =
            `<div class="form">
                <form id="geoform">
                    <h3 style="color: whitesmoke">Parcel Information</h3>
                    <input type="text" name="lrnumber" id="lrnumber" placeholder="LRN0/0001" required></input><br><br>
                    <input type="number" name="plotno" id="plotno" placeholder="Plot Number" required></input><br><br>

                    <input style="color: #ffffff" class="btn btn-primary btn-block" id='save' type="button"
                           value="Save"></input>
                </form>
            </div>`

        layer.bindPopup(popupContent).openPopup();
        // layer.bindPopup(popupContent, {keepInView: true, closeButton: true, autoClose: true, autoPan: false}).openPopup();
    };

    const onCreated = (e) => {
        var layerType = e.layerType,
            layer = e.layer;

        editableLayers.addLayer(layer);

        // console.log(JSON.stringify(layer.toGeoJSON().geometry));
        // console.log(layer.getLatLngs()[0]);
        // console.log(layer.toGeoJSON().geometry);
        // console.log(layer.toGeoJSON().geometry.coordinates[0].length);

        // console.log(e.layerType);
        // console.log((<any>e.layer).getLatLngs()); // polyline
        // console.log((<any>e.layer).getLatLng()); // circle

        // e.layerType // polygon, circle, etc.

        // polygon
        // e.layer.getLatLngs()

        // circle
        // e.layer.getLatLng()
        // e.layer.getRadius()


        // e.layer.toGeoJSON().geometry.type // is point if circle
        // e.layer.toGeoJSON().geometry.coordinates

        if (layerType === 'polygon') {
            // The function call opens up a pop up on the document
            createPopup(layer);

            // getting the center coordinates of the drawn polygon
            var center = e.layer.getCenter();
            console.log('layer center', center);
            console.log('geojson', JSON.stringify(layer.toGeoJSON().geometry, 2, 4) );

            // console.log(bboxPolygon(layer.getLatLngs()[0]))

            // the function below updates the statte of the draw polygonn on the map
            setCoords(prevState => ({
                    ...prevState,
                    id: layer._leaflet_id,
                    data: JSON.stringify(layer.toGeoJSON().geometry),
                    centroid: [center.lat, center.lng],
                    latlngs: layer.getLatLngs()[0]
                })
            );
        }
        ;
        if (layerType === 'rectangle') {
             layer.on('mouseover', function() { alert(layer.getLatLngs()); });

            console.log(layer.getLatLngs()['LatLng'])
            console.log(typeof (layer.getLatLngs()))
            // var bounds =[
            //             [layer.getLatLngs()[0][0], layer.getBounds()[0][1]],
            //             [layer.getLatLngs()[2][0], layer.getBounds()[2][1] ]
            //         ];
            // alert(bounds)
            // var centerBounds = map.getBounds().getCenter();
            // var zoom = map.getBoundsZoom(layers.getBounds());
            // alert(zoom)
            // map.setView(layers.getBounds(), zoom);
        }
    };

    const drawEdited = (e) => {
        const {layers: {_layers},} = e;

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

    console.log('formdata', formData);

    useEffect(() => {
        //adding the draw controls to the map
        map.addControl(drawControl);
        // L.control.scale().addTo(map);

        // map.on(L.Draw.Event.CREATED, onCreated);
        map.addEventListener("draw:created", onCreated);
        // map.addEventListener('draw:edited', drawEdited);
        // map.addEventListener('draw:deleted', drawDeleted);

        document.addEventListener("click", setData);

    }, [])

    // return <div></div>
    return (
        <div>
            {popup ? <FormPopup center={coords.centroid}></FormPopup> : <div></div>}
        </div>
    )
};

export default MapDrawControls;