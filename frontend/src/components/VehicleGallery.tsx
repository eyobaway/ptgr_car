"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/api";

interface VehicleGalleryProps {
    images: string[];
    address: string;
}

const FALLBACK = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200";

export default function VehicleGallery({ images, address }: VehicleGalleryProps) {
    const allImages = (images?.length > 0 ? images : [FALLBACK]).map(getFileUrl);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    const isOpen = lightboxIndex !== null;

    const navigate = useCallback((dir: number) => {
        if (lightboxIndex === null) return;
        setDirection(dir);
        setLightboxIndex(prev => prev === null ? null : (prev + dir + allImages.length) % allImages.length);
    }, [lightboxIndex, allImages.length]);

    const openLightbox = (idx: number) => setLightboxIndex(idx);
    const closeLightbox = () => setLightboxIndex(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowLeft") navigate(-1);
            if (e.key === "Escape") closeLightbox();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, navigate]);

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <>
            {/* ── Cover Image Only ── */}
            <div className="w-full h-[60vh] relative bg-slate-900 overflow-hidden">
                <img
                    src={allImages[0]}
                    alt={address}
                    className="w-full h-full object-cover opacity-85"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/30 to-transparent pointer-events-none" />
            </div>

            {/* ── Lightbox Modal ── */}
            <AnimatePresence>
                {isOpen && lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/97 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/5">
                            <span className="text-white/60 text-sm font-medium truncate max-w-[60%]">{address}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-white/80 font-bold text-sm">
                                    {lightboxIndex + 1} / {allImages.length}
                                </span>
                                <button
                                    onClick={closeLightbox}
                                    className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Image Viewport */}
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden px-14 py-4">
                            <AnimatePresence initial={false} custom={direction} mode="sync">
                                <motion.img
                                    key={lightboxIndex}
                                    src={allImages[lightboxIndex]}
                                    alt={`${address} — photo ${lightboxIndex + 1}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                    className="absolute max-w-full max-h-full object-contain rounded-2xl select-none shadow-2xl"
                                    draggable={false}
                                />
                            </AnimatePresence>

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="absolute left-3 w-11 h-11 bg-white/10 text-white rounded-full border border-white/10 flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => navigate(1)}
                                        className="absolute right-3 w-11 h-11 bg-white/10 text-white rounded-full border border-white/10 flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Bottom Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="shrink-0 px-6 py-4 flex items-center justify-center gap-2.5 overflow-x-auto scrollbar-none border-t border-white/5">
                                {allImages.map((img, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => { setDirection(i > lightboxIndex ? 1 : -1); setLightboxIndex(i); }}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "shrink-0 w-16 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                            i === lightboxIndex
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-transparent opacity-45 hover:opacity-80"
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Thumbnail Gallery Card (rendered separately via prop) ── */}
            {/* See: PhotoGalleryCard component used in property/[id]/page.tsx */}
        </>
    );
}

/* ── Standalone Thumbnail Gallery Card ── */
interface PhotoGalleryCardProps {
    images: string[];
    address: string;
}

export function PhotoGalleryCard({ images, address }: PhotoGalleryCardProps) {
    const allImages = (images?.length > 0 ? images : []).map(getFileUrl);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);
    const isOpen = lightboxIndex !== null;

    const navigate = useCallback((dir: number) => {
        if (lightboxIndex === null) return;
        setDirection(dir);
        setLightboxIndex(prev => prev === null ? null : (prev + dir + allImages.length) % allImages.length);
    }, [lightboxIndex, allImages.length]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowLeft") navigate(-1);
            if (e.key === "Escape") setLightboxIndex(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, navigate]);

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    if (allImages.length === 0) return null;

    return (
        <>
            <section className="bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Photo Gallery</h2>
                    <span className="text-slate-400 text-sm font-medium">{allImages.length} photo{allImages.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Scrollable horizontal thumbnail row */}
                <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                    {allImages.map((img, i) => (
                        <motion.button
                            key={i}
                            onClick={() => { setDirection(0); setLightboxIndex(i); }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative shrink-0 w-40 h-28 rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-primary/50 shadow-sm hover:shadow-lg transition-all duration-300 group"
                        >
                            <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                            {/* Index badge */}
                            <span className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {i + 1}
                            </span>

                            {/* Cover badge */}
                            {i === 0 && (
                                <span className="absolute top-2 left-2 text-white text-[10px] font-bold bg-primary px-2 py-0.5 rounded-full">
                                    Cover
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                <p className="text-slate-400 text-xs font-medium mt-4">
                    Click any photo to view full size
                </p>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {isOpen && lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/97 flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/5">
                            <span className="text-white/60 text-sm font-medium truncate max-w-[60%]">{address}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-white/80 font-bold text-sm">{lightboxIndex + 1} / {allImages.length}</span>
                                <button onClick={() => setLightboxIndex(null)} className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center overflow-hidden px-14 py-4">
                            <AnimatePresence initial={false} custom={direction} mode="sync">
                                <motion.img
                                    key={lightboxIndex}
                                    src={allImages[lightboxIndex]}
                                    alt={`Photo ${lightboxIndex + 1}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                    className="absolute max-w-full max-h-full object-contain rounded-2xl select-none shadow-2xl"
                                    draggable={false}
                                />
                            </AnimatePresence>

                            {allImages.length > 1 && (
                                <>
                                    <button onClick={() => navigate(-1)} className="absolute left-3 w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => navigate(1)} className="absolute right-3 w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/25 hover:scale-105 transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {allImages.length > 1 && (
                            <div className="shrink-0 px-6 py-4 flex items-center justify-center gap-2.5 overflow-x-auto scrollbar-none border-t border-white/5">
                                {allImages.map((img, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => { setDirection(i > lightboxIndex ? 1 : -1); setLightboxIndex(i); }}
                                        whileHover={{ scale: 1.08 }}
                                        className={cn(
                                            "shrink-0 w-16 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                            i === lightboxIndex ? "border-white scale-110" : "border-transparent opacity-45 hover:opacity-80"
                                        )}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
