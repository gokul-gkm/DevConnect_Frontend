import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/shadcn-button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, Search, Users, Check, X, Clock, Eye } from 'lucide-react';
import { motion } from "framer-motion";
import { useDevelopers } from '@/hooks/useDevelopers';
import { debounce } from 'lodash';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import AdminApi from '@/service/Api/AdminApi';
import { useNavigate } from 'react-router-dom';

export function DeveloperRequestsPage() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const navigate = useNavigate();

    const { developers, pagination, isLoading, queryParams, updateParams, refetch } = useDevelopers({
        status: 'pending'
    });

    const handleSearch = debounce((search: string) => {
        setSearchQuery(search);
        updateParams({ search, page: 1 });
    }, 500);

    const handleViewDetails = (developerId: string) => {
        navigate(`/admin/developer-requests/${developerId}`);
    };

    const handleApprove = async (developerId: string) => {
        try {
            await AdminApi.approveDeveloperRequest(developerId);
            toast.success('Developer request approved successfully');
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to approve request');
        }
    };

    const handleReject = async () => {
        if (!selectedDeveloper || !rejectionReason) return;

        try {
            await AdminApi.rejectDeveloperRequest(selectedDeveloper._id, rejectionReason);
            toast.success('Developer request rejected successfully');
            setIsRejectDialogOpen(false);
            setRejectionReason('');
            setSelectedDeveloper(null);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        }
    };

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            accessorKey: 'userId.username',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-400 hover:text-slate-100"
                >
                    Developer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-800 to-indigo-700 flex items-center justify-center shadow-lg ring-1 ring-indigo-700/50">
                        {row.original.userId.profilePicture ? 
                            <img 
                                src={row.original.userId.profilePicture} 
                                alt={row.original.userId.username}
                                className="h-10 w-10 rounded-full object-cover" 
                            /> : 
                            <Users className="h-5 w-5 text-slate-300" />
                        }
                    </div>
                    <div>
                        <div className="font-medium text-slate-100">{row.original.userId.username}</div>
                        <div className="text-xs text-slate-400">{row.original.userId.email}</div>
                    </div>
                </motion.div>
            ),
        },
        {
            accessorKey: 'expertise',
            header: 'Expertise',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.expertise.slice(0, 2).map((skill: string, index: number) => (
                        <Badge 
                            key={index}
                            variant="outline" 
                            className="bg-slate-800/50 text-slate-200 border-slate-700"
                        >
                            {skill}
                        </Badge>
                    ))}
                    {row.original.expertise.length > 2 && (
                        <Badge variant="outline" className="bg-slate-800/50 text-slate-200 border-slate-700">
                            +{row.original.expertise.length - 2}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'hourlyRate',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-400 hover:text-slate-100"
                >
                    Rate
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-slate-200">${row.original.hourlyRate}/hr</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-slate-400 hover:text-slate-100"
                >
                    Requested On
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-slate-400">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(row.original._id)}
                        className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-emerald-50 border-emerald-500/20"
                    >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSelectedDeveloper(row.original);
                            setIsRejectDialogOpen(true);
                        }}
                        className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-red-50 border-red-500/20"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Reject
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
    ], []);

    const table = useReactTable({
        data: developers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

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
                    className="grid gap-6 md:grid-cols-3"
                >
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Pending Requests</p>
                                <h3 className="text-2xl font-bold text-slate-100">{pagination?.total || 0}</h3>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            Developer Requests
                        </h1>
                        <p className="text-slate-400 mt-1">
                            Review and manage pending developer applications
                        </p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-200" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-lg"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-slate-800/50 bg-slate-900/50 shadow-2xl backdrop-blur-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="border-slate-800/50">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-slate-400 bg-slate-900/90"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-32 text-center text-slate-400"
                                        >
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                                <span className="ml-3">Loading requests...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-32 text-center text-slate-400"
                                        >
                                            No pending requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="border-slate-800/50 hover:bg-slate-800/50 transition-all duration-200"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {pagination && (
                        <div className="p-4 border-t border-slate-800/50">
                            <DataTablePagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={(page) => updateParams({ page })}
                                pageSize={queryParams.limit}
                                onPageSizeChange={(size) => updateParams({ limit: size, page: 1 })}
                            />
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="bg-slate-900 border border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Reject Developer Request</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Please provide a reason for rejecting this developer request.
                            This will be sent to the developer.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[100px] bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsRejectDialogOpen(false);
                                setRejectionReason('');
                                setSelectedDeveloper(null);
                            }}
                            className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Reject Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}