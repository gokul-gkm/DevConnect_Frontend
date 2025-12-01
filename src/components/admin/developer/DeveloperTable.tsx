import { useMemo } from 'react';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/shadcn-button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from "framer-motion";
import { ArrowUpDown, Eye, Mail, Users } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { paginationType } from '@/types/ui.type';

type Developer = {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        profilePicture?: string;
        isVerified: boolean;
        status: 'active' | 'blocked';
    };
};



type DevelopersTableProps = {
    developers: Developer[];
    pagination: paginationType;
    queryParams: any;
    onSort: (sortBy: string) => void;
    onToggleStatus: (developerId: string) => void;
    onViewDetails: (developerId: string) => void;
    updateParams: (params: any) => void;
};

export default function DevelopersTable({ developers, pagination, queryParams, onSort, onToggleStatus, onViewDetails,updateParams }: DevelopersTableProps) {
    const columns = useMemo<ColumnDef<Developer>[]>(() => [
        {
            accessorKey: 'username',
            header: () => (
                <Button variant="ghost" onClick={() => onSort('username')} className="text-slate-400 hover:text-slate-100">
                    Username <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-lg ring-1 ring-slate-700/50">
                        {row.original.userId.profilePicture ? 
                            <img src={row.original.userId.profilePicture} className="object-cover rounded-full" alt={row.original.userId.username} /> 
                            : <Users className="h-5 w-5 text-slate-300" />
                        }
                    </div>
                    <div>
                        <div className="font-medium text-slate-100">{row.original.userId.username}</div>
                        <div className="text-xs text-slate-400">ID: {row.original.userId._id.slice(0, 8)}</div>
                    </div>
                </motion.div>
            ),
        },
        {
            accessorKey: 'email',
            header: () => (
                <Button variant="ghost" onClick={() => onSort('email')} className="text-slate-400 hover:text-slate-100">
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{row.original.userId.email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    variant={row.original.userId.status === 'active' ? 'success' : 'destructive'}
                    className={cn("font-medium shadow-lg", row.original.userId.status === 'active' ? "bg-emerald-950/50 text-emerald-200 border-emerald-900/50" : "bg-red-950/50 text-red-200 border-red-900/50")}
                >
                    <span className={cn("mr-1 h-2 w-2 rounded-full inline-block", row.original.userId.status === 'active' ? "bg-emerald-400" : "bg-red-400")} />
                    {row.original.userId.status === 'active' ? 'Active' : 'Blocked'}
                </Badge>
            ),
        },
        {
            accessorKey: 'isVerified',
            header: 'Verified',
            cell: ({ row }) => (
                <Badge
                    variant={row.original.userId.isVerified ? 'success' : 'warning'}
                    className={cn("font-medium shadow-lg", row.original.userId.isVerified ? "bg-blue-950/50 text-blue-200 border-blue-900/50" : "bg-amber-950/50 text-amber-200 border-amber-900/50")}
                >
                    {row.original.userId.isVerified ? '✓ Verified' : '⚠ Pending'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button
                        variant={row.original.userId.status === 'active' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => onToggleStatus(row.original.userId._id)}
                        className={cn("w-24 transition-all shadow-lg rounded-full", row.original.userId.status === 'active' ? "bg-red-950/50 hover:bg-red-900/50 text-red-200 border border-red-900/50" : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50")}
                    >
                        {row.original.userId.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                </div>
            ),
        },
        {
            id: 'view',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2 rounded-full">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetails(row.original._id)}
                        className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50 shadow-lg rounded-full w-28"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>
                </div>
            ),
        },
    ], [queryParams.sortOrder]);

    const table = useReactTable({
        data: developers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-slate-800/50 bg-slate-900/50 shadow-2xl backdrop-blur-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-slate-800/50">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-slate-400 bg-slate-900/90 first:rounded-tl-2xl last:rounded-tr-2xl py-5">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400">
                                        No developers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={row.id}
                                        className="border-slate-800/50 hover:bg-slate-800/50 transition-all duration-200"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>

            {pagination && (
                <Pagination pagination={pagination} updateParams={updateParams} />
               
            )}
        </>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}