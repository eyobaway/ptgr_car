"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleForm, { VehicleFormData } from "@/components/VehicleForm";
import { useUpdateVehicle } from "@/hooks/useVehicles";
import api, { getFileUrl } from "@/lib/api";

const vehicleSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    price: z.string().min(1, "Price is required").regex(/^\d+$/, "Price must be a whole number"),
    address: z.string().min(5, "Address is required"),
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

interface EditVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: any | null;
    onSave?: (updatedVehicle: any) => void;
}

const EditVehicleModal = ({ isOpen, onClose, vehicle, onSave }: EditVehicleModalProps) => {
    const [images, setImages] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const updateVehicle = useUpdateVehicle();

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { listingType: "rent", bodyType: "Sedan" }
    });

    // Pre-fill form when vehicle changes
    useEffect(() => {
        if (vehicle && isOpen) {
            form.reset({
                title: vehicle.title || vehicle.address || "",
                price: String(vehicle.price || ""),
                address: vehicle.address || "",
                city: vehicle.city || "",
                make: vehicle.make || "",
                model: vehicle.model || "",
                year: String(vehicle.year || ""),
                mileage: String(vehicle.mileage || ""),
                transmission: vehicle.transmission || "AUTOMATIC",
                fuelType: vehicle.fuelType || "PETROL",
                condition: vehicle.condition || "USED",
                bodyType: vehicle.bodyType || "Sedan",
                color: vehicle.color || "",
                listingType: vehicle.type === "SALE" ? "sale" : "rent",
                rentCycle: vehicle.rentCycle || undefined,
                description: vehicle.description || "",
                latitude: vehicle.location?.lat || vehicle.lat,
                longitude: vehicle.location?.lng || vehicle.lng,
            });

            // Pre-fill images if available
            if (vehicle.images?.length > 0) {
                setPreviews(vehicle.images.map((url: string) => getFileUrl(url)));
                setImages([]); // No new File objects for existing URLs
            }
        }
    }, [vehicle, isOpen, form]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 10) { alert("Max 10 images."); return; }
        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index: number) => {
        // Track whether this is an existing URL preview or a new file
        const isNewFile = index >= (previews.length - images.length);
        if (isNewFile) {
            const newFileIndex = index - (previews.length - images.length);
            URL.revokeObjectURL(previews[index]);
            setImages(prev => prev.filter((_, i) => i !== newFileIndex));
        }
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setImages([]);
        setPreviews([]);
        form.reset();
        onClose();
    };

    const onSubmit = async (data: VehicleFormData) => {
        if (!vehicle) return;
        setIsUploading(true);

        try {
            let finalImageUrls: string[] = [];

            // Keep existing image URLs (those that are not blob: URLs)
            const existingUrls = previews.filter(p => !p.startsWith("blob:"));
            finalImageUrls = [...existingUrls];

            // Upload new images
            if (images.length > 0) {
                const fd = new FormData();
                images.forEach(img => fd.append("images", img));
                const res = await api.post("/media/multiple", fd);
                finalImageUrls = [...finalImageUrls, ...res.data.imageUrls];
            }

            if (finalImageUrls.length === 0) {
                finalImageUrls = ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"];
            }

            const updatedData = {
                title: data.title,
                description: data.description,
                price: parseFloat(data.price),
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
                condition: data.condition,
                bodyType: data.bodyType,
                color: data.color,
                lat: data.latitude || vehicle.location?.lat || 34.0522,
                lng: data.longitude || vehicle.location?.lng || -118.2437,
                images: finalImageUrls,
            };

            await updateVehicle.mutateAsync({ id: vehicle.id, data: updatedData });
            onSave?.({ ...vehicle, ...updatedData });
            handleClose();
        } catch (error) {
            console.error("Failed to update vehicle:", error);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Slide-in panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-2xl h-screen bg-slate-50 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Edit Listing</h2>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Update the details for this vehicle</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors border border-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-0">
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
                                    showMap={false}
                                />
                            </div>

                            {/* Sticky Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-4 rounded-2xl font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateVehicle.isPending || isUploading}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {updateVehicle.isPending || isUploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {isUploading ? "Uploading..." : "Saving..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditVehicleModal;
