import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, ArrowUpDown, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useDevRequests } from '@/hooks/admin/useDevRequests';

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

    const handlePageChange = (page: number) => {
        updateParams({ page });
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                    <div className="text-slate-400 animate-pulse">Loading requests...</div>
                </motion.div>
            </div>
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl border border-slate-800/50 bg-slate-900/50 shadow-2xl backdrop-blur-sm overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800/50">
                                    <TableHead className="text-slate-400">Developer</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('expertise')}
                                            className="text-slate-400 hover:text-slate-100"
                                        >
                                            Expertise
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('experience')}
                                            className="text-slate-400 hover:text-slate-100"
                                        >
                                            Experience
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('hourlyRate')}
                                            className="text-slate-400 hover:text-slate-100"
                                        >
                                            Hourly Rate
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {developers.map((developer: any) => (
                                    <TableRow key={developer._id} className="border-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-lg ring-1 ring-slate-700/50">
                                                    {developer.userId.profilePicture ? (
                                                        <img
                                                            src={developer.userId.profilePicture}
                                                            alt={developer.userId.username}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-100">
                                                        {developer.userId.username}
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        {developer.userId.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {developer.expertise.slice(0, 2).map((skill: string) => (
                                                    <Badge
                                                        key={skill}
                                                        className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {developer.expertise.length > 2 && (
                                                    <Badge variant="outline">
                                                        +{developer.expertise.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {developer.workingExperience.experience} years
                                        </TableCell>
                                        <TableCell>${developer.hourlyRate}/hr</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(developer._id)}
                                                    className="bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800 rounded-xl"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => approveDeveloper(developer._id)}
                                                    disabled={isApproving}
                                                    className="bg-emerald-950/50 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50 rounded-xl"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReject(developer._id)}
                                                    disabled={isRejecting}
                                                    className="bg-red-950/50 text-red-400 border-red-800/50 hover:bg-red-900/50 rounded-xl"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {pagination && (
                        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-800/50">
                            <div className="text-sm text-slate-400">
                                Showing {((queryParams.page - 1) * queryParams.limit) + 1} to {Math.min(queryParams.page * queryParams.limit, pagination.total)} of {pagination.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                    onClick={() => handlePageChange(1)}
                                    disabled={queryParams.page === 1}
                                >
                                    <ChevronsLeft className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                    onClick={() => handlePageChange(queryParams.page - 1)}
                                    disabled={queryParams.page === 1}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-400">
                                    Page {queryParams.page} of {pagination.totalPages}
                                </span>
                                <button
                                    className="p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                    onClick={() => handlePageChange(queryParams.page + 1)}
                                    disabled={queryParams.page === pagination.totalPages}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-1 hover:bg-white/5 rounded disabled:opacity-50"
                                    onClick={() => handlePageChange(pagination.totalPages)}
                                    disabled={queryParams.page === pagination.totalPages}
                                >
                                    <ChevronsRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Developer Request</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this developer request.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={!rejectionReason.trim()}
                        >
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}