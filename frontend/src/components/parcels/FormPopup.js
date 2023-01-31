import {Popup, useMap} from 'react-leaflet'
import {useState} from "react";
import L from "leaflet";

const CreateFormPopup = ({center}) => {
    const [popup, setUpPosition] = useState(null);
    const [formData, setFormData] = useState({
        lrnumber: "",
        plotno: "",
        coordinates : ""
    });

    const {lrnumber, plotno, coordinates } = formData;

    const submitHandler = (e) => {
        e.preventDefault();
        // coordinates = JSON.stringify(layer.toGeoJSON().geometry)
        const data = {
            lrnumber: lrnumber,
            plotno: plotno,
            coordinates: coordinates
        }
    };

    const changeHandler = (e) => {
        /* const {name, value} = e.target;*/
        setFormData(prevState => ({
             ...prevState,
                [e.target.name]: e.target.value
        }));
    };

    console.log(formData);

    return (
        <Popup position={center}>
            <div className="form">
                <form id="geoform">
                    <h3 style="text-align: center; color: #66512c">Parcel Information</h3>
                    <input type="text" name="lrnumber" id="lrnumber"
                           onChange={changeHandler} value={lrnumber}
                           placeholder="LRN0/0001" required>
                    </input>
                    <input type="number" name="plotno" id="plotno"
                           onChange={changeHandler} value={plotno}
                           placeholder="Plot Number" required>
                    </input>

                    <input style="color: #ffffff" className="btn btn-primary btn-block" id='save'
                           onClick={submitHandler} type="button" value="Save">
                    </input>
                </form>
            </div>
        </Popup>
    )
};

export default CreateFormPopup;