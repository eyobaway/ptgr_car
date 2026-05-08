"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, MapPin, DollarSign, Car, Gauge, Fuel, Settings2, Calendar, Tag } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

const CAR_MAKES = [
    { value: "", label: "Any Make" },
    { value: "Toyota", label: "Toyota" },
    { value: "BMW", label: "BMW" },
    { value: "Mercedes-Benz", label: "Mercedes-Benz" },
    { value: "Ford", label: "Ford" },
    { value: "Honda", label: "Honda" },
    { value: "Chevrolet", label: "Chevrolet" },
    { value: "Audi", label: "Audi" },
    { value: "Volkswagen", label: "Volkswagen" },
    { value: "Hyundai", label: "Hyundai" },
    { value: "Kia", label: "Kia" },
    { value: "Nissan", label: "Nissan" },
    { value: "Mazda", label: "Mazda" },
    { value: "Tesla", label: "Tesla" },
    { value: "Subaru", label: "Subaru" },
    { value: "Lexus", label: "Lexus" },
];

const BODY_TYPES = ["Sedan", "SUV", "Truck", "Coupe", "Van", "Convertible", "Hatchback", "Electric"];

const currentYear = new Date().getFullYear();

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Local state
    const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(
        searchParams.get("subType")?.split(",") || []
    );

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        const query = createQueryString(name, value);
        router.push(pathname + (query ? "?" + query : ""), { scroll: false });
    };

    // Debounce location input
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (locationInput !== (searchParams.get("location") || "")) {
                handleFilterChange("location", locationInput);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [locationInput]);

    const handleBodyTypeToggle = (type: string) => {
        const newTypes = selectedBodyTypes.includes(type)
            ? selectedBodyTypes.filter(t => t !== type)
            : [...selectedBodyTypes, type];

        setSelectedBodyTypes(newTypes);
        handleFilterChange("subType", newTypes.join(","));
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] premium-shadow border border-slate-100 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Filters</h2>
            </div>

            <div className="space-y-6">
                {/* Location */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        City / Location
                    </label>
                    <input
                        type="text"
                        placeholder="City, Area, ZIP"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                </div>

                {/* Max Price */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        Max Price
                    </label>
                    <CustomSelect
                        value={searchParams.get("maxPrice") || ""}
                        onChange={(val) => handleFilterChange("maxPrice", val)}
                        options={[
                            { value: "", label: "Any Price" },
                            { value: "10000", label: "$10,000" },
                            { value: "25000", label: "$25,000" },
                            { value: "50000", label: "$50,000" },
                            { value: "75000", label: "$75,000" },
                            { value: "100000", label: "$100,000" },
                            { value: "150000", label: "$150,000+" },
                        ]}
                    />
                </div>

                {/* Car Make */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        Make
                    </label>
                    <CustomSelect
                        value={searchParams.get("make") || ""}
                        onChange={(val) => handleFilterChange("make", val)}
                        options={CAR_MAKES}
                    />
                </div>

                {/* Year Range */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Year Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="From"
                            min={1990}
                            max={currentYear}
                            value={searchParams.get("minYear") || ""}
                            onChange={(e) => handleFilterChange("minYear", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                        <input
                            type="number"
                            placeholder="To"
                            min={1990}
                            max={currentYear}
                            value={searchParams.get("maxYear") || ""}
                            onChange={(e) => handleFilterChange("maxYear", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Fuel Type */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-slate-400" />
                        Fuel Type
                    </label>
                    <CustomSelect
                        value={searchParams.get("fuelType") || ""}
                        onChange={(val) => handleFilterChange("fuelType", val)}
                        options={[
                            { value: "", label: "Any Fuel" },
                            { value: "PETROL", label: "Petrol" },
                            { value: "DIESEL", label: "Diesel" },
                            { value: "ELECTRIC", label: "Electric" },
                            { value: "HYBRID", label: "Hybrid" },
                            { value: "PLUG_IN_HYBRID", label: "Plug-in Hybrid" },
                        ]}
                    />
                </div>

                {/* Transmission */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-slate-400" />
                        Transmission
                    </label>
                    <CustomSelect
                        value={searchParams.get("transmission") || ""}
                        onChange={(val) => handleFilterChange("transmission", val)}
                        options={[
                            { value: "", label: "Any" },
                            { value: "AUTOMATIC", label: "Automatic" },
                            { value: "MANUAL", label: "Manual" },
                            { value: "CVT", label: "CVT" },
                            { value: "SEMI_AUTO", label: "Semi-Automatic" },
                        ]}
                    />
                </div>

                {/* Condition */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400" />
                        Condition
                    </label>
                    <CustomSelect
                        value={searchParams.get("condition") || ""}
                        onChange={(val) => handleFilterChange("condition", val)}
                        options={[
                            { value: "", label: "Any Condition" },
                            { value: "NEW", label: "New" },
                            { value: "USED", label: "Used" },
                            { value: "CERTIFIED_PRE_OWNED", label: "Certified Pre-Owned" },
                        ]}
                    />
                </div>

                {/* Body Type */}
                <div>
                    <label className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        Body Type
                    </label>
                    <div className="space-y-2">
                        {BODY_TYPES.map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer text-slate-600 text-sm hover:text-slate-900 group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-colors"
                                        checked={selectedBodyTypes.includes(type)}
                                        onChange={() => handleBodyTypeToggle(type)}
                                    />
                                </div>
                                <span className="peer-checked:text-slate-900 peer-checked:font-bold">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    setLocationInput("");
                    setSelectedBodyTypes([]);
                    router.push(pathname);
                }}
                className="w-full mt-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
                Reset Filters
            </button>
        </div>
    );
}
