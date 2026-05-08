"use client";

import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/api";

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    className?: string;
}

const Avatar = ({ src, name, size = "md", className }: AvatarProps) => {
    const sizeMap = {
        "xs": "w-6 h-6",
        "sm": "w-8 h-8",
        "md": "w-12 h-12",
        "lg": "w-14 h-14",
        "xl": "w-16 h-16",
        "2xl": "w-24 h-24",
        "3xl": "w-32 h-32",
        "4xl": "w-48 h-48",
    };

    const iconSizeMap = {
        "xs": 10,
        "sm": 12,
        "md": 16,
        "lg": 18,
        "xl": 20,
        "2xl": 28,
        "3xl": 40,
        "4xl": 64,
    };

    const textSizeMap = {
        "xs": "text-[10px]",
        "sm": "text-xs",
        "md": "text-lg",
        "lg": "text-xl",
        "xl": "text-2xl",
        "2xl": "text-4xl",
        "3xl": "text-6xl",
        "4xl": "text-8xl",
    };

    const getInitials = (nameInput?: string) => {
        if (!nameInput) return "";
        const parts = nameInput.trim().split(/\s+/);
        if (parts.length === 0) return "";
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const initials = getInitials(name);
    const imageUrl = src ? getFileUrl(src) : null;

    const renderFallback = () => (
        <div 
            className={cn(
                sizeMap[size], 
                "rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 shadow-sm", 
                className
            )}
            title={name}
        >
            {initials ? (
                <span className={textSizeMap[size]}>{initials}</span>
            ) : (
                <User size={iconSizeMap[size]} />
            )}
        </div>
    );

    if (!imageUrl) {
        return renderFallback();
    }

    return (
        <div className={cn(sizeMap[size], "rounded-full overflow-hidden border border-slate-100 shrink-0 shadow-sm bg-slate-50", className)}>
            <img
                src={imageUrl}
                alt={name || "User avatar"}
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                        // Create initials element
                        parent.className = cn(parent.className, "bg-primary flex items-center justify-center text-white font-bold");
                        parent.innerHTML = initials 
                            ? `<span class="${textSizeMap[size]}">${initials}</span>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSizeMap[size]}" height="${iconSizeMap[size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                    }
                }}
            />
        </div>
    );
};

export default Avatar;
