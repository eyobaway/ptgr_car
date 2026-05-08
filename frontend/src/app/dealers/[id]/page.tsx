"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin, Globe, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import ListingGrid from "@/components/ListingGrid";
import Link from "next/link";
import { useDealer } from "@/hooks/useDealers";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AuthGuardModal from "@/components/AuthGuardModal";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Avatar from "@/components/Avatar";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const mapProperty = (p: any) => ({
    ...p,
    location: {
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lng),
    },
    features: Array.isArray(p.features)
        ? p.features
        : p.features
            ? p.features.split(",").map((f: string) => f.trim())
            : [],
});

export default function DealerDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: dealer, isLoading, isError } = useDealer(id);
    const { isOpen, modalOptions, closeModal, guardAction } = useAuthGuard();
    const router = useRouter();

    const handleMessageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        guardAction(() => {
            if (dealer?.user?.id) {
                router.push(`/messages?userId=${dealer.user.id}`);
            }
        }, {
            title: "Contact Dealer",
            description: `Sign in to send messages and inquire about vehicles directly with ${dealer?.user?.name || 'our dealer'}.`,
            icon: <MessageSquare className="w-8 h-8 text-primary" />
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading dealer profile...</p>
            </div>
        );
    }

    if (isError || !dealer) {
        notFound();
    }

    const dealerName = dealer.user?.name || "Premium Dealer";
    const dealerEmail = dealer.user?.email || "";
    const dealerVehicles = dealer.properties?.map(mapProperty) || [];
    const dealerLanguages = dealer.languages ? dealer.languages.split(",").map((l: string) => l.trim()) : [];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header / Banner */}
            <div className="bg-slate-900 pt-32 pb-20 px-6 text-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-400/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <Link href="/dealers" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dealers
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <Avatar 
                            src={dealer.user?.profileImage || dealer.image} 
                            name={dealerName} 
                            size="3xl" 
                            className="md:w-48 md:h-48 border-4 border-white/20 shadow-2xl" 
                        />
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 bg-slate-400/20 text-slate-400 border border-slate-400/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                                {dealer.role}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4">{dealerName}</h1>

                            <div className="flex flex-wrap gap-6 text-slate-300">
                                {dealer.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {dealer.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <a href={`mailto:${dealerEmail}`} className="hover:text-white transition-colors">{dealerEmail}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <a href={`tel:${dealer.phone}`} className="hover:text-white transition-colors">{dealer.phone}</a>
                                </div>
                                {dealer.user?.id && (
                                    <div className="flex items-center gap-2 ml-4">
                                        <MessageCircle className="w-4 h-4 text-slate-400" />
                                        <button
                                            onClick={handleMessageClick}
                                            className="hover:text-white transition-colors font-bold text-white cursor-pointer"
                                        >
                                            Message Dealer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Sidebar: About */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">About {dealerName.split(" ")[0]}</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                {dealer.bio || "No biography available."}
                            </p>

                            {dealerLanguages.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {dealerLanguages.map((lang: string) => (
                                            <span key={lang} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content: Listings */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Active Listings</h2>
                            <div className="px-4 py-1.5 bg-slate-100 rounded-full text-slate-600 font-bold text-sm">
                                {dealerVehicles.length} Vehicles
                            </div>
                        </div>

                        {dealerVehicles.length > 0 ? (
                             <ListingGrid vehicles={dealerVehicles} columns={2} />
                        ) : (
                            <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center">
                                <p className="text-slate-500">No active listings at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <AuthGuardModal
                isOpen={isOpen}
                onClose={closeModal}
                {...modalOptions}
            />
        </div>
    );
}
