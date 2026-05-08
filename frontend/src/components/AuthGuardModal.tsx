"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, User, ArrowRight, ShieldCheck, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthGuardModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

const AuthGuardModal = ({
    isOpen,
    onClose,
    title = "Authentication Required",
    description = "Sign in to access premium features and personalize your real estate journey.",
    icon = <ShieldCheck className="w-8 h-8 text-primary" />
}: AuthGuardModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] premium-shadow border border-white p-8 overflow-hidden"
                    >
                        {/* Decorative background circle */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <div className="inline-flex p-4 rounded-3xl bg-primary/10 mb-6 relative">
                                {icon}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                                {title}
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8 px-4">
                                {description}
                            </p>

                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200"
                                >
                                    Log In
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-200"
                                >
                                    Create Free Account
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="w-full text-slate-400 font-bold py-3 text-sm hover:text-slate-600 transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>

                        {/* Social proof footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-6">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Join 2k+ <br /> Active Users
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthGuardModal;
