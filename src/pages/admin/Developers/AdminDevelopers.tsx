import { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import DevelopersTable from '@/components/admin/developer/DeveloperTable';
import { Code2, Mail, Search, Shield, UserPlus } from 'lucide-react';
import { useAdminDevelopers } from '@/hooks/admin/useAdminDevelopers';

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
                    <div className="text-slate-400 animate-pulse">Loading developers...</div>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { title: "Total Developers", value: pagination?.total || 0, icon: Code2, color: "from-blue-600/20 to-blue-800/20", borderColor: "border-blue-500/20" },
                        { title: "Active Developers", value: developers.filter((d: any) => d.userId.status === 'active').length, icon: Shield, color: "from-green-600/20 to-green-800/20", borderColor: "border-green-500/20" },
                        { title: "Verified Developers", value: developers.filter((d: any) => d.userId.isVerified).length, icon: Mail, color: "from-purple-600/20 to-purple-800/20", borderColor: "border-purple-500/20" },
                        { title: "Developer Requests", value: '', icon: UserPlus, color: "from-amber-600/20 to-amber-800/20", borderColor: "border-amber-500/20", onClick: () => navigate('/admin/developers/requests') }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 border ${stat.borderColor} shadow-xl backdrop-blur-sm ${stat.onClick ? 'cursor-pointer' : ''}`}
                            onClick={stat.onClick}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-slate-400 text-sm font-medium">{stat.title}</div>
                                    <div className="text-3xl font-bold text-slate-100 mt-1">{stat.value?.toLocaleString()}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <stat.icon className="h-5 w-5 text-slate-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <DevelopersTable 
                    developers={developers}
                    pagination={pagination}
                    queryParams={queryParams}
                    onSort={handleSort}
                    onToggleStatus={(developerId: string) => toggleStatusMutation.mutate(developerId)}
                    onViewDetails={handleViewDetails}
                    updateParams={updateParams}
                />
            </motion.div>
        </div>
    );
}

export default AdminDeveloperPage;