"use client";

import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VehicleForm, { VehicleFormData } from "@/components/VehicleForm";
import { useVehicle, useUpdateVehicle } from "@/hooks/useVehicles";
import VehicleDetailSkeleton from "@/components/VehicleDetailSkeleton";
import api from "@/lib/api";

const vehicleSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    price: z.string().min(1, "Price is required").regex(/^[\d,]+$/, "Price must be a valid number"),
    address: z.string().min(10, "Address is required"),
    city: z.string().min(2, "City is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(4).regex(/^\d+$/),
    mileage: z.string().min(1).regex(/^\d+$/),
    transmission: z.enum(["AUTOMATIC", "MANUAL", "CVT", "SEMI_AUTO"]),
    fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "PLUG_IN_HYBRID"]),
    condition: z.enum(["NEW", "USED", "CERTIFIED_PRE_OWNED"]),
    bodyType: z.string().min(1),
    color: z.string().min(1),
    listingType: z.enum(["sale", "rent"]),
    rentCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
}).refine(data => !(data.listingType === "rent" && !data.rentCycle), {
    message: "Please select a rental cycle",
    path: ["rentCycle"]
});

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditVehiclePage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data: vehicle, isLoading } = useVehicle(id);
    const updateVehicle = useUpdateVehicle();

    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [images, setImages] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const [existingUrls, setExistingUrls] = React.useState<string[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { listingType: "rent", bodyType: "Sedan", rentCycle: "MONTHLY", condition: "USED", transmission: "AUTOMATIC", fuelType: "PETROL" }
    });

    // Request location access when the page loads (only if no existing property coordinates)
    React.useEffect(() => {
        if ("geolocation" in navigator && !vehicle?.location?.lat) {
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
    }, [form, vehicle]);

    // Pre-fill form once the property loads
    useEffect(() => {
        if (!vehicle) return;

        const existingImages = vehicle.images?.length > 0 ? vehicle.images : (vehicle.image ? [vehicle.image] : []);
        setExistingUrls(existingImages);
        setPreviews(existingImages);

        form.reset({
            title: property.title || property.address || "",
            price: String(property.price || "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            address: property.address || "",
            city: property.city || "",
            make: property.make || "",
            model: property.model || "",
            year: String(property.year || ""),
            mileage: String(property.mileage || ""),
            transmission: property.transmission || "AUTOMATIC",
            fuelType: property.fuelType || "PETROL",
            condition: property.condition || "USED",
            bodyType: property.bodyType || "Sedan",
            color: property.color || "",
            listingType: property.type === "SALE" ? "sale" : "rent",
            rentCycle: property.rentCycle || undefined,
            description: property.description || "",
            latitude: vehicle.location?.lat,
            longitude: vehicle.location?.lng,
        });
    }, [vehicle, form]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalCount = previews.length + files.length;
        if (totalCount > 10) { alert("Max 10 images."); return; }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index: number) => {
        const preview = previews[index];
        if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
            // Find which new-file index this corresponds to
            const newFileIndex = previews
                .slice(0, index + 1)
                .filter(p => p.startsWith("blob:")).length - 1;
            setImages(prev => prev.filter((_, i) => i !== newFileIndex));
        } else {
            setExistingUrls(prev => prev.filter(u => u !== preview));
        }
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: VehicleFormData) => {
        if (!vehicle) return;
        setIsUploading(true);

        try {
            let finalImageUrls = [...existingUrls];

            if (images.length > 0) {
                const fd = new FormData();
                images.forEach(img => fd.append("images", img));
                const res = await api.post("/media/multiple", fd);
                finalImageUrls = [...finalImageUrls, ...res.data.imageUrls];
            }

            if (finalImageUrls.length === 0) {
                finalImageUrls = ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"];
            }

            await updateVehicle.mutateAsync({
                id: vehicle.id?.toString(),
                data: {
                    title: data.title,
                    description: data.description,
                    price: parseFloat(data.price.replace(/,/g, '')),
                    address: data.address,
                    city: data.city,
                    type: data.listingType === "sale" ? "SALE" : "RENT",
                    rentCycle: data.listingType === "rent" ? data.rentCycle : null,
                    make: data.make,
                    model: data.model,
                    year: parseInt(data.year),
                    mileage: parseInt(data.mileage),
                    transmission: data.transmission,
                    fuelType: data.fuelType,
                    color: data.color,
                    condition: data.condition,
                    bodyType: data.bodyType,
                    lat: data.latitude || vehicle.location?.lat || 34.0522,
                    lng: data.longitude || vehicle.location?.lng || -118.2437,
                    features: vehicle.features?.join(", ") || "Cruise Control, Leather Seats, Bluetooth",
                    images: finalImageUrls,
                }
            });
            setIsSubmitted(true);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) return <VehicleDetailSkeleton />;

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
                    <h1 className="text-3xl font-bold text-primary mb-4">Listing Updated!</h1>
                    <p className="text-slate-500 mb-10 leading-relaxed">
                        Your vehicle listing has been successfully updated with the new details.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/vehicle/${id}`}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors text-center"
                        >
                            View Vehicle
                        </Link>
                        <button
                            onClick={() => router.push("/profile")}
                            className="w-full py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                        >
                            Back to Profile
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-6 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
                        Edit your <span className="text-primary">Listing.</span>
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Update your vehicle details below. Changes will be live immediately.
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <VehicleForm
                        form={form}
                        images={images}
                        previews={previews}
                        onImageSelect={handleImageSelect}
                        onRemoveImage={removeImage}
                        onLocationSelect={(lat, lng) => {
                            form.setValue("latitude", lat);
                            form.setValue("longitude", lng);
                        }}
                        showMap={true}
                    />

                    <div className="flex gap-4">
                        <Link
                            href="/profile"
                            className="flex-1 py-6 rounded-2xl font-black text-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={updateVehicle.isPending || isUploading}
                            className="flex-1 bg-primary hover:bg-primary-hover text-white py-6 rounded-2xl font-black text-xl transition-all premium-shadow flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {updateVehicle.isPending || isUploading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>{isUploading ? "Uploading Images..." : "Saving..."}</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-6 h-6" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
