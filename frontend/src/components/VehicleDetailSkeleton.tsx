import React from "react";

const VehicleDetailSkeleton = () => {
    return (
        <div className="min-h-screen pb-24 bg-slate-50 animate-pulse">
            {/* Hero Image Skeleton */}
            <div className="w-full h-[60vh] relative bg-slate-200">
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="h-8 w-24 bg-slate-300 rounded-full" />
                                <div className="h-16 w-64 bg-slate-300 rounded-lg" />
                                <div className="h-6 w-96 bg-slate-300 rounded-lg" />
                            </div>
                            <div className="flex gap-4 md:gap-8 flex-wrap">
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-300/50 rounded-xl" />
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-300/50 rounded-xl" />
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-300/50 rounded-xl" />
                                <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-300/50 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Description Section */}
                    <div className="bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100 space-y-4">
                        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-slate-100 rounded-lg" />
                            <div className="h-4 w-full bg-slate-100 rounded-lg" />
                            <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100 space-y-6">
                        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100" />
                                    <div className="h-4 w-32 bg-slate-100 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calculator/Map Placeholders */}
                    <div className="h-[400px] w-full bg-slate-200 rounded-4xl" />
                    <div className="h-[400px] w-full bg-slate-200 rounded-4xl" />
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100 space-y-6">
                        <div className="h-6 w-full bg-slate-200 rounded-lg" />
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-200" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-slate-200 rounded-lg" />
                                <div className="h-3 w-24 bg-slate-100 rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-full bg-slate-50 rounded-xl" />
                            <div className="h-12 w-full bg-slate-50 rounded-xl" />
                            <div className="h-32 w-full bg-slate-50 rounded-xl" />
                            <div className="h-14 w-full bg-slate-900/10 rounded-xl" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VehicleDetailSkeleton;
