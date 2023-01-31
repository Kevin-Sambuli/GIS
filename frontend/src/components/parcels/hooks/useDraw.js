// import { useState, useEffect } from "react";
// import {useMap} from "react-leaflet";
//
// const useDraw = () => {
//     const [location, setLocation] = useState({
//         loaded: false,
//         coordinates: { lat: "", lng: "" },
//     });
//
//     const onSuccess = (location) => {
//     };
//
//     const onError = (error) => {
//     };
//
//     useEffect(() => {
//         if (!("geolocation" in navigator)) {
//             onError({
//                 code: 0,
//                 message: "Geolocation not supported",
//             });
//         }
//
//         navigator.geolocation.getCurrentPosition(onSuccess, onError);
//     }, []);
//
//     return location;
// };
//
// fetch("https://api.github.com/users?per_page=3")
//       .then((res) => res.json())
//       .then(
//         (data) => {
//           this.setState({
//             data: data
//           });
//         },
//         (error) => {
//           console.log(error)
//         }
//       );
//
// return (
//       <div className="App">
//         <h1>React AJAX call</h1>
//         <ul>
//           {data.map((item) => (
//             <li key={item.id}>{item.login}</li>
//           ))}
//         </ul>
//       </div>
//     );
//
// export default function App() {
//   const [data, setData] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//
//   useEffect(() => {
//     fetch("https://api.github.com/users?per_page=3")
//       .then((res) => res.json())
//       .then(
//         (data) => {
//           setData(data);
//           setLoading(false);
//         },
//         (error) => {
//           setError(error);
//           setLoading(false);
//         }
//       );
//   }, []);
//
//   if (error) {
//     return <div>Fetch request error: {error.message}</div>;
//   } else if (isLoading) {
//     return <h1>Loading data... </h1>;
//   } else {
//     return (
//       <div>
//         <h1>React AJAX call</h1>
//         <ul>
//           {data.map((item) => (
//             <li key={item.id}>{item.login}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   }
// }
// See a working codesandbox example here.


  // const markerRef = useRef(null)
  // const eventHandlers = useMemo(() => ({
  //     dragend() {
  //       const marker = markerRef.current
  //       if (marker != null) {
  //         setPosition(marker.getLatLng())
  //       }
  //     },
  //   }),
  //   [],)
  // const toggleDraggable = useCallback(() => {
  //   setDraggable((d) => !d)
  // }, [])
  //
  // return (
  //   <Marker
  //     draggable={draggable}
  //     eventHandlers={eventHandlers}
  //     position={position}
  //     ref={markerRef}>
  //   </Marker>
  // )