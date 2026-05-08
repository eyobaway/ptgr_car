"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useArticle } from "@/hooks/useNews";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ArticlePage({ params }: PageProps) {
    const { id } = use(params);
    const { data: article, isLoading, isError } = useArticle(id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading article...</p>
            </div>
        );
    }

    if (isError || !article) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-white pb-24">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden bg-slate-900">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent" />

                <div className="absolute top-8 left-6 md:left-12">
                    <Link href="/news" className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-md px-4 py-2 rounded-full transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to News</span>
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider mb-6">
                            {article.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                {new Date(article.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                {article.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                5 min read
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-lg prose-slate max-w-none">
                    <p className="lead text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-12 border-l-4 border-primary pl-6 italic">
                        {article.excerpt}
                    </p>

                    <div
                        dangerouslySetInnerHTML={{ __html: article.content || "" }}
                        className="[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-12 [&>h3]:mb-6 [&>p]:text-slate-600 [&>p]:leading-loose [&>p]:mb-6"
                    />
                </div>

                {/* Author Bio (Placeholder) */}
                <div className="mt-20 pt-12 border-t border-slate-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-lg">Written by {article.author}</div>
                        <div className="text-slate-500">Real Estate Specialist at PTGR Realty</div>
                    </div>
                </div>
            </main>
        </article>
    );
}
