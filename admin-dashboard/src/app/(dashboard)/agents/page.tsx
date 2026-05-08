"use client";

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getFileUrl } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
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

const fetchAgents = async () => {
    const res = await api.get('/agents');
    return res.data;
};

const columns = [
    { 
        accessorKey: "image", 
        header: "Avatar",
        cell: ({ row }: { row: any }) => {
            const agent = row.original;
            const imageUrl = agent.image || agent.user?.profileImage;
            return (
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                    {imageUrl ? (
                        <img 
                            src={getFileUrl(imageUrl)} 
                            alt={agent.user?.name} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-xs uppercase">
                            {agent.user?.name?.charAt(0) || "A"}
                        </div>
                    )}
                </div>
            );
        }
    },
    { accessorKey: "user.name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "isActive", header: "Status", cell: (info: any) => info.getValue() ? (
        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold ring-1 ring-emerald-100">Active</span>
    ) : (
        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-bold ring-1 ring-slate-100">Inactive</span>
    ) },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => {
            const agent = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border border-slate-200 rounded-xl p-1">
                        <DropdownMenuLabel className="px-2 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 border-slate-100" />
                        <DropdownMenuItem asChild className="focus:bg-slate-50 rounded-lg">
                            <Link href={`/agents/${agent.id}/edit`} className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 cursor-pointer">
                                <Edit className="w-4 h-4 text-primary" />
                                Edit Dealer
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                            onClick={() => {
                                if(confirm('Are you sure you want to delete this dealer?')) {
                                    // Delete logic will be handled by mutation later
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const emptyData: any[] = [];

export default function AgentsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: agents, isLoading } = useQuery({ queryKey: ['agents'], queryFn: fetchAgents });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/agents/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] });
        },
        onError: () => {
            alert("Failed to delete dealer. Admin role might be required.");
        }
    });

    // Update columns with delete logic
    const columnsWithActions = React.useMemo(() => [
        ...columns.filter(c => c.id !== "actions"),
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const agent = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border border-slate-200 rounded-xl p-1">
                            <DropdownMenuLabel className="px-2 py-1 text-xs font-bold text-primary opacity-70 uppercase tracking-wider">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1 border-slate-100" />
                            <DropdownMenuItem asChild className="focus:bg-slate-50 rounded-lg">
                                <Link href={`/agents/${agent.id}`} className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 cursor-pointer">
                                    <Eye className="w-4 h-4 text-primary" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:bg-slate-50 rounded-lg">
                                <Link href={`/agents/${agent.id}/edit`} className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 cursor-pointer">
                                    <Edit className="w-4 h-4 text-primary" />
                                    Edit Dealer
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                                onClick={() => {
                                    if(confirm('Are you sure you want to delete this dealer?')) {
                                        deleteMutation.mutate(agent.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleteMutation.isPending && deleteMutation.variables === agent.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [deleteMutation]);
    const table = useReactTable({
        data: agents ?? emptyData,
        columns: columnsWithActions,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Manage Dealers</h1>
                <Link 
                    href="/agents/new" 
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    New Dealer
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columnsWithActions.map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id} 
                                    onClick={() => router.push(`/agents/${row.original.id}`)}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnsWithActions.length} className="text-center py-10">No dealers found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                
                <div className="p-4 border-t flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-500">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                    </span>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="hover:text-primary hover:border-primary">Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="hover:text-primary hover:border-primary">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
