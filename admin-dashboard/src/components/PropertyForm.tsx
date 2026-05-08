"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    X,
    Plus,
    DollarSign,
    MapPin,
    Car,
    Gauge,
    Calendar,
    Settings,
    Info,
    CheckCircle2,
    Loader2,
    Zap,
    Fuel,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/CustomSelect";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">Loading Map...</div>
});

const propertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City is required"),
    price: z.string().min(1, "Price is required"),
    type: z.enum(["SALE", "RENT"]),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.union([z.string(), z.number()]).transform(v => Number(v)),
    mileage: z.union([z.string(), z.number()]).transform(v => Number(v)),
    transmission: z.enum(["AUTOMATIC", "MANUAL", "CVT", "SEMI_AUTO"]),
    fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "PLUG_IN_HYBRID"]),
    condition: z.enum(["NEW", "USED", "CERTIFIED_PRE_OWNED"]),
    bodyType: z.string().min(1, "Body type is required"),
    color: z.string().optional(),
    description: z.string().min(10, "Description should be detailed"),
    features: z.string().optional(),
    lat: z.number().optional().default(9.0331),
    lng: z.number().optional().default(38.7501),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
    initialData?: any;
    onSubmit: (data: PropertyFormValues, images: File[], existingImages: string[]) => Promise<void>;
    isLoading?: boolean;
}

export function PropertyForm({ initialData, onSubmit, isLoading }: PropertyFormProps) {
    const router = useRouter();
    const [images, setImages] = React.useState<File[]>([]);
    const [previews, setPreviews] = React.useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<PropertyFormValues>({
        resolver: zodResolver(propertySchema),
        defaultValues: initialData ? {
            ...initialData,
            features: Array.isArray(initialData.features)
                ? initialData.features.join(", ")
                : (initialData.features || "")
        } : {
            title: "",
            address: "",
            city: "",
            price: "",
            type: "SALE",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            mileage: 0,
            transmission: "AUTOMATIC",
            fuelType: "PETROL",
            condition: "USED",
            bodyType: "Sedan",
            color: "White",
            description: "",
            features: "",
            lat: 9.0331,
            lng: 38.7501,
        },
    });

    // Handle initial images if they exist
    React.useEffect(() => {
        if (initialData?.images && initialData.images.length > 0) {
            setPreviews(initialData.images);
        }
    }, [initialData]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (previews.length + files.length > 10) {
            alert("Maximum 10 images allowed.");
            return;
        }

        const newFiles = [...images, ...files];
        setImages(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (idx: number) => {
        const isExisting = idx < (previews.length - images.length);

        if (isExisting) {
            setPreviews(prev => prev.filter((_, i) => i !== idx));
        } else {
            const fileIdx = idx - (previews.length - images.length);
            setImages(prev => prev.filter((_, i) => i !== fileIdx));
            setPreviews(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const onFormSubmit = async (data: PropertyFormValues) => {
        const existingImages = previews.filter(p => !p.startsWith("blob:"));
        await onSubmit(data, images, existingImages);
    };

    const sectionClass = "bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100 mb-8";
    const labelClass = "text-sm font-bold text-slate-700 mb-2 block";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-0">
                <AnimatePresence>
                    {/* Section 1: Photos */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={sectionClass}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-primary">Vehicle Photos</h2>
                            </div>
                            <span className="text-sm font-medium text-slate-400">{previews.length}/10 Images</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {previews.map((preview, idx) => (
                                <motion.div
                                    key={preview}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-100"
                                >
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                    {idx === 0 && (
                                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">Cover</div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}

                            {previews.length < 10 && (
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
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <p className="mt-6 text-sm text-slate-400 font-medium flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            First image will be used as the cover photo. Max 10 images.
                        </p>
                    </motion.div>

                    {/* Section 2: Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={sectionClass}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Info className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-primary">General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className={labelClass}>Listing Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. 2024 Toyota Land Cruiser - Brand New"
                                                className="px-5 py-6 rounded-xl border-slate-200 focus:ring-primary/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Make</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Toyota"
                                                className="px-5 py-6 rounded-xl border-slate-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Model</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Camry"
                                                className="px-5 py-6 rounded-xl border-slate-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Listing Price ($)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input
                                                    type="number"
                                                    placeholder="500,000"
                                                    className="pl-10 py-6 rounded-xl border-slate-200"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>Listing Type</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-4">
                                                {["SALE", "RENT"].map((type) => (
                                                    <label key={type} className="flex-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type}
                                                            checked={field.value === type}
                                                            onChange={() => field.onChange(type)}
                                                            className="hidden peer"
                                                        />
                                                        <div className="w-full text-center py-3.5 rounded-xl border border-slate-200 font-bold capitalize peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all">
                                                            {type.toLowerCase()}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </motion.div>

                    {/* Section 3: Location Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={sectionClass}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-primary">Location Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className={labelClass}>Street Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 Main St, Apartment 4B"
                                                className="px-5 py-6 rounded-xl border-slate-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="New York"
                                                className="px-5 py-6 rounded-xl border-slate-200"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className={labelClass}>Map Placement</label>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Click map to set exactly</p>
                                </div>
                                <LocationPicker
                                    onLocationSelect={(lat, lng) => {
                                        form.setValue("lat", lat);
                                        form.setValue("lng", lng);
                                    }}
                                    initialLat={form.watch("lat")}
                                    initialLng={form.watch("lng")}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="lat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-400">Latitude</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" className="bg-slate-50 border-slate-100" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lng"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-400">Longitude</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="any" className="bg-slate-50 border-slate-100" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Section 4: Specifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={sectionClass}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <Settings className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-primary">Vehicle Specifications</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><Calendar className="w-4 h-4 inline mr-2" /> Year</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="py-6 rounded-xl border-slate-200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mileage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><Gauge className="w-4 h-4 inline mr-2" /> Mileage (km)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="py-6 rounded-xl border-slate-200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="transmission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><Zap className="w-4 h-4 inline mr-2" /> Transmission</FormLabel>
                                        <CustomSelect
                                            options={[
                                                { label: "Automatic", value: "AUTOMATIC" },
                                                { label: "Manual", value: "MANUAL" },
                                                { label: "CVT", value: "CVT" },
                                                { label: "Semi-Auto", value: "SEMI_AUTO" },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select Transmission"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fuelType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><Fuel className="w-4 h-4 inline mr-2" /> Fuel Type</FormLabel>
                                        <CustomSelect
                                            options={[
                                                { label: "Petrol", value: "PETROL" },
                                                { label: "Diesel", value: "DIESEL" },
                                                { label: "Electric", value: "ELECTRIC" },
                                                { label: "Hybrid", value: "HYBRID" },
                                                { label: "Plug-in Hybrid", value: "PLUG_IN_HYBRID" },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select Fuel Type"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><ShieldCheck className="w-4 h-4 inline mr-2" /> Condition</FormLabel>
                                        <CustomSelect
                                            options={[
                                                { label: "New", value: "NEW" },
                                                { label: "Used", value: "USED" },
                                                { label: "Certified Pre-Owned", value: "CERTIFIED_PRE_OWNED" },
                                            ]}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select Condition"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bodyType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelClass}><Car className="w-4 h-4 inline mr-2" /> Body Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Sedan, SUV" className="py-6 rounded-xl border-slate-200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel className={labelClass}>Vehicle Description</FormLabel>
                                    <FormControl>
                                        <textarea
                                            className="flex min-h-[150px] w-full rounded-2xl border border-slate-200 bg-transparent px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                            placeholder="Describe the vehicle's features, history, and current state..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={labelClass}>Added Options & Features</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Leather Seats, Sunroof, Bluetooth, Backup Camera (comma separated)"
                                            className="px-5 py-6 rounded-xl border-slate-200 flex items-center"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">Separate multiple features with commas.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Final Actions */}
                <div className="flex flex-col md:flex-row justify-end gap-4 pb-12">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="py-6 px-10 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all hover:scale-105"
                        disabled={isLoading}
                    >
                        Discard Changes
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="py-6 px-12 rounded-2xl font-black text-base transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-3"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5" />
                        )}
                        {initialData ? "Save Vehicle Details" : "Create Listing Now"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
