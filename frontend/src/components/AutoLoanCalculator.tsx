"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Percent, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomSelect from "@/components/CustomSelect";

interface AutoLoanCalculatorProps {
    price: string; // e.g., "$45,000"
}

const AutoLoanCalculator = ({ price }: AutoLoanCalculatorProps) => {
    // Parse initial price
    const initialPrice = typeof price === 'string' 
        ? parseInt(price.replace(/[^0-9]/g, "")) 
        : Number(price);

    const [vehiclePrice, setVehiclePrice] = useState(initialPrice || 0);
    const [downPayment, setDownPayment] = useState((initialPrice || 0) * 0.15); // Default 15% down
    const [interestRate, setInterestRate] = useState(5.9); // Average car loan rate
    const [loanTerm, setLoanTerm] = useState(60); // 5 years (60 months) default
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const principal = vehiclePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm; // Term is already in months

        if (monthlyRate === 0) {
            setMonthlyPayment(numberOfPayments > 0 ? principal / numberOfPayments : 0);
        } else if (numberOfPayments > 0) {
            const payment =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(payment);
        }
    }, [vehiclePrice, downPayment, interestRate, loanTerm]);

    return (
        <div id="auto-loan-calculator" className="bg-white p-8 md:p-10 rounded-[2rem] premium-shadow border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Auto Loan Calculator</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inputs */}
                <div className="space-y-6 relative z-20">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Price</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={vehiclePrice}
                                onChange={(e) => setVehiclePrice(Number(e.target.value))}
                                className="w-full pl-10 pr-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Down Payment ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="w-full pl-10 pr-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={vehiclePrice}
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full mt-3 accent-primary cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Interest Rate (%)</label>
                            <div className="relative">
                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full pl-10 pr-5 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Loan Term</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <CustomSelect
                                    value={loanTerm.toString()}
                                    onChange={(val) => setLoanTerm(Number(val))}
                                    options={[
                                        { value: "84", label: "84 Months" },
                                        { value: "72", label: "72 Months" },
                                        { value: "60", label: "60 Months" },
                                        { value: "48", label: "48 Months" },
                                        { value: "36", label: "36 Months" },
                                        { value: "24", label: "24 Months" },
                                        { value: "12", label: "12 Months" },
                                    ]}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 w-full">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Monthly Payment</div>
                        <div className="text-5xl lg:text-6xl font-black mb-6">
                            ${Math.round(monthlyPayment).toLocaleString()}
                        </div>

                        <div className="space-y-3 w-full bg-white/5 rounded-xl p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Principal & Interest</span>
                                <span className="font-bold">${Math.round(monthlyPayment).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Registration & Tax (est.)</span>
                                <span className="font-bold">${Math.round(vehiclePrice * 0.035 / 12).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Auto Insurance (est.)</span>
                                <span className="font-bold">${Math.round(vehiclePrice * 0.008 / 12).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-500">
                            * Payment is an estimation only. Actual auto loan terms may vary based on credit score, vehicle age, and lender policies.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoLoanCalculator;
