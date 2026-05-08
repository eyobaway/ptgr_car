"use client";

import React from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useVehicles } from "@/hooks/useVehicles";
import VehicleCard from "@/components/VehicleCard";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function SavedPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { favorites } = useFavorites();
    const { data: vehicles = [], isLoading } = useVehicles();

    const savedVehicles = vehicles.filter((v: any) => favorites.includes(v.id));

    if (isAuthLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
                <p className="text-slate-500 font-bold text-xl">Please log in to view your saved vehicles.</p>
                <Link
                    href="/login"
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
                        <Heart className="w-4 h-4" />
                        <span>Your Favorites</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                        Saved <span className="text-slate-400">Listings.</span>
                    </h1>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                ) : savedVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {savedVehicles.map((vehicle: any) => (
                            <VehicleCard key={vehicle.id} {...vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-4xl p-8 md:p-12 text-center border border-slate-100 premium-shadow">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <Heart className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">No Saved Vehicles</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm md:text-base">
                            You haven't saved any vehicles yet. Browse our listings and click the heart icon to save them here.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Link href="/buy" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-center">
                                Browse For Sale
                            </Link>
                            <Link href="/rent" className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors text-center">
                                Browse For Rent
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
