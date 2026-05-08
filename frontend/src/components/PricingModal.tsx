"use client"
import React, { useState } from "react";
import { X, Check, Star, Zap, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

const plans = [
    {
        name: "Basic",
        price: "29.00",
        displayPrice: "$29",
        duration: "per listing",
        description: "Perfect for individual sellers wanting a quick sale.",
        features: ["30-day listing", "Standard visibility", "5 High-res photos", "Basic support"],
        icon: Zap,
        color: "text-blue-500",
        bg: "bg-blue-50",
        buttonText: "Choose Basic"
    },
    {
        name: "Premium",
        price: "79.00",
        displayPrice: "$79",
        duration: "per listing",
        description: "Boost your visibility and close deals faster.",
        features: ["90-day listing", "Featured in search", "Unlimited photos", "Video walkthrough", "Priority support"],
        icon: Star,
        color: "text-amber-500",
        bg: "bg-amber-50",
        buttonText: "Go Premium",
        popular: true
    },
    {
        name: "Dealer Pro",
        price: "199.00",
        displayPrice: "$199",
        duration: "month",
        description: "For dealers with multiple vehicles.",
        features: ["Unlimited listings", "Maximum visibility", "Detailed car video", "Verified badge", "Dedicated account manager"],
        icon: ShieldCheck,
        color: "text-primary",
        bg: "bg-primary/10",
        buttonText: "Start Subscription"
    }
];

const PricingModal = ({ isOpen, onClose, onPaymentSuccess }: PricingModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

    if (!isOpen) return null;

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={() => !isProcessing && onClose()}
                ></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">

                    {isProcessing && (
                        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                            <h3 className="text-3xl font-black text-primary mb-2">Processing Payment</h3>
                            <p className="text-slate-500 text-lg max-w-sm">Please wait while we secure your {selectedPlan?.name} listing plan...</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="px-8 md:px-12 py-6 md:py-10 border-b border-slate-100 flex items-center justify-between text-center flex-col md:flex-row md:text-left shrink-0">
                        <div>
                             <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-2">Choose your listing plan</h2>
                            <p className="text-slate-500 text-sm md:text-lg font-medium">Get your vehicle in front of millions of buyers today.</p>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors mt-6 md:mt-0"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Pricing Grid - Scrollable area */}
                    <div className="p-6 md:p-12 overflow-y-auto overflow-x-hidden grow custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={cn(
                                        "relative p-8 rounded-[2.5rem] border transition-all duration-300 flex flex-col h-full",
                                        plan.popular
                                            ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-2 ring-primary/20 scale-105 z-10"
                                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"
                                    )}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", plan.bg, plan.color)}>
                                            <plan.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{plan.duration}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-primary">{plan.displayPrice}</span>
                                        </div>
                                        <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-4 mb-8 grow">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-slate-600">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-semibold">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-auto">
                                        {selectedPlan?.name === plan.name ? (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <PayPalButtons
                                                    style={{ layout: "vertical", shape: "rect", label: "pay" }}
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            intent: "CAPTURE",
                                                            purchase_units: [
                                                                {
                                                                    description: plan.name + " Listing Plan",
                                                                    amount: {
                                                                        currency_code: "USD",
                                                                        value: plan.price,
                                                                    },
                                                                },
                                                            ],
                                                        });
                                                    }}
                                                    onApprove={async (data, actions) => {
                                                        if (actions.order) {
                                                            setIsProcessing(true);
                                                            await actions.order.capture();
                                                            setIsProcessing(false);
                                                            onPaymentSuccess();
                                                            onClose();
                                                        }
                                                    }}
                                                    onCancel={() => setSelectedPlan(null)}
                                                    onError={(err) => {
                                                        console.error("PayPal Error:", err);
                                                        setSelectedPlan(null);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => setSelectedPlan(null)}
                                                    className="w-full mt-2 text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
                                                >
                                                    Cancel selection
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedPlan(plan)}
                                                disabled={isProcessing}
                                                className={cn(
                                                    "w-full py-4 rounded-2xl font-black text-base transition-all duration-300 shadow-lg",
                                                    plan.popular
                                                        ? "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
                                                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                                                )}
                                            >
                                                {plan.buttonText}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="px-8 md:px-12 py-6 md:py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-4 shrink-0">
                        <ShieldCheck className="w-5 h-5 text-slate-400" />
                        <p className="text-slate-500 text-xs md:text-sm font-medium text-center">Secure SSL Encrypted Payment Gateways only.</p>
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
};

export default PricingModal;
