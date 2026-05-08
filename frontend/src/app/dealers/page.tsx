"use client";

import React, { useState } from "react";
import DealerCard from "@/components/DealerCard";
import { Users, Loader2, Search, MapPin, Briefcase, Filter, X } from "lucide-react";
import { useDealers } from "@/hooks/useDealers";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import DealerSkeleton from "@/components/DealerSkeleton";
import CustomSelect from "@/components/CustomSelect";

export default function DealersPage() {
    const [nameSearch, setNameSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [debouncedName, setDebouncedName] = useState("");

    // Debounce name search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(nameSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [nameSearch]);

    const { data: dealers = [], isLoading, isError } = useDealers({
        name: debouncedName,
        location: locationFilter,
        role: roleFilter
    });

    const mappedDealers = dealers.map((a: any) => ({
        ...a,
        userId: a.user?.id,
        name: a.user?.name || "Premium Dealer",
        email: a.user?.email,
        image: a.user?.profileImage || a.image, // Prioritize user profile image
    }));

    const clearFilters = () => {
        setNameSearch("");
        setLocationFilter("");
        setRoleFilter("");
    };

    const hasActiveFilters = nameSearch || locationFilter || roleFilter;

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4 bg-primary/5 px-4 py-2 rounded-full">
                        <Users className="w-4 h-4" />
                        <span>Our Team</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                        Meet the Best in the{" "}
                        <span className="text-primary">Business.</span>
                    </h1>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] premium-shadow border border-slate-100 mb-8 md:mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 items-center">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={nameSearch}
                                onChange={(e) => setNameSearch(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Location..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>

                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <CustomSelect
                                value={roleFilter}
                                onChange={(val) => setRoleFilter(val)}
                                options={[
                                    { value: "", label: "All Specializations" },
                                    { value: "Car Dealer", label: "Car Dealer" },
                                    { value: "Senior Consultant", label: "Senior Consultant" },
                                    { value: "Luxury Specialist", label: "Luxury Vehicle Specialist" },
                                    { value: "Fleet Expert", label: "Fleet Expert" },
                                ]}
                                className="pl-8 w-full bg-slate-50 border-slate-100 rounded-2xl"
                            />
                        </div>

                        <div className="flex gap-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                            <div className={cn(
                                "flex items-center justify-center gap-2 bg-primary/5 text-primary font-bold py-3 px-6 rounded-2xl border border-primary/10",
                                hasActiveFilters ? "flex-1" : "w-full"
                            )}>
                                <Filter className="w-4 h-4" />
                                <span>{mappedDealers.length} Dealers Found</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <DealerSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 font-bold bg-white rounded-4xl border border-slate-100 p-12">
                        Error loading dealers. Please try again later.
                    </div>
                ) : mappedDealers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-4xl border border-slate-100 p-12 premium-shadow max-w-2xl mx-auto">
                        <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">No dealers found</h3>
                        <p className="text-slate-500 font-medium mb-8">We couldn't find any dealers matching your current filters. Try adjusting your search criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mappedDealers.map((dealer: any) => (
                            <DealerCard key={dealer.id} {...dealer} />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 md:mt-24 p-8 md:p-12 bg-slate-900 rounded-3xl md:rounded-4xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">Want to join our team?</h2>
                        <p className="text-slate-400 mb-6 md:mb-8 max-w-xl mx-auto text-sm md:text-base">We are always looking for talented individuals to join our growing family. If you have a passion for cars, let's talk.</p>
                        <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                            Careers at PTGR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
