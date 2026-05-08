"use client";

import React from "react";
import { UseFormReturn, FieldErrors } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Plus, DollarSign, MapPin, Info, CheckCircle2, Sparkles, Loader2, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import CustomSelect from "@/components/CustomSelect";
import api from "@/lib/api";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">Loading Map...</div>
});

export interface VehicleFormData {
    title: string;
    price: string;
    address: string;
    city: string;
    make: string;
    model: string;
    year: string;
    mileage: string;
    transmission: "AUTOMATIC" | "MANUAL" | "CVT" | "SEMI_AUTO";
    fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "PLUG_IN_HYBRID";
    condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED";
    bodyType: string;
    color: string;
    listingType: "sale" | "rent";
    rentCycle?: "DAILY" | "WEEKLY" | "MONTHLY";
    description: string;
    latitude?: number;
    longitude?: number;
}

interface VehicleFormProps {
    form: UseFormReturn<VehicleFormData>;
    images: File[];
    previews: string[];
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (idx: number) => void;
    onLocationSelect: (lat: number, lng: number) => void;
    /** Whether to show the map picker. In a modal it can be hidden for space. */
    showMap?: boolean;
}

export default function VehicleForm({
    form,
    images,
    previews,
    onImageSelect,
    onRemoveImage,
    onLocationSelect,
    showMap = true,
}: VehicleFormProps) {
    const { register, watch, setValue, formState: { errors } } = form;
    const listingType = watch("listingType");
    const lat = watch("latitude");
    const lng = watch("longitude");
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerateAIDescription = async () => {
        const values = form.getValues();
        // Basic validation: at least some context is better
        if (!values.title && !values.make && !values.city) {
            alert("Please fill in some basic details (Title, Make, or City) to help the AI generate a better description.");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await api.post("/ai/generate-description", {
                details: {
                    title: values.title,
                    make: values.make,
                    model: values.model,
                    year: values.year,
                    mileage: values.mileage,
                    bodyType: values.bodyType,
                    fuelType: values.fuelType,
                    transmission: values.transmission,
                    address: values.address,
                    city: values.city,
                }
            });

            if (res.data.description) {
                setValue("description", res.data.description, { shouldValidate: true });
            }
        } catch (error) {
            console.error("AI Generation failed:", error);
            alert("AI description generation is currently unavailable. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const sectionClass = "bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100";
    const inputClass = (err?: FieldErrors[string]) =>
        cn("w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all", err && "border-red-500");

    return (
        <div className="space-y-8">
            {/* Photo Upload */}
            <div className={sectionClass}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Camera className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-primary">Vehicle Photos</h2>
                    </div>
                    <span className="text-sm font-medium text-slate-400">{images.length}/10 Images</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <AnimatePresence>
                        {previews.map((preview, idx) => (
                            <motion.div
                                key={preview}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm"
                            >
                                <img src={preview} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                                {idx === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(idx)}
                                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {images.length < 10 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Add Photo</span>
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onImageSelect}
                    className="hidden"
                />
                <p className="mt-6 text-sm text-slate-400 font-medium">
                    <Info className="w-4 h-4 inline mr-1 mb-0.5" />
                    First image will be used as the cover photo.
                </p>
            </div>

            {/* Basic Information */}
            <div className={sectionClass}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Info className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-primary">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Listing Title</label>
                        <input
                            {...register("title")}
                            placeholder="e.g. 2024 Toyota Camry XSE - Low Mileage"
                            className={inputClass(errors.title)}
                        />
                        {errors.title && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Asking Price ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                {...register("price", {
                                    onChange: (e) => {
                                        const rawValue = e.target.value.replace(/\D/g, "");
                                        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        e.target.value = formattedValue;
                                        setValue("price", formattedValue, { shouldValidate: true });
                                    }
                                })}
                                placeholder="1,250,000"
                                className={cn(inputClass(errors.price), "pl-10")}
                            />
                        </div>
                        {errors.price && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Body Type</label>
                        <CustomSelect
                            value={watch("bodyType") || "Sedan"}
                            onChange={(val) => setValue("bodyType", val as any)}
                            options={[
                                { value: "Sedan", label: "Sedan" },
                                { value: "SUV", label: "SUV" },
                                { value: "Truck", label: "Truck" },
                                { value: "Coupe", label: "Coupe" },
                                { value: "Van", label: "Van / Minivan" },
                                { value: "Electric", label: "Electric" },
                                { value: "Luxury", label: "Luxury" },
                                { value: "Convertible", label: "Convertible" },
                            ]}
                            className="bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Location Details */}
            <div className={sectionClass}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-primary">Location Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                        <input {...register("address")} placeholder="Street address, unit number, etc." className={inputClass(errors.address)} />
                        {errors.address && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.address.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                        <input {...register("city")} placeholder="Beverly Hills" className={inputClass(errors.city)} />
                        {errors.city && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.city.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Listing Type</label>
                        <div className="flex gap-4">
                            {["sale", "rent"].map((type) => (
                                <label key={type} className="flex-1 cursor-pointer">
                                    <input type="radio" {...register("listingType")} value={type} className="hidden peer" />
                                    <div className="w-full text-center py-3.5 rounded-xl border border-slate-200 font-bold capitalize peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 transition-all">
                                        {type}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {listingType === "rent" && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Rental Cycle</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[{ id: "DAILY", label: "Daily" }, { id: "WEEKLY", label: "Weekly" }, { id: "MONTHLY", label: "Monthly" }].map((cycle) => (
                                    <label key={cycle.id} className="cursor-pointer">
                                        <input type="radio" {...register("rentCycle")} value={cycle.id} className="hidden peer" />
                                        <div className="w-full text-center py-3 rounded-xl border border-slate-200 font-medium peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                                            {cycle.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.rentCycle && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.rentCycle.message}</p>}
                        </div>
                    )}
                </div>

                {showMap && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-700">Pin Location on Map</label>
                            <button
                                type="button"
                                onClick={() => {
                                    if ("geolocation" in navigator) {
                                        navigator.geolocation.getCurrentPosition(
                                            (pos) => onLocationSelect(pos.coords.latitude, pos.coords.longitude),
                                            (err) => alert("Could not fetch location: " + err.message)
                                        );
                                    }
                                }}
                                className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/10"
                            >
                                <MapPin className="w-3 h-3" /> Use My Location
                            </button>
                        </div>
                        <LocationPicker 
                            onLocationSelect={onLocationSelect} 
                            initialLat={lat}
                            initialLng={lng}
                        />
                        <input type="hidden" {...register("latitude")} />
                        <input type="hidden" {...register("longitude")} />
                    </div>
                )}
            </div>

            {/* Vehicle Details */}
            <div className={sectionClass}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Car className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-primary">Vehicle Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Make</label>
                        <input {...register("make")} placeholder="Toyota" className={inputClass(errors.make)} />
                        {errors.make && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.make.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Model</label>
                        <input {...register("model")} placeholder="Camry" className={inputClass(errors.model)} />
                        {errors.model && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.model.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
                        <input {...register("year")} type="number" placeholder="2024" className={inputClass(errors.year)} />
                        {errors.year && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.year.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Mileage (km)</label>
                        <input {...register("mileage")} type="number" placeholder="15000" className={inputClass(errors.mileage)} />
                        {errors.mileage && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.mileage.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
                        <input {...register("color")} placeholder="White" className={inputClass(errors.color)} />
                        {errors.color && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.color.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
                        <CustomSelect
                            value={watch("condition") || "USED"}
                            onChange={(val) => setValue("condition", val as any)}
                            options={[
                                { value: "NEW", label: "New" },
                                { value: "USED", label: "Used" },
                                { value: "CERTIFIED_PRE_OWNED", label: "Certified Pre-Owned" },
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Transmission</label>
                        <CustomSelect
                            value={watch("transmission") || "AUTOMATIC"}
                            onChange={(val) => setValue("transmission", val as any)}
                            options={[
                                { value: "AUTOMATIC", label: "Automatic" },
                                { value: "MANUAL", label: "Manual" },
                                { value: "CVT", label: "CVT" },
                                { value: "SEMI_AUTO", label: "Semi-Automatic" },
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
                        <CustomSelect
                            value={watch("fuelType") || "PETROL"}
                            onChange={(val) => setValue("fuelType", val as any)}
                            options={[
                                { value: "PETROL", label: "Petrol" },
                                { value: "DIESEL", label: "Diesel" },
                                { value: "ELECTRIC", label: "Electric" },
                                { value: "HYBRID", label: "Hybrid" },
                                { value: "PLUG_IN_HYBRID", label: "Plug-in Hybrid" },
                            ]}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-slate-700">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerateAIDescription}
                                disabled={isGenerating}
                                className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/10 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3 h-3" /> AI Generate
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            {...register("description")}
                            rows={5}
                            placeholder="Describe your vehicle's best features, condition, and service history..."
                            className={cn(inputClass(errors.description), "resize-none")}
                        />
                        {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
