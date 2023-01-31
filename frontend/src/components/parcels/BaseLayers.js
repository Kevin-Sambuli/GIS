import L from "leaflet";
import {Fragment} from "react";
import { LayersControl, Marker, Popup, TileLayer } from "react-leaflet";

const { BaseLayer } = LayersControl

const BaseLayers = () => {
    return (
        <Fragment>
            <BaseLayer name="OpenStreetMap">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            </BaseLayer>
            <BaseLayer name="Dark">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"/>
            </BaseLayer>
            <BaseLayer name="Google-Map">
                <TileLayer url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"/>
            </BaseLayer>
            <BaseLayer name="Topo">
                <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"/>
            </BaseLayer>
        </Fragment>
    )
};


export default BaseLayers;
