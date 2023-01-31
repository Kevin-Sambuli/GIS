//   map.pm.addControls({
//             position: 'bottomright',
//               polyline: {
//                             shapeOptions: {
//                                 color: '#2b542c',
//                                 weight: 5,
//                             },
//                             metric: true
//                         }
//         });
//
// map.pm.addControls({
//           positions: {
//             draw: 'bottomright',
//             edit: 'bottomleft',
//           },
//         });
//         map.pm.setGlobalOptions({ pinning: true, snappable: false });
//         map.pm.setGlobalOptions({ measurements: { measurement: true, displayFormat: 'metric' } , pinning: true, snappable: false })

  //
  //        map.on('pm:create', (e) => {
  //            console.log(e.layer)
  //            console.log(e.layer.toGeoJSON().geometry);
  //            console.log(JSON.stringify(e.layer.toGeoJSON().geometry), 4);
  //
  //
  //       setCoords(prevState => ({
  //                   ...prevState,
  //                   id: e.layer._leaflet_id,
  //                   data: e.layer.toGeoJSON().geometry,
  //                   // centroid: [center.lat, center.lng],
  //                   latlngs: e.layer.getLatLngs()[0]
  //               })
  //           );
  //        })