"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
    Loader2, 
    Mail, 
    Lock, 
    ShieldCheck, 
    ChevronRight, 
    Sparkles, 
    Car 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@ptgr.com");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Login: Starting authentication...");
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("Login: Response received", res);

            if (res?.error) {
                setError("The credentials you provided are incorrect.");
                setLoading(false);
            } else if (!res) {
                setError("No response from authentication server. Please try again.");
                setLoading(false);
            } else {
                console.log("Login: Success, redirecting...");
                router.push("/");
                // Give it a moment to navigate before stopping the loader if needed, 
                // but usually push clears the page state anyway.
                setTimeout(() => {
                    setLoading(false);
                }, 5000);
            }
        } catch (err: any) {
            console.error("Login: Client-side error", err);
            setError("An unexpected error occurred during login.");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-6 overflow-hidden bg-white font-sans" suppressHydrationWarning>
            {/* Animated Background Mesh - Light Version */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[55%] h-[55%] rounded-full bg-primary/3 blur-[150px]" />
                
                {/* Floating Soft Orbs */}
                <motion.div 
                    animate={{ 
                        y: [0, -40, 0],
                        x: [0, 30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/2 rounded-full blur-3xl pointer-events-none" 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[420px]"
            >
                {/* Brand Logo Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 mb-6 shadow-sm"
                    >
                        <Car className="w-8 h-8 text-primary" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-4xl font-black text-[#163962] tracking-tighter mb-2 italic">
                            PTGR<span className="text-primary not-italic inline-block ml-1">Admin</span>
                        </h1>
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] flex items-center justify-center gap-2">
                             <ShieldCheck className="w-3 h-3 text-primary" /> Secure Management Suite
                        </p>
                    </motion.div>
                </div>

                {/* Login Card - Clean White Version */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(22,57,98,0.08)] border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2 mb-2"
                                >
                                    <Sparkles className="w-4 h-4 shrink-0 text-red-400" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                                Access ID
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@email.com"
                                    className="block w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-sm h-14"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-3 ml-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Passkey
                                </label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 focus:bg-white transition-all font-semibold text-sm h-14"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="relative w-full group bg-primary text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-70 h-14"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer Credits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-center"
                >
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                        &copy; 2026 Core Infrastructure v4.2
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
