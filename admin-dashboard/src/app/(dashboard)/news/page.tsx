"use client";

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getFileUrl } from '@/lib/api';
import { Trash2, MoreHorizontal, Newspaper, Plus, Search, Calendar, User, Eye, Loader2, Edit3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const fetchArticles = async () => {
    const res = await api.get('/news'); // Using the public endpoint for management list
    return res.data;
};

export default function NewsManagementPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const queryClient = useQueryClient();
    const { data: articles, isLoading } = useQuery({ queryKey: ['admin-news'], queryFn: fetchArticles });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/news/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-news'] });
            alert("Article deleted successfully.");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to delete article.");
        }
    });

    const filteredData = React.useMemo(() => {
        if (!articles) return [];
        return articles.filter((a: any) => 
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [articles, searchTerm]);

    const columns = React.useMemo(() => [
        { 
            accessorKey: "image", 
            header: "Cover",
            cell: ({ row }: { row: any }) => (
                <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                    <img 
                        src={row.original.image} 
                        alt={row.original.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )
        },
        { 
            accessorKey: "title", 
            header: "Article Details",
            cell: ({ row }: { row: any }) => (
                <div className="flex flex-col max-w-[300px]">
                    <span className="text-sm font-black text-primary truncate">{row.original.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.original.category}</span>
                </div>
            )
        },
        { 
            accessorKey: "author", 
            header: "Author",
            cell: (info: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{info.getValue()}</span>
                </div>
            )
        },
        { 
            accessorKey: "date", 
            header: "Published On",
            cell: (info: any) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const article = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-slate-50 rounded-xl transition-colors">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-3xl border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.12)] font-sans">
                            <DropdownMenuLabel className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage Content</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
                            
                            <Link href={`/news/${article.id}`} target="_blank">
                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-primary/5 focus:text-primary group transition-colors">
                                    <Eye className="w-4 h-4 text-slate-400 group-focus:text-primary" />
                                    <span className="font-bold text-sm">View on Website</span>
                                </DropdownMenuItem>
                            </Link>

                            <Link href={`/news/edit/${article.id}`}>
                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-amber-50 focus:text-amber-600 group transition-colors">
                                    <Edit3 className="w-4 h-4 text-slate-400 group-focus:text-amber-500" />
                                    <span className="font-bold text-sm">Edit Article</span>
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
                            
                            <DropdownMenuItem 
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-red-50 focus:text-red-600 group transition-colors"
                                onClick={() => {
                                    if(confirm('Are you sure you want to delete this article?')) {
                                        deleteMutation.mutate(article.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                                <span className="font-bold text-sm">Delete Article</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [deleteMutation]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                        <Newspaper className="w-4 h-4" />
                        <span>Editorial Board</span>
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">News & <span className="text-slate-300">Insights.</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Manage the platform's public content, market reports, and automotive tips.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                            placeholder="Search articles..." 
                            className="pl-10 h-11 w-[240px] rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-primary/10 transition-all text-xs font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link href="/news/create">
                        <Button className="bg-primary hover:bg-primary/90 text-white font-black px-6 h-11 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95">
                            <Plus className="w-4 h-4" />
                            New Article
                        </Button>
                    </Link>
                </div>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(22,57,98,0.05)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-14 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 px-6">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-slate-50">
                                    {columns.map((_, j) => (
                                        <TableCell key={j} className="px-6 py-6">
                                            <Skeleton className="h-4 w-full rounded-full bg-slate-100/50" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    className="hover:bg-slate-50/50 border-slate-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-6 py-5 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-24">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                                            <Newspaper className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-black text-lg">No articles discovered.</p>
                                            <p className="text-slate-400 font-medium text-sm">Once you publish your first insight, it will appear here.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                
                <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => table.previousPage()} 
                            disabled={!table.getCanPreviousPage()} 
                            className="bg-white border-slate-200 rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-all h-9"
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => table.nextPage()} 
                            disabled={!table.getCanNextPage()} 
                            className="bg-white border-slate-200 rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-all h-9"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
