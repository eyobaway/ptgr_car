"use client"
import Link from "next/link";
import { MapPin, Heart, Pencil, Trash2, Gauge, Calendar, Fuel, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";
import { getFileUrl } from "@/lib/api";

interface CarCardProps {
    id: string;
    image: string;
    images?: string[];
    price: string;
    title?: string;
    address?: string;
    city: string;
    // Car-specific fields
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    transmission?: string;
    fuelType?: string;
    condition?: string;
    bodyType?: string;
    // Listing metadata
    type: "SALE" | "RENT";
    rentCycle?: "DAILY" | "WEEKLY" | "MONTHLY" | null;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const VehicleCard = (props: CarCardProps) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const saved = isFavorite(props.id);

    const displayTitle = props.title
        || (props.make && props.model && props.year
            ? `${props.year} ${props.make} ${props.model}`
            : "Vehicle Listing");

    const fallbackImage = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800";

    return (
        <>
            <div className="block group bg-white rounded-3xl overflow-hidden premium-shadow border border-slate-100 hover-lift relative shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                {/* Stretched Link - covers the entire card but allows buttons to be clicked */}
                <Link
                    href={`/vehicle/${props.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`View details for ${displayTitle}`}
                />

                <div className="relative h-56 overflow-hidden pointer-events-none">
                    <img
                        src={getFileUrl(props.images?.[0] || props.image) || fallbackImage}
                        alt={displayTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white",
                            props.type === "SALE" ? "bg-[#7b1919]" : "bg-primary"
                        )}>
                            For {props.type === "SALE" ? "Sale" : "Rent"}
                        </span>
                        {props.condition && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-slate-800/80 backdrop-blur-sm">
                                {props.condition === "CERTIFIED_PRE_OWNED" ? "CPO" : props.condition}
                            </span>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(props.id);
                        }}
                        className={cn(
                            "w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-lg",
                            saved ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-slate-700 hover:text-primary bg-white/90"
                        )}
                    >
                        <Heart className={cn("w-5 h-5", saved && "fill-current")} />
                    </button>

                    {(props.onEdit || props.onDelete) && (
                        <>
                            {props.onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        props.onEdit?.(props.id);
                                    }}
                                    className="w-10 h-10 rounded-full bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white transition-all shadow-lg hover:scale-110 active:scale-90"
                                    title="Edit Listing"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                            {props.onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        props.onDelete?.(props.id);
                                    }}
                                    className="w-10 h-10 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-500 transition-all shadow-lg hover:scale-110 active:scale-90"
                                    title="Delete Listing"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 pointer-events-none relative z-10">
                    <div className="flex items-baseline gap-1 mb-1">
                        <h3 className="text-2xl font-bold text-slate-900">
                            ${(typeof props.price === 'string'
                                ? Number(props.price.replace(/[^0-9.-]+/g, ""))
                                : Number(props.price)).toLocaleString()}
                        </h3>
                        {props.type === "RENT" && (
                            <span className="text-slate-500 font-medium text-sm">
                                {props.rentCycle === "DAILY" && "/day"}
                                {props.rentCycle === "WEEKLY" && "/wk"}
                                {(!props.rentCycle || props.rentCycle === "MONTHLY") && "/mo"}
                            </span>
                        )}
                    </div>
                    <p className="font-semibold text-slate-800 text-base mb-1 truncate">{displayTitle}</p>
                    <p className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {props.city}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium" title="Year">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm">{props.year ?? "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium" title="Mileage">
                            <Gauge className="w-4 h-4 text-primary" />
                            <span className="text-sm">
                                {props.mileage != null
                                    ? `${props.mileage.toLocaleString()} km`
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium" title="Transmission">
                            <Settings2 className="w-4 h-4 text-primary" />
                            <span className="text-sm hidden sm:inline">
                                {props.transmission === "AUTOMATIC" ? "Auto"
                                    : props.transmission === "MANUAL" ? "Manual"
                                    : props.transmission ?? "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium" title="Fuel Type">
                            <Fuel className="w-4 h-4 text-primary" />
                            <span className="text-sm hidden sm:inline">
                                {props.fuelType
                                    ? props.fuelType.charAt(0) + props.fuelType.slice(1).toLowerCase()
                                    : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VehicleCard;
