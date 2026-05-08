"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, Loader2, Image as ImageIcon, Type, User, BookOpen, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full rounded-2xl bg-slate-50" />
});

import { Skeleton } from "@/components/ui/skeleton";

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  author: z.string().min(2, "Author name is required"),
  image: z.string().url("Please enter a valid image URL"),
  content: z.string().min(20, "Content is too short"),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  initialData?: any;
  onSubmit: (data: ArticleFormValues) => void;
  isLoading?: boolean;
}

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'code-block'],
    ['clean']
  ],
};

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet',
  'link', 'image', 'code-block'
];

export function ArticleForm({ initialData, onSubmit, isLoading }: ArticleFormProps) {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData || {
      title: "",
      excerpt: "",
      category: "Market Trends",
      author: "Admin Editorial",
      image: "",
      content: "",
    }
  });

  const previewImage = watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Title</Label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  {...register("title")}
                  placeholder="e.g. The Rise of Smart Homes in Addis Ababa" 
                  className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-bold text-[#163962]"
                />
              </div>
              {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Excerpt</Label>
              <textarea 
                {...register("excerpt")}
                rows={3}
                placeholder="A brief summary to catch the reader's attention..."
                className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-slate-600 resize-none outline-none focus:ring-2 focus:ring-primary/5 shadow-sm"
              />
              {errors.excerpt && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Content</Label>
                <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/30">
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <ReactQuill 
                                theme="snow" 
                                value={field.value} 
                                onChange={field.onChange}
                                modules={QUILL_MODULES}
                                formats={QUILL_FORMATS}
                                className="bg-white min-h-[400px]"
                            />
                        )}
                    />
                </div>
                {errors.content && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.content.message}</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Media */}
        <div className="lg:col-span-1 space-y-6">
          {/* Media Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image</Label>
              <div className="aspect-video w-full rounded-2xl bg-slate-50 border border-dashed border-slate-200 overflow-hidden relative flex items-center justify-center group">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">No Preview</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input 
                  {...register("image")}
                  placeholder="Paste image URL here..." 
                  className="h-11 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xs font-bold"
                />
              </div>
              {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.image.message}</p>}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.05)] space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-xs">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-sans">
                        <SelectItem value="Market Trends" className="font-bold">Market Trends</SelectItem>
                        <SelectItem value="Buying Tips" className="font-bold">Buying Tips</SelectItem>
                        <SelectItem value="Design & Decor" className="font-bold">Design & Decor</SelectItem>
                        <SelectItem value="Finance" className="font-bold">Finance</SelectItem>
                        <SelectItem value="News" className="font-bold">Local News</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    {...register("author")}
                    placeholder="e.g. Alex Solomon" 
                    className="h-11 pl-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 h-auto text-sm"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {initialData ? "Apply Changes" : "Publish Article"}
                </Button>
                <Link href="/news" className="w-full">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                        Discard & Cancel
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none;
          background: #f8fafc;
          padding: 12px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 15px;
        }
        .ql-editor {
          min-height: 400px;
          padding: 30px;
          line-height: 1.8;
          color: #334155;
        }
        .ql-editor p {
            margin-bottom: 1.5em;
        }
        .ql-editor.ql-blank::before {
          color: #cbd5e1;
          font-style: italic;
          left: 30px;
        }
      `}</style>
    </form>
  );
}
