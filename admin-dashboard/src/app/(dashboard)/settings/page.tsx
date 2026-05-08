"use client";

import * as React from 'react';
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from '@tanstack/react-query';
import api, { getFileUrl } from '@/lib/api';
import { User, Shield, Bell, Save, Loader2, Camera, Mail, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [image, setImage] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // Fetch current user data
    const { data: userData, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await api.get('/users/me');
            return res.data;
        }
    });

    // Sync state when data is loaded
    React.useEffect(() => {
        if (userData) {
            setName(userData.name || "");
            setEmail(userData.email || "");
        }
    }, [userData]);

    const updateProfileMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: async (data) => {
            // Update session if needed
            await updateSession({
                ...session,
                user: {
                    ...session?.user,
                    name: data.user.name,
                    email: data.user.email,
                    image: data.user.profileImage
                }
            });
            alert("Profile updated successfully!");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to update profile.");
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (image) {
            formData.append("profileImage", image);
        }
        updateProfileMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading preferences...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <div>
                <h1 className="text-4xl font-black text-[#163962] tracking-tight">System <span className="text-slate-300">Settings.</span></h1>
                <p className="text-slate-500 font-medium mt-2">Manage your administrative profile, security credentials, and system preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mb-8 h-auto gap-2">
                    <TabsTrigger value="profile" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                        <Shield className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                    <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/5 rounded-full transition-transform group-hover:scale-110"></div>
                                
                                <div className="relative inline-block mb-6">
                                    <Avatar className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl">
                                        <AvatarImage src={previewUrl || getFileUrl(userData?.profileImage)} />
                                        <AvatarFallback className="bg-slate-100 text-slate-400 font-black text-2xl">
                                            {userData?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl border-4 border-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                                        <Camera className="w-4 h-4" />
                                        <input id="avatar-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                                
                                <h3 className="text-xl font-black text-[#163962]">{name || "Administrator"}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-4">{userData?.role || "Super Admin"}</p>
                                
                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-xs text-slate-400 font-medium">Joined {new Date(userData?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input 
                                                id="name" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/10 transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/10 transition-all font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={updateProfileMutation.isPending}
                                        className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-3 h-auto"
                                    >
                                        {updateProfileMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Update Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                    <div className="max-w-2xl bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] space-y-8">
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black text-[#163962]">Security Credentials</h2>
                            <p className="text-slate-500 font-medium">Keep your administrative account secure by managing your password.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</Label>
                                <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all h-auto">
                                Update Password
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
