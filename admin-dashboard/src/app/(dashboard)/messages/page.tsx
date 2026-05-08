"use client";

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getFileUrl } from '@/lib/api';
import { Mail, User as UserIcon, MessageSquare, Calendar, ChevronRight, Search } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const fetchMessages = async () => {
    const res = await api.get('/admin/messages');
    return res.data;
};

export default function MessagesPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const queryClient = useQueryClient();
    const { data: messages, isLoading } = useQuery({ queryKey: ['admin-messages'], queryFn: fetchMessages });

    const filteredData = React.useMemo(() => {
        if (!messages) return [];
        return messages.filter((m: any) => 
            m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.sender?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [messages, searchTerm]);

    const columns = React.useMemo(() => [
        { 
            accessorKey: "sender", 
            header: "Inquirer",
            cell: ({ row }: { row: any }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-full border border-slate-100">
                        <AvatarImage src={getFileUrl(row.original.sender?.profileImage)} />
                        <AvatarFallback className="bg-blue-50 text-blue-400 font-bold uppercase text-[10px]">
                            {row.original.sender?.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-primary">{row.original.sender?.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{row.original.sender?.email}</span>
                    </div>
                </div>
            )
        },
        {
            id: "direction",
            header: "",
            cell: () => <ChevronRight className="w-4 h-4 text-slate-300" />
        },
        { 
            accessorKey: "receiver", 
            header: "Target Dealer",
            cell: ({ row }: { row: any }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-full border border-slate-100">
                        <AvatarImage src={getFileUrl(row.original.receiverProfile?.image || row.original.receiver?.profileImage)} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-400 font-bold uppercase text-[10px]">
                            {row.original.receiver?.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-primary">{row.original.receiver?.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.original.receiverProfile?.role || 'Dealer'}</span>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: "content", 
            header: "Inquiry Content",
            cell: (info: any) => (
                <div className="max-w-[300px]">
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">"{info.getValue()}"</p>
                </div>
            )
        },
        { 
            accessorKey: "createdAt", 
            header: "Received At",
            cell: (info: any) => (
                <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-bold">{new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Communications Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">Leads & <span className="text-slate-300">Inquiries.</span></h1>
                    <p className="text-slate-500 font-medium pt-1">Monitor site-wide communication and track high-intent vehicle leads.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                            placeholder="Search leads..." 
                            className="pl-10 h-10 w-[240px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xs font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="px-4 py-1.5 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Total Leads</p>
                        <p className="text-xl font-black text-primary leading-none tabular-nums">{messages?.length || 0}</p>
                    </div>
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
                                        <TableCell key={j} className="px-6 py-5">
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
                                        <TableCell key={cell.id} className="px-6 py-6 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-24">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                                            <Mail className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-black text-lg">No inquiries found.</p>
                                            <p className="text-slate-400 font-medium text-sm">When users reach out to dealers, they'll appear here.</p>
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
                            className="bg-white border-slate-200 rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-all h-9"
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => table.nextPage()} 
                            disabled={!table.getCanNextPage()} 
                            className="bg-white border-slate-200 rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm disabled:opacity-30 hover:border-primary hover:text-primary transition-all h-9"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
