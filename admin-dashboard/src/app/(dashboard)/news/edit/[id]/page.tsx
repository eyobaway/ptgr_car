"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArticleForm } from '@/components/ArticleForm';
import { ArrowLeft, BookOpen, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: article, isLoading } = useQuery({
    queryKey: ['admin-article', id],
    queryFn: async () => {
      const res = await api.get(`/news/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/admin/news/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      alert("Article updated successfully!");
      router.push('/news');
      router.refresh();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update article.");
    }
  });

  if (isLoading) {
    return (
        <div className="max-w-6xl mx-auto space-y-10 py-6">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-10 w-96 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                <div className="lg:col-span-2">
                    <Skeleton className="h-[600px] w-full rounded-[32px]" />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-[300px] w-full rounded-[32px]" />
                    <Skeleton className="h-[400px] w-full rounded-[32px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/news" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest mb-4 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Editorial List
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-[#163962] tracking-tight">Refine <span className="text-slate-300">Article.</span></h1>
            <div className="px-3 py-1 bg-amber-50 rounded-full border border-amber-100 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Editing Mode</span>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg">Enhance and update your platform's insights with the rich authoring studio.</p>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
             <img src={article?.image} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#163962] opacity-40 uppercase tracking-[0.2em]">Revision History</span>
            <span className="text-sm font-black text-[#163962] truncate max-w-[120px]">{article?.title}</span>
          </div>
        </div>
      </div>

      <ArticleForm 
        initialData={article}
        onSubmit={(data) => updateMutation.mutate(data)} 
        isLoading={updateMutation.isPending} 
      />
    </div>
  );
}
