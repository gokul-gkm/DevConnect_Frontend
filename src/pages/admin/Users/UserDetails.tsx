import { useParams } from 'react-router-dom';
import { Loader2, Mail, Phone, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/admin/useUserDetails';  

export default function UserDetails() {
    const { userId } = useParams();
    const { userData, isLoading, error, toggleStatus, isUpdating } = useUserDetails(userId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-slate-400">Failed to load user details</p>
            </div>
        );
    }

    const { user } = userData;

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl overflow-hidden"
                >
                    <div className="h-48 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                    
                    <div className="p-6 -mt-20">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="relative">
                                <img
                                    src={user.profilePicture || "https://i.imghippo.com/files/CFSX4839hi.png"}
                                    alt={user.username}
                                    className="w-32 h-32 rounded-2xl border-4 border-slate-900 shadow-xl object-cover"
                                />
                                <Badge
                                    className={`absolute -top-3 -right-3 ${
                                        user.status === 'active' 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}
                                >
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                                            {user.username}
                                        </h1>
                                        <p className="text-slate-400 mt-1">{user.email}</p>
                                    </div>
                                    <Button 
                                        onClick={() => toggleStatus(userId as string)}
                                        variant="destructive" 
                                        size="sm"
                                        disabled={isUpdating}
                                        className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-6"
                                    >
                                        {user.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Bio</h3>
                            <p className="text-slate-300 whitespace-pre-wrap">
                                {user.bio || 'No bio provided'}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                                {user.contact && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{user.contact}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {user.skills && (user.skills.length > 0 ) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                            >
                                <h3 className="text-lg font-semibold text-slate-100 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string) => (
                                        <Badge
                                            key={skill}
                                            className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                            >
                                <h3 className="text-lg font-semibold text-slate-100 mb-4">Social Links</h3>
                                <div className="flex flex-wrap gap-4">
                                    {user.socialLinks.github && (
                                        <a
                                            href={user.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            <Github className="w-5 h-5" />
                                            <span>GitHub</span>
                                        </a>
                                    )}
                                    {user.socialLinks.linkedIn && (
                                        <a
                                            href={user.socialLinks.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                            <span>LinkedIn</span>
                                        </a>
                                    )}
                                    {user.socialLinks.twitter && (
                                        <a
                                            href={user.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            <Twitter className="w-5 h-5" />
                                            <span>Twitter</span>
                                        </a>
                                    )}
                                    {user.socialLinks.portfolio && (
                                        <a
                                            href={user.socialLinks.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
                                        >
                                            <Globe className="w-5 h-5" />
                                            <span>Portfolio</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-400">Sessions Booked</p>
                                    <p className="text-xl font-semibold text-slate-100 mt-1">
                                        {0}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-400">Member Since</p>
                                    <p className="text-sm font-semibold text-slate-100 mt-1">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}