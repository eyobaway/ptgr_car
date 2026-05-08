"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setIsGoogleLoading(true);
        signIn("google", { callbackUrl });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">

            {/* Left Side: Form */}
            <div className="flex items-center justify-center p-8 lg:p-16 xl:p-24 bg-white relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="space-y-4 text-center lg:text-left">
                        {/* <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-2xl font-black text-primary tracking-tighter">PTGR REALTY</span>
                        </Link> */}
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Access your Car sels dashboard.
                        </p>
                    </motion.div>

                    {/* Social Login */}
                    <motion.div variants={itemVariants}>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading || isGoogleLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-500 flex-shrink-0" />
                            ) : (
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Continue with Google
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-slate-100"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or email login</span>
                        <div className="h-px flex-1 bg-slate-100"></div>
                    </motion.div>

                    {/* Login Form */}
                    <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:underline underline-offset-4">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading}
                            className="w-full bg-primary hover:bg-primary-hover disabled:bg-slate-400 text-white font-bold py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-blue-900/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    {/* Footer */}
                    <motion.div variants={itemVariants} className="pt-6 text-center">
                        <p className="text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-primary font-extrabold hover:underline transition-all underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Side: Visual Section */}
            <div className="hidden lg:block relative p-12 overflow-hidden bg-primary">
                {/* Main Hero Background */}
                <div
                    className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/login-hero.png")' }}
                />

                <div className="absolute inset-0 z-10 bg-linear-to-br from-primary/80 via-primary/40 to-transparent" />

                {/* Content over image */}
                <div className="relative z-20  h-full flex flex-col justify-evenly text-white">
                    <div className="space-y-6 max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                        >
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm font-bold tracking-wider">PREMIUM LISTINGS LIVE</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-5xl font-black leading-tight tracking-tight"
                        >
                            Find the most exclusive <br />
                            <span className="text-blue-200">Cars worldwide.</span>
                        </motion.h2>
                    </div>

                    {/* Floating Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Secure Search</h3>
                            <p className="text-white/60 text-sm leading-relaxed">End-to-end encrypted communication and verified agents.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0 }}
                            className="p-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Global Scale</h3>
                            <p className="text-white/60 text-sm leading-relaxed">Access Different cars across 50+ countries with local expertise.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] z-0 -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
}
