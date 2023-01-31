import {useEffect} from "react";
import L from "leaflet";

useEffect(() => {
        // console.log(mapRef.current);

        const {current = {}} = mapRef
        console.log('mapRef', mapRef.current);

        // const {leafletElement: map} = current;
        // if (!map) return;



        const marker = L.marker([-1.667, 36.9876]);
        marker.bindPopup('My Marker')
        marker.on('click', () => {
            console.log('marker clicked')
        })
        marker.addTo(map);



        var  locationPoint = [-1.667, 36.9876]
        map.setView(locationPoint);

        map.locate({
            setView: true,
        }) //prints thelocation of the browser

        const locationFound = (event) =>{
            console.log(event)
            const latlng = event.latlng;
            const marker= L.marker(latlng);

            marker.addto(map);

            const radius = event.accuracy;

            const circle = L.circle(latlng,{
                radius: radius,
                color : '#26c6da'
            });
            circle.addTo(map)
        };

        map.on('locationfound', locationFound);


        // working with geojson with point data
        const geojson = L.GeoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, {
                    icon: new L.Icon({
                        // import IconImage from'./static/images/image.png
                        iconUrl: IconImage,
                        iconSize: [26, 26],
                        popupAnchor: [0, -15],
                        iconAnchor: [22, 94],
                        shadowUrl: 'my-icon-shadow.png',
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    })
                });
            },
            onEachFeature: (feature = {}, layer) => {
                const {properties = {}, geometry = {}} = feature;
                const {name, delivery, tags, phone, deliveryRadius} = properties;
                const {coordinates} = geometry;

                let deliveryZoneCircle;

                if (delivery) {
                    deliveryZoneCircle = L.circle(coordinates.reverse(), {
                        radius: deliveryRadius,
                        color: 'blueviolet'
                    });
                    // deliveryZoneCircle.addTo(map);
                }

                const popup = L.Popup;

                const html = `
                <div>
                    <div>${name}</div>
                    <div>${delivery}</div>
                </div>`

                popup.setContent(html)
                layer.bindPopup(popup)
                layer.on('mouseover', () => {
                    if (deliveryZoneCircle) {
                        deliveryZoneCircle.addTo(map);
                    }
                });
                layer.on('mouseout', () => {
                    if (deliveryZoneCircle) {
                        deliveryZoneCircle.removeFrom(map);
                    }
                });

            }
        });
        // geojson.addTo(map)

        return () => {
            map.off('locationfound', locationFound)
        }

    }, [mapRef])





