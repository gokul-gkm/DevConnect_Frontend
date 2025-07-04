import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, ArrowUpDown, Eye, CheckCircle, XCircle, Mail } from 'lucide-react';
import { useDevRequests } from '@/hooks/admin/useDevRequests';
import { ColumnDef } from '@tanstack/react-table';
import AdminTable from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RejectDialog from '@/components/admin/RejectDialog';

export default function DevRequests() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');
    const [rejectionReason, setRejectionReason] = useState('');

    const {
        developers,
        pagination,
        isLoading,
        queryParams,
        updateParams,
        approveDeveloper,
        rejectDeveloper,
        isApproving,
        isRejecting
    } = useDevRequests();

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
        navigate(`/admin/developer-requests/${developerId}`);
    };

    const handleReject = (developerId: string) => {
        setSelectedDeveloperId(developerId);
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = () => {
        if (selectedDeveloperId && rejectionReason.trim()) {
            rejectDeveloper({ developerId: selectedDeveloperId, reason: rejectionReason });
            setRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedDeveloperId('');
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'username',
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() => handleSort('username')}
                    className="text-slate-400 hover:text-slate-100"
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-lg ring-1 ring-slate-700/50">
                        {row.original.userId.profilePicture ? (
                            <img
                                src={row.original.userId.profilePicture}
                                alt={row.original.userId.username}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <Users className="h-5 w-5 text-slate-300" />
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-slate-100">
                            {row.original.userId.username}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() => handleSort('email')}
                    className="text-slate-400 hover:text-slate-100"
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(row.original._id)}
                        className="bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800 rounded-xl"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveDeveloper(row.original._id)}
                        disabled={isApproving}
                        className="bg-emerald-950/50 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50 rounded-xl"
                    >
                        <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(row.original._id)}
                        disabled={isRejecting}
                        className="bg-red-950/50 text-red-400 border-red-800/50 hover:bg-red-900/50 rounded-xl"
                    >
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [
        approveDeveloper, 
        handleReject, 
        handleViewDetails, 
        isApproving, 
        isRejecting
    ]);

    if (isLoading) {
        return (
            <LoadingSpinner
                size="lg"
                text="Loading requests..."
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
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Developer Requests</h1>
                        <p className="text-slate-400 mt-1">Review and manage developer applications</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-200" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchText}
                            onChange={handleSearchInput}
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-lg"
                        />
                    </div>
                </motion.div>

                <AdminTable
                    data={developers}
                    columns={columns}
                    pagination={pagination}
                    updateParams={updateParams}
                    emptyMessage="No developer requests found"
                />
            </motion.div>

            <RejectDialog
                isOpen={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                reason={rejectionReason}
                onReasonChange={(value) => setRejectionReason(value)}
                onReject={handleRejectConfirm}
                title="Reject Developer Request"
                entityName="Developer"
            />
        </div>
    );
}