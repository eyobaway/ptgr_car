"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className,
    disabled = false,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className={cn("relative w-full", isOpen ? "z-50" : "z-0", className)}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-5 py-3.5 border rounded-xl text-sm font-medium transition-all text-left",
                    isOpen 
                        ? "border-primary ring-2 ring-primary/20 bg-white" 
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100",
                    disabled && "opacity-50 cursor-not-allowed",
                    !selectedOption && "text-slate-500",
                    selectedOption && "text-slate-900"
                )}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                        <div className="max-h-[300px] overflow-y-auto p-1 scrollbar-thin">
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-left transition-colors",
                                            isSelected 
                                                ? "bg-primary text-white font-bold" 
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                                        )}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && <Check className="w-4 h-4 shrink-0 max-w-4 ml-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
