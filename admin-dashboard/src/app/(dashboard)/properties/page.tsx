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

const fetchProperties = async () => {
    const res = await api.get('/properties');
    return res.data;
};

const emptyData: any[] = [];

export default function PropertiesPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: properties, isLoading } = useQuery({ queryKey: ['properties'], queryFn: fetchProperties });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/properties/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
        },
        onError: () => {
            alert("Failed to delete property.");
        }
    });

    const columnsWithActions = React.useMemo(() => [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }: { row: any }) => {
                const img = row.original.image || row.original.images?.[0];
                return (
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                            src={getFileUrl(img)} 
                            alt={row.original.address} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            }
        },
        { accessorKey: "title", header: "Title" },
        { accessorKey: "make", header: "Make" },
        { accessorKey: "model", header: "Model" },
        { accessorKey: "year", header: "Year" },
        { accessorKey: "mileage", header: "Mileage", cell: (info: any) => `${Number(info.getValue()).toLocaleString()} km` },
        { accessorKey: "price", header: "Price", cell: (info: any) => `$${Number(info.getValue()).toLocaleString()}` },
        { accessorKey: "status", header: "Status", cell: (info: any) => (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold ring-1 ring-primary/20">{info.getValue() || 'Active'}</span>
        ) },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const property = row.original;
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
                                <Link href={`/properties/${property.id}`} className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 cursor-pointer">
                                    <Eye className="w-4 h-4 text-primary" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:bg-slate-50 rounded-lg">
                                <Link href={`/properties/${property.id}/edit`} className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 cursor-pointer">
                                    <Edit className="w-4 h-4 text-primary" />
                                    Edit Vehicle
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-red-600 focus:bg-red-50 rounded-lg cursor-pointer"
                                onClick={() => {
                                    if(confirm('Are you sure you want to delete this vehicle?')) {
                                        deleteMutation.mutate(property.id);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleteMutation.isPending && deleteMutation.variables === property.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ], [deleteMutation]);

    const table = useReactTable({
        data: properties ?? emptyData,
        columns: columnsWithActions,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Manage Vehicles</h1>
                <Link 
                    href="/properties/new" 
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    New Vehicle
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                                    onClick={() => router.push(`/properties/${row.original.id}`)}
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
                                <TableCell colSpan={columnsWithActions.length} className="text-center py-10">No vehicles found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                
                <div className="p-4 border-t flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
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
