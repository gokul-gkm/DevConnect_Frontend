import { useState, useMemo } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Code2, Mail, Search, Shield, UserPlus, ArrowUpDown, Eye, Users } from 'lucide-react';
import { useAdminDevelopers } from '@/hooks/admin/useAdminDevelopers';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from "@/lib/utils";
import AdminTable from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import StatsCards from '@/components/admin/StatsCards';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export function AdminDeveloperPage() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const { 
        developers, 
        pagination, 
        isLoading, 
        queryParams, 
        updateParams,
        toggleStatusMutation 
    } = useAdminDevelopers();

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        handleSearch(value);
    };

    const handleSearch = debounce((search: string) => {
        updateParams({ search, page: 1 });
    }, 500);

    const handleSort = (sortBy: string) => {
        const sortOrder = queryParams.sortOrder === 'asc' ? 'desc' : 'asc';
        updateParams({ sortBy, sortOrder });
    };

    const handleViewDetails = (developerId: string) => {
        navigate(`/admin/developers/${developerId}`);
    };

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'username',
            header: () => (
                <Button variant="ghost" onClick={() => handleSort('username')} className="text-slate-400 hover:text-slate-100">
                    Username <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-lg ring-1 ring-slate-700/50">
                        {row.original.userId.profilePicture ? 
                            <img src={row.original.userId.profilePicture} className="object-cover rounded-full w-10 h-10" alt={row.original.userId.username} /> 
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
                <Button variant="ghost" onClick={() => handleSort('email')} className="text-slate-400 hover:text-slate-100">
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
                        onClick={() => toggleStatusMutation.mutate(row.original.userId._id)}
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
                        onClick={() => handleViewDetails(row.original._id)}
                        className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50 shadow-lg rounded-full w-28"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>
                </div>
            ),
        },
    ], [toggleStatusMutation]);

    const stats = [
        { 
            title: "Total Developers", 
            value: pagination?.total || 0, 
            icon: Code2, 
            color: "from-blue-600/20 to-blue-800/20", 
            borderColor: "border-blue-500/20" 
        },
        { 
            title: "Active Developers", 
            value: developers.filter((d: any) => d.userId.status === 'active').length, 
            icon: Shield, 
            color: "from-green-600/20 to-green-800/20", 
            borderColor: "border-green-500/20" 
        },
        { 
            title: "Verified Developers", 
            value: developers.filter((d: any) => d.userId.isVerified).length, 
            icon: Mail, 
            color: "from-purple-600/20 to-purple-800/20", 
            borderColor: "border-purple-500/20" 
        },
        { 
            title: "Developer Requests", 
            value: '', 
            icon: UserPlus, 
            color: "from-amber-600/20 to-amber-800/20", 
            borderColor: "border-amber-500/20", 
            onClick: () => navigate('/admin/developers/requests') 
        }
    ];

    if (isLoading) {
        return (
            <LoadingSpinner
            size="lg"
            text="Loading developers..."
            color="indigo"
            fullScreen={true}
          />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-8"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Developers Management</h1>
                        <p className="text-slate-400 mt-1">Manage and monitor developer accounts</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-200" />
                        <input
                            type="text"
                            placeholder="Search developers..."
                            value={searchText}
                            onChange={handleSearchInput}
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-lg"
                        />
                    </div>
                </motion.div>

                <StatsCards stats={stats} columns={4} />

                <AdminTable 
                    data={developers}
                    columns={columns}
                    pagination={pagination}
                    updateParams={updateParams}
                    emptyMessage="No developers found"
                />
            </motion.div>
        </div>
    );
}

export default AdminDeveloperPage;