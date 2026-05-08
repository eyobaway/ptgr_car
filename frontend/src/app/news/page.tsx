"use client";

import React from "react";
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks/useNews";

export default function NewsPage() {
    const { data: articles = [], isLoading, isError } = useArticles();

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4 bg-primary/5 px-4 py-2 rounded-full">
                        <BookOpen className="w-4 h-4" />
                        <span>Insights & Analysis</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4 md:mb-6">
                        New Technology News{" "}
                        <span className="text-primary">for the Modern Era.</span>
                    </h1>
                    <p className="text-slate-500 md:text-lg leading-relaxed">
                        Expert advice, automotive trends, and inspiration for car enthusiasts, buyers, and sellers.
                    </p>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-slate-500 font-bold">Fetching latest news...</p>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20 text-red-500 font-bold bg-white rounded-4xl border border-slate-100 p-12">
                        Error loading news. Please try again later.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article: any) => (
                            <Link
                                key={article.id}
                                href={`/news/${article.id}`}
                                className="group bg-white rounded-[2.5rem] overflow-hidden premium-shadow border border-slate-100 hover-lift transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                                        {article.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(article.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {article.author}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                                        {article.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-100">
                                        <div className="inline-flex items-center gap-2 text-slate-900 font-bold group-hover:text-primary transition-colors">
                                            Read Article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Newsletter CTA */}
                <div className="mt-12 md:mt-24 bg-slate-900 rounded-3xl md:rounded-4xl p-8 md:p-12 lg:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                                Subscribe to our{" "}
                                <span className="text-primary">Weekly Newsletter.</span>
                            </h2>
                            <p className="text-slate-400 md:text-lg mb-0 text-justify">
                                Join 50,000+ subscribers who get our best Car Deal advice and market insights delivered to their inbox.
                            </p>
                        </div>
                        <div>
                            <form className="flex flex-col md:flex-row gap-4">
                                <button className="flex-1 bg-white text-slate-900 px-8 py-4 md:py-5 rounded-xl font-bold md:text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
                                    Subscribe Now
                                </button>
                            </form>
                            <p className="text-slate-500 text-sm mt-4 text-center md:text-left">
                                No spam, ever. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
