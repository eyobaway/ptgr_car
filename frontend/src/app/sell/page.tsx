"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, CheckCircle2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PricingModal from "@/components/PricingModal";
import VehicleForm, { VehicleFormData } from "@/components/VehicleForm";
import { useCreateVehicle } from "@/hooks/useVehicles";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import Link from "next/link";

const vehicleSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long for better visibility"),
    price: z.string().min(1, "Price is required").regex(/^[\d,]+$/, "Price must be a valid number"),
    address: z.string().min(10, "Please provide the full street address for accurate mapping"),
    city: z.string().min(2, "City name is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(4, "Year must be 4 digits").regex(/^\d+$/, "Must be a number"),
    mileage: z.string().min(1, "Mileage is required").regex(/^\d+$/, "Must be a number"),
    transmission: z.enum(["AUTOMATIC", "MANUAL", "CVT", "SEMI_AUTO"]),
    fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "PLUG_IN_HYBRID"]),
    condition: z.enum(["NEW", "USED", "CERTIFIED_PRE_OWNED"]),
    bodyType: z.string().min(1, "Body type is required"),
    color: z.string().min(1, "Color is required"),
    listingType: z.enum(["sale", "rent"]),
    rentCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
    description: z.string().min(20, "Tell us more! Description must be at least 20 characters"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
}).refine(data => !(data.listingType === "rent" && !data.rentCycle), {
    message: "Please select a rental cycle (Daily, Weekly, or Monthly)",
    path: ["rentCycle"]
});

const SellPage = () => {
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isPricingModalOpen, setIsPricingModalOpen] = React.useState(false);
    const [pendingData, setPendingData] = React.useState<VehicleFormData | null>(null);
    const [images, setImages] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const { user, isLoading } = useAuth();
    const createVehicle = useCreateVehicle();

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { listingType: "rent", bodyType: "Sedan", rentCycle: "MONTHLY", condition: "USED", transmission: "AUTOMATIC", fuelType: "PETROL" }
    });

    // Request location access when the page loads
    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    form.setValue("latitude", position.coords.latitude);
                    form.setValue("longitude", position.coords.longitude);
                },
                (error) => {
                    console.log("Geolocation blocked or failed:", error.message);
                }
            );
        }
    }, [form]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 10) { alert("Max 10 images."); return; }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const onSubmit = async (data: VehicleFormData) => {
        setPendingData(data);
        setIsPricingModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        if (!pendingData) return;
        setIsPricingModalOpen(false);
        setIsUploading(true);
        try {
            let imageUrls: string[] = [];
            if (images.length > 0) {
                const fd = new FormData();
                images.forEach(img => fd.append("images", img));
                const res = await api.post("/media/multiple", fd);
                imageUrls = res.data.imageUrls;
            } else {
                imageUrls = ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"];
            }
            await createVehicle.mutateAsync({
                title: pendingData.title,
                description: pendingData.description,
                price: parseFloat(pendingData.price.replace(/,/g, '')),
                address: pendingData.address,
                city: pendingData.city,
                type: pendingData.listingType === "sale" ? "SALE" : "RENT",
                rentCycle: pendingData.listingType === "rent" ? pendingData.rentCycle : null,
                make: pendingData.make,
                model: pendingData.model,
                year: parseInt(pendingData.year),
                mileage: parseInt(pendingData.mileage),
                transmission: pendingData.transmission,
                fuelType: pendingData.fuelType,
                color: pendingData.color,
                condition: pendingData.condition,
                bodyType: pendingData.bodyType,
                lat: pendingData.latitude || 34.0522,
                lng: pendingData.longitude || -118.2437,
                features: "Cruise Control, Leather Seats, Bluetooth",
                agentId: user?.id || 1,
                image: imageUrls[0],
                images: imageUrls,
            });
            setIsSubmitted(true);
            setPendingData(null);
            setImages([]);
            setPreviews([]);
        } catch (error) {
            console.error("Failed to create vehicle:", error);
            alert("Error publishing vehicle listing. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center bg-white p-12 rounded-4xl premium-shadow border border-slate-100"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-4">Listing Published!</h1>
                    <p className="text-slate-500 mb-10 leading-relaxed">
                        Your vehicle has been successfully listed and is now visible to millions of potential buyers.
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Create Another Listing
                    </button>
                </motion.div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
                <p className="text-slate-500 font-bold text-xl">Please log in to list a vehicle.</p>
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
        <div className="min-h-screen pb-24 bg-slate-50">
            {/* Hero Banner */}
            <div
                className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] flex items-center overflow-hidden"
                style={{
                    backgroundImage: "url('/sell-hero-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center 60%",
                }}
            >
                {/* Dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full pt-16 sm:pt-24">
                    <div className="inline-flex text-white bg-transparent items-center gap-2 px-4 py-1.5 border border-slate-400 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 md:mb-5 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                        List Your Vehicle
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
                        Ready to sell your{" "}
                        <span className="text-slate-400">perfect ride?</span>
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base md:text-xl max-w-xl leading-relaxed">
                        Fill out the form below to list your vehicle and reach millions of potential buyers today.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <VehicleForm
                        form={form}
                        images={images}
                        previews={previews}
                        onImageSelect={handleImageSelect}
                        onRemoveImage={removeImage}
                        onLocationSelect={(lat, lng) => { form.setValue("latitude", lat); form.setValue("longitude", lng); }}
                        showMap={true}
                    />

                    <button
                        type="submit"
                        disabled={createVehicle.isPending || isUploading}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black text-xl transition-all premium-shadow flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {createVehicle.isPending || isUploading ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>{isUploading ? "Uploading Images..." : "Publishing..."}</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-6 h-6" />
                                Publish Listing
                            </>
                        )}
                    </button>
                </form>
            </div>

            <PricingModal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default SellPage;
