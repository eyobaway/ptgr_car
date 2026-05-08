import React from "react";
import { Vehicle } from "@/lib/data";
import VehicleCard from "@/components/VehicleCard";
import VehicleSkeleton from "./VehicleSkeleton";

interface ListingGridProps {
    vehicles: Vehicle[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isLoading?: boolean;
    skeletonCount?: number;
    columns?: 2 | 3;
}

const ListingGrid = ({ vehicles, onEdit, onDelete, isLoading, skeletonCount = 3, columns = 3 }: ListingGridProps) => {
    const gridClass = columns === 2 
        ? "grid grid-cols-1 md:grid-cols-2 gap-8" 
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8";

    if (isLoading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: skeletonCount }).map((_, idx) => (
                    <VehicleSkeleton key={idx} />
                ))}
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center col-span-full bg-white rounded-[3rem] border border-slate-100 p-12">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No vehicles found</h3>
                <p className="text-slate-500 max-w-sm">
                    We couldn't find any vehicles matching your search criteria. Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default ListingGrid;
