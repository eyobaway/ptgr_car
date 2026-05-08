"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Vehicle } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getFileUrl } from "@/lib/api";
import { cn } from "@/lib/utils";


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

interface AllVehiclesMapProps {
    vehicles: Vehicle[];
    center?: [number, number];
    userLocation?: [number, number] | null;
}

// Helper component to handle programmatic recentering
function RecenterAutomatically({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

const AllVehiclesMap = ({ vehicles, center, userLocation }: AllVehiclesMapProps) => {
    // Default center to Los Angeles if no vehicles or use the first vehicle's location
    const defaultCenter: [number, number] = vehicles.length > 0
        ? [vehicles[0].location.lat, vehicles[0].location.lng]
        : [34.0522, -118.2437];

    const currentCenter = center || defaultCenter;

    return (
        <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden premium-shadow border border-slate-100 relative z-0">
            <MapContainer
                key={vehicles.length} // Force remount if vehicle list changes
                center={currentCenter}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterAutomatically center={currentCenter} />

                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={new L.DivIcon({
                            className: 'custom-user-location',
                            html: `<div class="w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg pulse"></div>`,
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                        })}
                    >
                        <Popup>
                            <div className="font-outfit font-bold text-center">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {vehicles.map((vehicle) => (
                    <Marker
                        key={vehicle.id}
                        position={[vehicle.location.lat, vehicle.location.lng]}
                        icon={customIcon}
                    >
                        <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent={false}>
                            <div className="p-1 font-outfit">
                                <div className="font-bold text-slate-900">${Number(vehicle.price.replace(/[^0-9.-]+/g, "")).toLocaleString()}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{vehicle.address}</div>
                            </div>
                        </Tooltip>
                        <Popup className="vehicle-popup">
                            <div className="w-[200px] font-outfit">
                                <div className="relative h-[120px] w-full rounded-xl overflow-hidden mb-2">
                                    <Image
                                        src={getFileUrl(vehicle.image) || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"}
                                        alt={vehicle.address}
                                        fill

                                        className="object-cover"
                                    />
                                    <div className={cn(
                                        "absolute top-2 left-2 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm",
                                        vehicle.type === "SALE" ? "bg-[#7b1919]/90" : "bg-primary/90"
                                    )}>
                                        {vehicle.type}
                                    </div>
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 mb-0.5">${(typeof vehicle.price === 'string' ? Number(vehicle.price.replace(/[^0-9.-]+/g, "")) : Number(vehicle.price)).toLocaleString()}</h3>
                                <p className="text-xs text-slate-500 mb-2">{vehicle.address}, {vehicle.city}</p>
                                <div className="flex items-center gap-3 text-[10px] text-slate-600 mb-3">
                                    <span className="flex items-center gap-1">🚗 {vehicle.make} {vehicle.model}</span>
                                    <span className="flex items-center gap-1">📅 {vehicle.year}</span>
                                </div>
                                <Link
                                    href={`/vehicle/${vehicle.id}`}
                                    className="block w-full py-1.5 text-center bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-primary transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AllVehiclesMap;
