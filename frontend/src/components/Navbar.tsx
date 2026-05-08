"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Heart, LogOut, MessageCircle, User, ChevronRight, PlusCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import RoleGuard from "./RoleGuard";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Initial load for unread count
    useEffect(() => {
        if (!session) return;

        const fetchInitialCount = () => {
            import('@/lib/api').then(m => {
                m.default.get('/messages/conversations')
                    .then(res => {
                        const totalUnread = res.data.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
                        setUnreadMessages(totalUnread);
                    }).catch(err => console.error("Error fetching unreads for navbar", err));
            });
        };

        fetchInitialCount();

        // Listen for custom events from the /messages page
        const handleUnreadUpdate = (e: CustomEvent<{ count?: number, delta?: number }>) => {
            if (e.detail.count !== undefined) {
                setUnreadMessages(e.detail.count);
            } else if (e.detail.delta !== undefined) {
                setUnreadMessages(prev => Math.max(0, prev + e.detail.delta!));
            }
        };

        window.addEventListener('updateUnreadCount', handleUnreadUpdate as EventListener);
        return () => window.removeEventListener('updateUnreadCount', handleUnreadUpdate as EventListener);

    }, [session]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
                isScrolled
                    ? "py-3 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-[0_4px_24px_0_rgba(0,0,0,0.06)]"
                    : "py-6 bg-linear-to-b from-slate-900/70 to-transparent text-white"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isScrolled ? "bg-primary text-white" : "bg-white text-primary"
                    )}>
                        <Car className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-xl font-black tracking-wide leading-none",
                            isScrolled ? "text-slate-900" : "text-white"
                        )}>
                            PTGR
                        </span>
                        <span className={cn(
                            "text-xs font-bold tracking-[0.2em] leading-none opacity-80",
                            isScrolled ? "text-slate-600" : "text-slate-200"
                        )}>
                            CARS
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/buy" className={cn("text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors", isScrolled ? "text-slate-600" : "text-white/90 hover:text-white")}>Buy</Link>
                    <Link href="/rent" className={cn("text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors", isScrolled ? "text-slate-600" : "text-white/90 hover:text-white")}>Rent</Link>
                    <Link href="/sell" className={cn("text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors", isScrolled ? "text-slate-600" : "text-white/90 hover:text-white")}>Sell</Link>
                    <Link href="/dealers" className={cn("text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors", isScrolled ? "text-slate-600" : "text-white/90 hover:text-white")}>Dealers</Link>
                    <Link href="/news" className={cn("text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors", isScrolled ? "text-slate-600" : "text-white/90 hover:text-white")}>News</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <RoleGuard allowedRoles={["DEALER", "ADMIN"]}>
                        <Link
                            href="/sell"
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95",
                                isScrolled ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover" : "bg-white text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            <PlusCircle className="w-5 h-5" />
                            List a Car
                        </Link>
                    </RoleGuard>

                    {session ? (
                        <>
                            {/* Messages Link */}
                            <Link
                                href="/messages"
                                className={cn(
                                    "p-2 rounded-full border transition-all inline-flex items-center justify-center group relative cursor-pointer outline-none",
                                    isScrolled ? "border-slate-200 text-slate-900 hover:bg-slate-100" : "border-white/30 text-white hover:bg-white/20"
                                )}
                            >
                                <MessageCircle className="w-5 h-5 transition-transform group-active:scale-90" />
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                        {unreadMessages > 9 ? '9+' : unreadMessages}
                                    </span>
                                )}
                            </Link>

                            {/* Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={cn(
                                            "flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border transition-all hover:scale-105 active:scale-95 group cursor-pointer outline-none",
                                            isScrolled ? "border-slate-200 bg-slate-50" : "border-white/30 bg-white/10"
                                        )}
                                    >
                                        <Avatar src={(session.user as any).image} name={session.user.name || "User"} size="sm" />
                                        <span className={cn("text-sm font-bold truncate max-w-[100px]", isScrolled ? "text-slate-900" : "text-white")}>
                                            {session.user.name?.split(' ')[0]}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-72 mt-4 bg-white/80 backdrop-blur-xl rounded-4xl border border-white/50 shadow-2xl p-3 overflow-hidden z-60"
                                >
                                    <div className="p-4 px-2 mb-2 flex flex-col items-center text-center">
                                        <Avatar src={(session.user as any).image} name={session.user.name || "User"} size="md" />
                                        <h4 className="mt-3 font-black text-slate-900 tracking-tight">{session.user.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 truncate w-full uppercase tracking-widest">{session.user.email}</p>
                                    </div>

                                    <DropdownMenuSeparator className="bg-slate-100/50 mb-2" />

                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors group outline-none">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-slate-700">My Profile</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/saved" className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors group outline-none">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-rose-50 rounded-xl text-rose-600 group-hover:scale-110 transition-transform">
                                                    <Heart className="w-5 h-5" />
                                                </div>
                                                <span className="font-bold text-slate-700">Saved Cars</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300" />
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-slate-100/50 my-2" />

                                    <DropdownMenuItem
                                        onSelect={() => signOut()}
                                        className="flex items-center justify-between p-3 rounded-2xl cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors group outline-none"
                                    >
                                        <div className="flex items-center gap-3 text-slate-700 group-hover:text-red-600 transition-colors">
                                            <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-red-100 transition-colors">
                                                <LogOut className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold">Logout</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>

                    ) : (
                        status !== "loading" && (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className={cn(
                                        "px-6 py-2 rounded-full font-bold transition-all",
                                        isScrolled ? "text-slate-900 border border-slate-200 hover:bg-slate-50" : "bg-white/10 text-white border border-white/30 hover:bg-white/20"
                                    )}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-2.5 rounded-full font-bold transition-all bg-primary text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className={cn("w-8 h-8", isScrolled ? "text-slate-900" : "text-white")} />
                    ) : (
                        <Menu className={cn("w-8 h-8", isScrolled ? "text-slate-900" : "text-white")} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-xl border-t border-slate-100 flex flex-col p-5 gap-1 md:hidden text-slate-900 max-h-[80vh] overflow-y-auto">
                    <Link href="/buy" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">Buy Cars</Link>
                    <Link href="/rent" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">Rent Cars</Link>
                    <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="text-left text-base font-bold py-3 border-b border-slate-100">Sell a Car</Link>
                    <Link href="/dealers" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">Find Dealers</Link>
                    <Link href="/news" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">News & Reviews</Link>
                    {session && (
                        <>
                            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">My Profile</Link>
                            <Link href="/saved" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 border-b border-slate-100">Saved Cars</Link>
                            <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold py-3 flex items-center justify-between border-b border-slate-100">
                                Messages
                                {unreadMessages > 0 && (
                                    <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {unreadMessages > 9 ? '9+' : unreadMessages}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}
                    <RoleGuard allowedRoles={["DEALER", "ADMIN"]}>
                        <Link
                            href="/sell"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20"
                        >
                            <PlusCircle className="w-5 h-5" />
                            List a Car
                        </Link>
                    </RoleGuard>
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold mt-2 border border-slate-200"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3.5 rounded-xl font-bold mt-2 border border-slate-200"
                            >
                                <User className="w-5 h-5" />
                                Login
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20 hover:bg-primary/90"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
