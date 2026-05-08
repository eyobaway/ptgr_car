"use client";

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getFileUrl } from '@/lib/api';
import { Trash2, MoreHorizontal, Shield, User as UserIcon, ShieldAlert, Search, Filter } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const fetchUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data;
};

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const queryClient = useQueryClient();
    const { data: users, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to delete user.");
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }: { id: string, role: string }) => {
            await api.put(`/admin/users/${id}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to update user role.");
        }
    });

    const filteredUsers = React.useMemo(() => {
        if (!users) return [];
        return users.filter((user: any) => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const columns = React.useMemo(() => [
        { 
            accessorKey: "profileImage", 
            header: "User Identity",
            cell: ({ row }: { row: any }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm">
                        <AvatarImage src={getFileUrl(row.original.profileImage)} />
                        <AvatarFallback className="bg-slate-50 text-slate-400 font-bold uppercase text-xs">
                            {row.original.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-primary">{row.original.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{row.original.email}</span>
                    </div>
                </div>
            )
        },
        { 
            accessorKey: "role", 
            header: "Permission Level",
            cell: (info: any) => {
                const role = info.getValue() as string;
                const colors: any = {
                    ADMIN: "bg-indigo-50 text-indigo-700 ring-indigo-100",
                    AGENT: "bg-emerald-50 text-emerald-700 ring-emerald-100",
                    USER: "bg-emerald-50 text-emerald-700 ring-emerald-100"
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${colors[role] || "bg-slate-50 text-slate-500 ring-slate-100"}`}>
                        {role}
                    </span>
                );
            }
        },
        { 
            accessorKey: "createdAt", 
            header: "Registration",
            cell: (info: any) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-600">
                        {new Date(info.getValue()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">Standard License</span>
                </div>
            )
        },
        {
            id: "actions",
            header: "Management",
            cell: ({ row }: { row: any }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-slate-50 rounded-xl transition-colors">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-3xl border-slate-100 shadow-[0_20px_50px_rgba(22,57,98,0.12)] font-sans">
                            <DropdownMenuLabel className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
                            
                            <DropdownMenuItem 
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-primary/5 focus:text-primary group transition-colors"
                                onClick={() => updateRoleMutation.mutate({ id: user.id, role: 'USER' })}
                            >
                                <UserIcon className="w-4 h-4 text-slate-400 group-focus:text-primary" />
                                <span className="font-bold text-sm">Demote to User</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-600 group transition-colors"
                                onClick={() => updateRoleMutation.mutate({ id: user.id, role: 'AGENT' })}
                            >
                                <Shield className="w-4 h-4 text-slate-400 group-focus:text-emerald-500" />
                                <span className="font-bold text-sm">Elevate to Dealer</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 group transition-colors"
                                onClick={() => updateRoleMutation.mutate({ id: user.id, role: 'ADMIN' })}
                            >
                                <ShieldAlert className="w-4 h-4 text-slate-400 group-focus:text-indigo-500" />
                                <span className="font-bold text-sm">Promote to Admin</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-50 my-1 mx-2" />
                            
                            <DropdownMenuItem 
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer focus:bg-red-50 focus:text-red-600 group transition-colors"
                                onClick={() => {
                                    if(confirm('Verify permanent account deletion? This action cannot be undone.')) {
                                        deleteMutation.mutate(user.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                                <span className="font-bold text-sm">Delete Account</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [deleteMutation, updateRoleMutation]);

    const table = useReactTable({
        data: filteredUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Account Directory</span>
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">System <span className="text-slate-300">Users.</span></h1>
                    <p className="text-slate-500 font-medium mt-2">Manage credentials, adjust permissions, and monitor the network community.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                            placeholder="Find user..." 
                            className="pl-10 h-10 w-[240px] rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-xs font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Network</p>
                        <p className="text-xl font-black text-primary leading-none tabular-nums">{users?.length || 0}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(22,57,98,0.05)] border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-100">
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
                                            <Skeleton className="h-6 w-full rounded-xl bg-slate-100/50" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    className="hover:bg-slate-50/50 border-slate-50 transition-colors group"
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
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                                            <UserIcon className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-black text-lg">No matching users found.</p>
                                            <p className="text-slate-400 font-medium text-sm text-center max-w-xs mx-auto">Try adjusting your search criteria or refining your filters.</p>
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
