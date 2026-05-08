"use client";

import React, { use, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import VehicleResults from "@/components/VehicleResults";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";

interface PageProps {
    searchParams: Promise<{
        location?: string;
        maxPrice?: string;
        make?: string;
        fuelType?: string;
        transmission?: string;
        condition?: string;
        minYear?: string;
        maxYear?: string;
        subType?: string;
    }>;
}

export default function BuyPage({ searchParams }: PageProps) {
    const params = use(searchParams);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const { data: vehicles = [], isLoading, isError } = useVehicles({
        type: "SALE",
        city: params.location,
        maxPrice: params.maxPrice,
        make: params.make,
        fuelType: params.fuelType,
        transmission: params.transmission,
        condition: params.condition,
        minYear: params.minYear,
        maxYear: params.maxYear,
        subType: params.subType,
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6 md:mb-12">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
                        <Search className="w-4 h-4" />
                        <span>Search Cars</span>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            Discover Your{" "}
                            <span className="text-slate-400">Perfect Car.</span>
                        </h1>
                        {/* Mobile filter toggle */}
                        <button
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold text-sm shadow-sm shrink-0"
                            onClick={() => setShowMobileFilters(v => !v)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {showMobileFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                    {/* Sidebar — always visible on lg+, toggle on mobile */}
                    <aside className={`w-full lg:w-80 shrink-0 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                        <FilterSidebar />
                    </aside>

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        <VehicleResults vehicles={vehicles} isLoading={isLoading} isError={isError} />
                    </div>
                </div>
            </div>
        </div>
    );
}
