"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, ArrowUpRight, MessageCircle, MessageSquare } from "lucide-react";
import { Dealer } from "@/lib/data";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AuthGuardModal from "./AuthGuardModal";
import { useRouter } from "next/navigation";
import Avatar from "./Avatar";

const DealerCard = ({ id, name, role, image, email, phone, listings, userId }: Dealer) => {
    const { isOpen, modalOptions, closeModal, guardAction } = useAuthGuard();
    const router = useRouter();

    const handleMessageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        guardAction(() => {
            router.push(`/messages?userId=${userId}`);
        }, {
            title: "Message Dealer",
            description: `Sign in to message ${name} and inquire about their premium vehicles.`,
            icon: <MessageSquare className="w-8 h-8 text-primary" />
        });
    };

    return (
        <>
            <div className="group block bg-white p-6 rounded-4xl premium-shadow border border-slate-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl relative overflow-hidden h-full">
                {/* Stretched Link - covers the entire card but allows other links to be clicked */}
                <Link
                    href={`/dealers/${id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`View ${name}'s profile`}
                />

                <div className="relative z-10 pointer-events-none">
                    <div className="flex items-center gap-6">
                        <Avatar 
                            src={image} 
                            name={name} 
                            size="2xl" 
                            className="group-hover:border-primary transition-colors border-2" 
                        />

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
                            <p className="text-primary font-medium text-sm mb-3">{role}</p>
                            <div className="flex items-center gap-4 text-slate-500 text-sm">
                                <span className="font-semibold text-slate-900">{listings}</span> Active Listings
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 relative z-20">
                    <a
                        href={`mailto:${email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm font-medium"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </a>
                    <a
                        href={`tel:${phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm font-medium"
                    >
                        <Phone className="w-4 h-4" />
                        Call
                    </a>
                    {userId && (
                        <button
                            onClick={handleMessageClick}
                            className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors text-sm font-bold"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all ml-auto pointer-events-none">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
            <AuthGuardModal
                isOpen={isOpen}
                onClose={closeModal}
                {...modalOptions}
            />
        </>
    );
};

export default DealerCard;
