"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/CustomSelect";
import { User, Settings, Heart, Bell, LogOut, LayoutDashboard, Home, Plus, Loader2, Briefcase, Camera, UserCircle, TrendingUp, MessageSquare, Car } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { getFileUrl } from "@/lib/api";
import ListingGrid from "@/components/ListingGrid";
import { useAuth } from "@/hooks/useAuth";
import { useDealer, useUpdateDealer, useDealerStats } from "@/hooks/useDealers";
import { useVehicles, useDeleteVehicle } from "@/hooks/useVehicles";
import { useUser } from "@/hooks/useUser";
import { useFavorites } from "@/context/FavoritesContext";
import Avatar from "@/components/Avatar";
import ProfileCharts from "@/components/ProfileCharts";
import { DealerAISummary } from "@/components/DealerAISummary";

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, logout, update: updateSession } = useAuth();
    const { user: fullUser, updatePreferences, isLoading: isUserLoading } = useUser();
    const { data: dealer, isLoading: isDealerLoading } = useDealer(authUser?.id?.toString() || "");
    const { data: stats } = useDealerStats();
    const updateDealer = useUpdateDealer();
    const { data: allVehicles = [] } = useVehicles();
    const deleteVehicle = useDeleteVehicle();
    const { favorites } = useFavorites();

    const [activeTab, setActiveTab] = useState<"saved" | "my-vehicles" | "preferences" | "professional">("saved");
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [dealerFile, setDealerFile] = useState<File | null>(null);
    const [dealerPreview, setDealerPreview] = useState<string | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const profileInputRef = React.useRef<HTMLInputElement>(null);
    const dealerInputRef = React.useRef<HTMLInputElement>(null);
    const { updateProfile } = useUser();

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");

    React.useEffect(() => {
        if (fullUser?.name) {
            setNameInput(fullUser.name);
        } else if (authUser?.name) {
            setNameInput(authUser.name);
        }
    }, [fullUser, authUser]);

    // Dealer form state
    const [dealerForm, setDealerForm] = useState({
        bio: "",
        phone: "",
        location: "",
        role: "Car Dealer",
        isActive: false,
    });

    // Preferences form state
    const [prefForm, setPrefForm] = useState({
        location: "",
        type: "SEDAN",
        minPrice: "",
        maxPrice: "",
        make: "",
        model: "",
    });

    // Sync form with user data when loaded
    React.useEffect(() => {
        if (fullUser?.preferences) {
            setPrefForm({
                location: fullUser.preferences.location || "",
                type: fullUser.preferences.type || "SEDAN",
                minPrice: fullUser.preferences.minPrice?.toString() || "",
                maxPrice: fullUser.preferences.maxPrice?.toString() || "",
                make: fullUser.preferences.make?.toString() || "",
                model: fullUser.preferences.model?.toString() || "",
            });
        }
    }, [fullUser]);

    // Sync dealer form
    React.useEffect(() => {
        if (dealer) {
            setDealerForm({
                bio: dealer.bio || "",
                phone: dealer.phone || "",
                location: dealer.location || "",
                role: dealer.role || "Car Dealer",
                isActive: dealer.isActive || false,
            });
            if (dealer.image) {
                setDealerPreview(getFileUrl(dealer.image));
            } else if ((authUser as any)?.image) {
                setDealerPreview((authUser as any).image);
            }
        }
    }, [dealer]);

    const handleDealerSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (dealerFile) {
                const formData = new FormData();
                formData.append("image", dealerFile);
                // Append other fields to formData
                Object.entries(dealerForm).forEach(([key, value]) => {
                    formData.append(key, value.toString());
                });
                await updateDealer.mutateAsync(formData);
                setDealerFile(null);
            } else {
                await updateDealer.mutateAsync(dealerForm);
            }
            
            // Refresh session to reflect DEALER role in UI
            if (updateSession) {
                await updateSession({ role: "DEALER" });
            }
            
            alert("Professional profile updated successfully!");
        } catch (error) {
            alert("Failed to update professional profile.");
        }
    };

    // Real saved vehicles based on IDs
    const savedVehicles = allVehicles.filter((v: any) => favorites.includes(v.id));

    const myVehicles = dealer?.vehicles || [];

    const handleEdit = (id: string) => {
        router.push(`/sell/${id}`);
    };

    // handleSave no longer needed — edits now navigate to /sell/[id] page


    const handleDelete = async (id: string) => {
        if (confirm(`Are you sure you want to delete this vehicle?`)) {
            try {
                await deleteVehicle.mutateAsync(id);
                alert("Vehicle deleted successfully.");
            } catch (error) {
                alert("Failed to delete vehicle.");
            }
        }
    };

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleDealerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDealerFile(file);
            setDealerPreview(URL.createObjectURL(file));
        }
    };

    const saveProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            const isNameChanged = isEditingName && nameInput.trim() !== (fullUser?.name || authUser?.name);
            
            if (profileFile || isNameChanged) {
                const formData = new FormData();
                if (profileFile) {
                    formData.append("profileImage", profileFile);
                }
                if (isNameChanged) {
                    formData.append("name", nameInput.trim());
                }
                await updateProfile.mutateAsync(formData);

                // Refresh session if name or image changed
                if (updateSession) {
                    await updateSession({ 
                        name: isNameChanged ? nameInput.trim() : undefined,
                        image: profileFile ? profilePreview : undefined
                    });
                }

                alert("Profile updated successfully!");
            }
            
            setProfileFile(null);
            setIsEditingName(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsUpdatingProfile(false);
        }
    };
    const handlePreferenceSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePreferences.mutateAsync({
                ...prefForm,
                minPrice: prefForm.minPrice ? parseFloat(prefForm.minPrice) : null,
                maxPrice: prefForm.maxPrice ? parseFloat(prefForm.maxPrice) : null,
                make: prefForm.make || null,
                model: prefForm.model || null,
            });
            alert("Preferences saved successfully!");
        } catch (error) {
            alert("Failed to save preferences.");
        }
    };



    if (!authUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <p className="text-slate-500 font-bold text-xl">Please log in to view your profile.</p>
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
        <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative group shrink-0">
                            <Avatar 
                                src={profilePreview || fullUser?.profileImage || (authUser as any)?.image} 
                                name={fullUser?.name || authUser?.name || "User"} 
                                size="2xl" 
                                className="border-4 border-white shadow-xl" 
                            />
                            <button
                                onClick={() => profileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-primary transition-colors border border-slate-100 z-10"
                            >
                                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <input
                                type="file"
                                ref={profileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-2">
                                {isEditingName ? (
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="text-xl md:text-3xl font-bold text-slate-900 border-b-2 border-primary/50 focus:border-primary outline-none bg-transparent w-full"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveProfile();
                                            if (e.key === 'Escape') {
                                                setIsEditingName(false);
                                                setNameInput(fullUser?.name || authUser?.name || "");
                                            }
                                        }}
                                    />
                                ) : (
                                    <h1 className="text-xl md:text-3xl font-bold text-slate-900 flex items-center gap-2 md:gap-3 group">
                                        Welcome back, {fullUser?.name || authUser?.name}
                                        <button 
                                            onClick={() => setIsEditingName(true)}
                                            className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit Name"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                        </button>
                                    </h1>
                                )}
                                
                                {(profileFile || isEditingName) && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={saveProfile}
                                            disabled={isUpdatingProfile}
                                            className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                                        >
                                            {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                        </button>
                                        {isEditingName && !isUpdatingProfile && (
                                            <button 
                                                onClick={() => { 
                                                    setIsEditingName(false); 
                                                    setNameInput(fullUser?.name || authUser?.name || ""); 
                                                    setProfileFile(null);
                                                    setProfilePreview(null);
                                                }}
                                                className="text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-500 font-medium text-xs md:text-sm truncate">
                                {authUser?.email} • Member since {fullUser?.created_at ? new Date(fullUser.created_at).getFullYear() : new Date().getFullYear()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto">
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white rounded-xl font-bold text-slate-700 text-sm md:text-base shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-slate-900 text-white rounded-xl font-bold text-sm md:text-base hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* AI Summary Card for Dealers */}
                {dealer && (
                    <DealerAISummary />
                )}

                {/* Dashboard Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, staggerChildren: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
                >
                    {[
                        { label: "Saved Vehicles", value: favorites.length.toString(), icon: Heart, color: "text-primary", bg: "bg-primary/5" },
                        { label: "My Listings", value: myVehicles.length.toString(), icon: Car, color: "text-primary", bg: "bg-primary/5" },
                        { label: "Avg Listing Price", value: stats?.summary?.avgPrice ? `$${(stats.summary.avgPrice / 1000).toFixed(0)}k` : "$0", icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
                        { label: "Total Inquiries", value: stats?.engagementData?.reduce((acc: number, curr: any) => acc + (curr.inquiries || 0), 0).toString() || "0", icon: MessageSquare, color: "text-primary", bg: "bg-primary/5" },
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-4xl premium-shadow border border-slate-100 flex flex-col gap-4 group hover:bg-primary transition-all duration-500"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-primary group-hover:text-white transition-colors text-3xl font-black tabular-nums">{stat.value}</h3>
                                <p className="text-slate-500 group-hover:text-blue-100 transition-colors font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Advanced Chart Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <ProfileCharts 
                        engagementData={stats?.engagementData || []} 
                        listingPerformance={stats?.listingPerformance || []} 
                        vehicleStatusStats={stats?.vehicleStatusStats || []}
                    />
                </motion.div>

                {/* Content Tabs */}
                <div className="flex items-center gap-4 md:gap-8 border-b border-slate-200 mb-8 md:mb-12 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`pb-4 border-b-4 font-bold text-sm md:text-lg whitespace-nowrap transition-all duration-300 ${activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        Saved Vehicles
                    </button>
                    <button
                        onClick={() => setActiveTab("my-vehicles")}
                        className={`pb-4 border-b-4 font-bold text-sm md:text-lg whitespace-nowrap transition-all duration-300 ${activeTab === "my-vehicles" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        My Listings
                    </button>
                    <button
                        onClick={() => setActiveTab("preferences")}
                        className={`pb-4 border-b-4 font-bold text-sm md:text-lg whitespace-nowrap transition-all duration-300 ${activeTab === "preferences" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab("professional")}
                        className={`pb-4 border-b-4 font-bold text-sm md:text-lg whitespace-nowrap transition-all duration-300 ${activeTab === "professional" ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                    >
                        Professional
                    </button>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {activeTab === "professional" && (
                        <div className="bg-white p-6 md:p-8 lg:p-12 rounded-3xl md:rounded-4xl premium-shadow border border-slate-100 max-w-3xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="relative group">
                                        <Avatar 
                                            src={dealerPreview} 
                                            size="xl" 
                                            className="rounded-2xl border-2 border-white shadow-md" 
                                        />
                                        <div 
                                            onClick={() => dealerInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl"
                                        >
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={dealerInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleDealerImageChange}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                            Professional Profile
                                        </h2>
                                        <p className="text-slate-500 text-sm font-medium">Professional photo & details</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                    <span className="text-sm font-bold text-slate-600">Dealer Mode</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={dealerForm.isActive}
                                            onChange={(e) => setDealerForm({ ...dealerForm, isActive: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <p className="text-slate-500 font-medium mb-10">
                                Set up your professional profile to appear in the dealer directory and start listing vehicles.
                            </p>

                            <form onSubmit={handleDealerSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700">Professional Role/Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Senior Consultant, Luxury Vehicle Specialist"
                                            value={dealerForm.role}
                                            onChange={(e) => setDealerForm({ ...dealerForm, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="+1 (555) 000-0000"
                                            value={dealerForm.phone}
                                            onChange={(e) => setDealerForm({ ...dealerForm, phone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-sm font-bold text-slate-700">Service Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Beverly Hills, CA"
                                            value={dealerForm.location}
                                            onChange={(e) => setDealerForm({ ...dealerForm, location: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-sm font-bold text-slate-700">Professional Bio</label>
                                        <textarea
                                            placeholder="Tell potential clients about your experience and expertise..."
                                            rows={5}
                                            value={dealerForm.bio}
                                            onChange={(e) => setDealerForm({ ...dealerForm, bio: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updateDealer.isPending}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateDealer.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Professional Profile"}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === "saved" && (
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Heart className="w-6 h-6 fill-current" />
                                </div>
                                Saved Vehicles
                            </h2>
                            {savedVehicles.length > 0 ? (
                                <ListingGrid vehicles={savedVehicles} />
                            ) : (
                                <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-slate-200">
                                    <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium text-lg">You haven't saved any cars yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "my-vehicles" && (
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Car className="w-6 h-6" />
                                    </div>
                                    My Listings
                                </h2>
                                <Link
                                    href="/sell"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Cars
                                </Link>
                            </div>

                            {isDealerLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                </div>
                            ) : myVehicles.length > 0 ? (
                                <ListingGrid
                                    vehicles={myVehicles}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-slate-200">
                                    <Car className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium text-lg">You haven't listed any vehicles yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "preferences" && (
                        <div className="bg-white p-8 md:p-12 rounded-4xl premium-shadow border border-slate-100 max-w-3xl">
                            <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Settings className="w-6 h-6" />
                                </div>
                                Default Search Preferences
                            </h2>
                            <p className="text-slate-500 font-medium mb-10">
                                Set your preferred search criteria. These values will be automatically filled in the Hero section to help you find your dream car faster.
                            </p>

                            <form onSubmit={handlePreferenceSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Preferred Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. New York, Miami"
                                        value={prefForm.location}
                                        onChange={(e) => setPrefForm({ ...prefForm, location: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Car Body Type</label>
                                    <CustomSelect
                                        value={prefForm.type}
                                        onChange={(val) => setPrefForm({ ...prefForm, type: val as any })}
                                        options={[
                                            { value: "SEDAN", label: "Sedans" },
                                            { value: "SUV", label: "SUVs" },
                                            { value: "TRUCK", label: "Trucks" },
                                            { value: "COUPE", label: "Coups" },
                                             { value: "HATCHBACK", label: "Hatchbacks" },
                                            { value: "CONVERTIBLE", label: "Convertibles" },
                                            { value: "VAN", label: "Minivans" },
                                            { value: "ELECTRIC", label: "Electric" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Min Price ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={prefForm.minPrice}
                                        onChange={(e) => setPrefForm({ ...prefForm, minPrice: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Max Price ($)</label>
                                    <input
                                        type="number"
                                        placeholder="Any"
                                        value={prefForm.maxPrice}
                                        onChange={(e) => setPrefForm({ ...prefForm, maxPrice: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Select a Make </label>
                                    <CustomSelect
                                        value={prefForm.make}
                                        onChange={(val) => setPrefForm({ ...prefForm, make: val })}
                                        options={[
                                            { value: "", label: "Any Make" },
                                            { value: "Toyota", label: "Toyota" },
                                            { value: "BMW", label: "BMW" },
                                            { value: "Mercedes-Benz", label: "Mercedes-Benz" },
                                            { value: "Ford", label: "Ford" },
                                            { value: "Honda", label: "Honda" },
                                            { value: "Tesla", label: "Tesla" },
                                        ]}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700">Preferred Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Camry, X5"
                                        value={prefForm.model}
                                        onChange={(e) => setPrefForm({ ...prefForm, model: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updatePreferences.isPending}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {updatePreferences.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Preferences"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
