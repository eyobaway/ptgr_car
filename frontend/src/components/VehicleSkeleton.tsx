import React from "react";
import { motion } from "framer-motion";

const VehicleSkeleton = () => {
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden premium-shadow border border-slate-100 flex flex-col h-full animate-pulse">
            {/* Image Placeholder */}
            <div className="relative h-64 bg-slate-200" />

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    {/* Badge placeholder */}
                    <div className="h-6 w-24 bg-slate-100 rounded-full" />
                    {/* Heart placeholder */}
                    <div className="h-8 w-8 bg-slate-100 rounded-full" />
                </div>

                {/* Title and location */}
                <div className="space-y-3 mb-6">
                    <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
                    <div className="h-4 w-12 bg-slate-100 rounded-lg" />
                    <div className="h-4 w-12 bg-slate-100 rounded-lg" />
                    <div className="h-4 w-12 bg-slate-100 rounded-lg" />
                </div>

                <div className="mt-auto flex items-center justify-between">
                    {/* Price */}
                    <div className="h-8 w-32 bg-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default VehicleSkeleton;
