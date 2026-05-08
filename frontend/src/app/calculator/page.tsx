"use client";

import React from "react";
import AutoLoanCalculator from "@/components/AutoLoanCalculator";
import { Calculator, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function CalculatorPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden min-h-[400px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" 
                        alt="Automotive background" 
                        className="w-full h-full object-cover opacity-10 grayscale"
                    />
                    <div className="absolute inset-0 bg-slate-50/80" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest text-primary mb-6 shadow-sm">
                        <Calculator className="w-4 h-4" />
                        <span>Financial Tools</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        Auto Loan <span className="text-primary">Calculator.</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Planning your next purchase? Use our expert tool to estimate your monthly payments and see what fits your budget.
                    </p>
                </div>
            </section>

            {/* Main Calculator */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
                <div className="relative">
                    <div className="absolute -inset-4 bg-linear-to-r from-primary/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
                    <AutoLoanCalculator price="0" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 premium-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-6">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Estimates</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            Get real-time updates as you adjust price, down payment, and terms.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 premium-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Fees</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            We include estimated registration and insurance costs for a complete picture.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 premium-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Fast & Simple</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            No personal information required. Just input your numbers and get results.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
