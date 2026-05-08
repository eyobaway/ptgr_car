"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, ArrowRight, DollarSign, Gauge, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/CustomSelect";
import { useUser } from "@/hooks/useUser";

const CAR_MAKES = [
    "Any Make", "Toyota", "BMW", "Mercedes-Benz", "Ford", "Honda",
    "Chevrolet", "Audi", "Volkswagen", "Hyundai", "Kia",
    "Nissan", "Mazda", "Subaru", "Lexus", "Tesla",
];

const BODY_TYPES = [
    { value: "Any", label: "Any Type" },
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Truck", label: "Truck" },
    { value: "Coupe", label: "Coupe" },
    { value: "Van", label: "Van / Minivan" },
    { value: "Electric", label: "Electric" },
    { value: "Luxury", label: "Luxury" },
    { value: "Convertible", label: "Convertible" },
];

const currentYear = new Date().getFullYear();

const Hero = () => {
    const router = useRouter();
    const popoverRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [bodyType, setBodyType] = useState("Any");
    const [showFilters, setShowFilters] = useState(false);

    // Advanced Filter State
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minYear, setMinYear] = useState("");
    const [maxYear, setMaxYear] = useState("");

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilters]);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const params = new URLSearchParams();
        if (searchQuery) params.append("location", searchQuery);
        if (bodyType !== "Any") params.append("subType", bodyType);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (minYear) params.append("minYear", minYear);
        if (maxYear) params.append("maxYear", maxYear);

        router.push(`/buy?${params.toString()}`);
    };

    return (
        <section className="relative h-[90vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center z-20">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-slate-900/65 backdrop-brightness-100" />
            </div>

            <div className="relative z-10 max-w-5xl px-4 sm:px-6 text-center text-white w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
                        Find a car <br />
                        <span className="text-slate-400">you'll love to drive.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-6 md:mb-10 max-w-2xl mx-auto">
                        Browse thousands of vehicles for sale and rent. The most complete car marketplace near you.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <div className="relative" ref={popoverRef}>
                        <div className="bg-white p-2 md:p-3 rounded-3xl md:rounded-full premium-shadow">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
                                <div className="flex-1 flex items-center gap-3 px-4 sm:px-6 w-full py-3 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
                                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Make, Model, City..."
                                        className="bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 w-full font-medium text-sm sm:text-base outline-none"
                                    />
                                </div>
                                <div className="flex-1 hidden lg:flex items-center gap-3 px-6 border-r border-slate-100">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                    <CustomSelect
                                        value={bodyType}
                                        onChange={(val) => setBodyType(val)}
                                        options={BODY_TYPES}
                                        className="border-none! bg-transparent! p-0 w-[150px]"
                                    />
                                </div>
                                {/* Filters button */}
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 md:py-3 transition-colors rounded-full w-full md:w-auto justify-center md:justify-start border md:border-0 border-slate-200 ${showFilters ? 'bg-primary/10 text-primary border-primary/30' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span className="font-bold text-sm">Filters</span>
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary hover:bg-primary-hover text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold transition-all w-full md:w-auto flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Search
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 mt-4 z-50 p-8 bg-white/95 backdrop-blur-xl rounded-[2.5rem] premium-shadow border border-white/20"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <DollarSign className="w-3 h-3" /> Min Price
                                                </label>
                                                <input
                                                    type="number"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(e.target.value)}
                                                    placeholder="$0"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <DollarSign className="w-3 h-3" /> Max Price
                                                </label>
                                                <input
                                                    type="number"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(e.target.value)}
                                                    placeholder="Any"
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Min Year
                                                </label>
                                                <input
                                                    type="number"
                                                    value={minYear}
                                                    onChange={(e) => setMinYear(e.target.value)}
                                                    placeholder="2000"
                                                    min={1990}
                                                    max={currentYear}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Max Year
                                                </label>
                                                <input
                                                    type="number"
                                                    value={maxYear}
                                                    onChange={(e) => setMaxYear(e.target.value)}
                                                    placeholder={String(currentYear)}
                                                    min={1990}
                                                    max={currentYear}
                                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
