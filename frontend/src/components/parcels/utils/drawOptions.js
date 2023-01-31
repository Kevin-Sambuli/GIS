import L from "leaflet";

var MyCustomMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
    }
});

const drawOptionFunc = (editableLayers) => {
    return {
        position: "bottomleft",
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#2b542c',
                    weight: 5,
                },
                metric: true
            },
            // circle: true, // Turns off this drawing tool
            circle: {
                shapeOptions: {
                    color: '#2b542c',
                    weight: 15,
                }
            },
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
            },
        },
        // edit:false
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true,
            poly: {
                allowIntersection: false
            }
        }
    }
};

export default drawOptionFunc;