"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Gauge, Settings2, Fuel, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useVehicle, useVehicles } from "@/hooks/useVehicles";
import VehicleDetailSkeleton from "@/components/VehicleDetailSkeleton";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AuthGuardModal from "@/components/AuthGuardModal";
import { MessageCircle, Phone, ArrowRight, Sparkles } from "lucide-react";
import VehicleGallery, { PhotoGalleryCard } from "@/components/VehicleGallery";
import ListingGrid from "@/components/ListingGrid";
import Avatar from "@/components/Avatar";

const VehicleMap = dynamic(() => import("@/components/VehicleMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">Loading Map...</div>
});

const AutoLoanCalculator = dynamic(() => import("@/components/AutoLoanCalculator"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">Loading Calculator...</div>
});

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function VehicleDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: vehicle, isLoading, isError } = useVehicle(id);
    const { isOpen, modalOptions, closeModal, guardAction } = useAuthGuard();
    const router = useRouter();

    const handleProtectedAction = (e: React.FormEvent | React.MouseEvent, action: () => void) => {
        e.preventDefault();
        guardAction(action, {
            title: "Contact Dealer",
            description: "Sign in to send messages and inquire about vehicles directly with our expert dealers.",
            icon: <MessageCircle className="w-8 h-8 text-primary" />
        });
    };

    if (isLoading) {
        return <VehicleDetailSkeleton />;
    }

    if (isError || !vehicle) {
        notFound();
    }

    const dealer = vehicle.agent;

    return (
        <div className="min-h-screen pb-16 md:pb-24 bg-slate-50">
            {/* Hero Gallery */}
            <div className="relative">
                <VehicleGallery
                    images={vehicle.images || (vehicle.image ? [vehicle.image] : [])}
                    address={vehicle.address}
                />

                {/* Back Button — floats over gallery */}
                <div className="absolute top-16 md:top-20 left-4 md:left-30 z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back to Listings</span>
                    </Link>
                </div>

                {/* Vehicle metadata overlay — positioned at the bottom of the gallery */}
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 text-white z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                            <div>
                                <div className={cn(
                                    "inline-block px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 text-white",
                                    vehicle.type === "SALE" ? "bg-[#7b1919]" : "bg-primary"
                                )}>
                                    For {vehicle.type.toLowerCase()}
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">${(typeof vehicle.price === 'string' ? Number(vehicle.price.replace(/[^0-9.-]+/g, "")) : Number(vehicle.price)).toLocaleString()}</h1>
                                    {vehicle.type === "RENT" && (
                                        <span className="text-slate-300 text-lg md:text-2xl font-medium">
                                            {vehicle.rentCycle === "DAILY" && "/day"}
                                            {vehicle.rentCycle === "WEEKLY" && "/wk"}
                                            {(!vehicle.rentCycle || vehicle.rentCycle === "MONTHLY") && "/mo"}
                                        </span>
                                    )}
                                </div>
                                <p className="text-base md:text-xl lg:text-2xl text-slate-200 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                                    <span className="line-clamp-1">{vehicle.address}, {vehicle.city}</span>
                                </p>
                            </div>

                            <div className="flex gap-2 md:gap-4 md:gap-8 flex-wrap">
                                <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-xl border border-white/20 text-center min-w-[80px] md:min-w-[100px]">
                                    <Calendar className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-slate-400" />
                                    <div className="text-xl md:text-2xl font-bold">{vehicle.year}</div>
                                    <div className="text-xs md:text-sm text-slate-300">Year</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-xl border border-white/20 text-center min-w-[80px] md:min-w-[100px]">
                                    <Gauge className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-slate-400" />
                                    <div className="text-xl md:text-2xl font-bold">{(vehicle.mileage || 0).toLocaleString()}</div>
                                    <div className="text-xs md:text-sm text-slate-300">km</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-xl border border-white/20 text-center min-w-[80px] md:min-w-[100px]">
                                    <Settings2 className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-slate-400" />
                                    <div className="text-lg md:text-xl font-bold truncate max-w-[80px]">{vehicle.transmission === 'AUTOMATIC' ? 'Auto' : vehicle.transmission === 'MANUAL' ? 'Manual' : vehicle.transmission}</div>
                                    <div className="text-xs md:text-sm text-slate-300">Gear</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 rounded-xl border border-white/20 text-center min-w-[80px] md:min-w-[100px]">
                                    <Fuel className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-slate-400" />
                                    <div className="text-lg md:text-xl font-bold truncate max-w-[80px]">{vehicle.fuelType?.charAt(0) + vehicle.fuelType?.slice(1).toLowerCase()}</div>
                                    <div className="text-xs md:text-sm text-slate-300">Fuel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8 md:space-y-12">
                    {/* Photo Gallery Card */}
                    {vehicle.images && vehicle.images.length > 1 && (
                        <PhotoGalleryCard
                            images={vehicle.images}
                            address={vehicle.address}
                        />
                    )}

                    {/* Description */}
                    <section className="bg-white p-6 md:p-8 lg:p-10 rounded-3xl md:rounded-4xl premium-shadow border border-slate-100">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">About this Vehicle</h2>
                        <p className="text-slate-600 leading-relaxed md:text-lg">
                            {vehicle.description}
                        </p>
                    </section>

                    {/* Features */}
                    <section className="bg-white p-6 md:p-8 lg:p-10 rounded-3xl md:rounded-4xl premium-shadow border border-slate-100">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Key Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {vehicle.features?.map((feature: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Auto Loan Calculator - Only for SALE vehicles */}
                    {vehicle.type === "SALE" && (
                        <AutoLoanCalculator price={String(vehicle.price).replace(/,/g, '')} />
                    )}

                    {/* Map Section */}
                    <section className="bg-white p-6 md:p-8 lg:p-10 rounded-3xl md:rounded-4xl premium-shadow border border-slate-100">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Location</h2>
                        <VehicleMap
                            lat={vehicle.location.lat}
                            lng={vehicle.location.lng}
                            address={`${vehicle.address}, ${vehicle.city}`}
                        />
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Contact Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-4xl premium-shadow border border-slate-100 lg:sticky lg:top-8">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-5 md:mb-6">Interested in this vehicle?</h3>

                        {dealer && (
                            <Link href={`/dealers/${dealer.id}`} className="flex items-center gap-4 mb-8 group hover:bg-slate-50 p-2 rounded-xl transition-colors -mx-2">
                                <Avatar
                                    src={dealer.user?.profileImage || dealer.image}
                                    name={dealer.user?.name || "Dealer"}
                                    size="xl"
                                    className="group-hover:scale-110 transition-transform duration-500 shadow-md"
                                />
                                <div>
                                    <div className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{dealer.user?.name || 'Top Dealer'}</div>
                                    <div className="text-slate-500 text-sm">{dealer.role}</div>
                                </div>
                            </Link>
                        )}

                        {dealer?.user?.id && (
                            <button
                                onClick={(e) => handleProtectedAction(e, () => {
                                    if (dealer?.user?.id) {
                                        router.push(`/messages?userId=${dealer.user.id}&vehicleId=${vehicle.id}`);
                                    }
                                })}
                                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-4"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Message Dealer
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={(e) => handleProtectedAction(e, () => {
                                if (dealer?.phone) {
                                    window.location.href = `tel:${dealer.phone}`;
                                } else {
                                    alert("Phone number not available.");
                                }
                            })}
                            className="w-full py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Call Dealer
                        </button>
                    </div>
                </div>
            </main>

            {/* Additional Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 md:space-y-24 pb-16 md:pb-24">
                {/* Dealer's Other Posts */}
                {dealer && (
                    <section>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
                                    <Sparkles className="w-4 h-4" />
                                    <span>More from {dealer.user?.name || "this dealer"}</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    Dealer's <span className="text-slate-400">Other Listings.</span>
                                </h2>
                            </div>
                            <Link
                                href={`/dealers/${dealer.id}`}
                                className="group flex items-center gap-2 text-primary font-bold text-base md:text-lg hover:underline underline-offset-8 shrink-0"
                            >
                                View dealer profile
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <DealerVehicles currentVehicleId={vehicle.id} dealerId={dealer.id} />
                    </section>
                )}

                {/* Related Vehicles */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
                                <Sparkles className="w-4 h-4" />
                                <span>Suggested for you</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Related <span className="text-slate-400">Vehicles.</span>
                            </h2>
                        </div>
                        <Link
                            href={vehicle.type === "SALE" ? "/buy" : "/rent"}
                            className="group flex items-center gap-2 text-primary font-bold text-base md:text-lg hover:underline underline-offset-8 shrink-0"
                        >
                            View more {vehicle.type.toLowerCase()} listings
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <RelatedVehicles currentVehicleId={vehicle.id} type={vehicle.type} />
                </section>
            </div>

            <AuthGuardModal
                isOpen={isOpen}
                onClose={closeModal}
                {...modalOptions}
            />
        </div>
    );
};

function DealerVehicles({ currentVehicleId, dealerId }: { currentVehicleId: string; dealerId: string }) {
    const { data: vehicles = [], isLoading } = useVehicles({ agentId: dealerId });
    const otherVehicles = vehicles.filter((v: any) => v.id.toString() !== currentVehicleId.toString()).slice(0, 3);

    return (
        <ListingGrid
            vehicles={otherVehicles}
            isLoading={isLoading}
            skeletonCount={3}
        />
    );
}

function RelatedVehicles({ currentVehicleId, type }: { currentVehicleId: string; type: string }) {
    const { data: vehicles = [], isLoading } = useVehicles({ type });
    const otherVehicles = vehicles.filter((v: any) => v.id.toString() !== currentVehicleId.toString()).slice(0, 3);

    return (
        <ListingGrid
            vehicles={otherVehicles}
            isLoading={isLoading}
            skeletonCount={3}
        />
    );
}
