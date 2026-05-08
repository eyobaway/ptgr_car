"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArticleForm } from '@/components/ArticleForm';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CreateArticlePage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/admin/news', data);
      return res.data;
    },
    onSuccess: () => {
      alert("Article published successfully!");
      router.push('/news');
      router.refresh();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to publish article.");
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-4 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Editorial List
          </Link>
          <h1 className="text-4xl font-black text-[#163962] tracking-tight">Compose <span className="text-slate-300">New Insight.</span></h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Create a professional article with rich formatting and localized content.</p>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-primary/5 rounded-[2rem] border border-primary/10">
          <BookOpen className="w-6 h-6 text-primary/40" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Authoring Mode</span>
            <span className="text-sm font-bold text-[#163962]">Rich Content Studio</span>
          </div>
        </div>
      </div>

      <ArticleForm 
        onSubmit={(data) => createMutation.mutate(data)} 
        isLoading={createMutation.isPending} 
      />
    </div>
  );
}
