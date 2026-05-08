"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon missing in React-Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

const ChangeView = ({ center }: { center: L.LatLngExpression }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
};

const LocationMarker = ({ position, setPosition, onLocationSelect }: any) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            onLocationSelect(lat, lng);
        },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
};

const LocationPicker = ({ onLocationSelect, initialLat = 34.0522, initialLng = -118.2437 }: LocationPickerProps) => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    // If initial values are provided (e.g. from Geolocation or editing), set them
    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition({ lat: initialLat, lng: initialLng });
        }
    }, [initialLat, initialLng]);

    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden premium-shadow border border-slate-100 relative z-0">
            <MapContainer
                center={[initialLat, initialLng]}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <ChangeView center={[initialLat, initialLng]} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
            </MapContainer>

            {/* Overlay instruction */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm border border-slate-200 pointer-events-none">
                Click map to select location
            </div>
        </div>
    );
};

export default LocationPicker;
