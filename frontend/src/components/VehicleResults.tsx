"use client";

import React, { useState } from "react";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import ListingGrid from "@/components/ListingGrid";
import dynamic from "next/dynamic";
import { Vehicle } from "@/lib/data";

// Dynamically import the map to avoid SSR issues with Leaflet
const AllVehiclesMap = dynamic(() => import("@/components/AllVehiclesMap"), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
});

interface VehicleResultsProps {
    vehicles: Vehicle[];
    isLoading?: boolean;
    isError?: boolean;
}

export default function VehicleResults({ vehicles, isLoading, isError }: VehicleResultsProps) {
    if (isError) {
        return (
            <div className="text-center py-20 text-red-500 font-bold bg-white rounded-[3rem] border border-slate-100 p-12">
                Error loading vehicles. Please try again later.
            </div>
        );
    }

    const [view, setView] = useState<"grid" | "map">("grid");

    return (
        <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-slate-500 font-medium">
                    Showing <span className="text-slate-900 font-bold">{vehicles.length}</span> vehicles
                </h2>

                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 premium-shadow w-fit">
                    <button
                        onClick={() => setView("grid")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === "grid"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Grid</span>
                    </button>
                    <button
                        onClick={() => setView("map")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === "map"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                    >
                        <MapIcon className="w-4 h-4" />
                        <span>Map</span>
                    </button>
                </div>
            </div>

        {view === "grid" ? (
            <ListingGrid vehicles={vehicles} isLoading={isLoading} skeletonCount={6} columns={2} />
        ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AllVehiclesMap vehicles={vehicles} />
                </div>
            )}
        </div>
    );
}
