import { useParams } from 'react-router-dom';
import { Loader2, Mail, Phone, Github, Linkedin, Twitter, Globe, Calendar, Hash, Award, MapPin, Briefcase, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { useUserDetails } from '@/hooks/admin/useUserDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function UserDetails() {
    const { userId } = useParams();
    const { userData, isLoading, error, toggleStatus, isUpdating } = useUserDetails(userId);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <LoadingSpinner
                size="lg"
                text="Loading user details..."
                color="indigo"
                fullScreen={true}
            />
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="bg-slate-900/70 p-8 rounded-xl border border-red-500/20 backdrop-blur-md shadow-lg">
                    <p className="text-red-400 text-lg font-semibold">Failed to load user details</p>
                    <p className="text-slate-400 mt-2">Please try again later or contact support</p>
                </div>
            </div>
        );
    }

    const { user } = userData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
            <motion.div
                key={userId}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
            
                <motion.div
                    variants={itemVariants}
                    className="bg-slate-900 rounded-2xl border border-slate-800/50 backdrop-blur-lg shadow-[0_10px_50px_-12px_rgba(59,130,246,0.15)] overflow-hidden"
                >
                    <div className="h-24 sm:h-28 bg-slate-900 relative overflow-hidden">
                    </div>
                    
                    <div className="px-5 sm:px-7 py-6 -mt-14 relative z-10">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 shadow-xl">
                                        <img
                                            src={user.profilePicture || "https://i.imghippo.com/files/CFSX4839hi.png"}
                                            alt={user.username}
                                            className="w-full h-full rounded-full border-2 border-slate-900 object-cover"
                                        />
                                    </div>
                                    <Badge
                                        className={`absolute -top-2 -right-2 shadow-md ${
                                            user.status === 'active' 
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                                                : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                                        }`}
                                    >
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 mt-4 md:mt-0">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                                            {user.username}
                                        </h1>
                                        <div className="mt-2 space-y-1.5">
                                            <p className="text-slate-400 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-blue-400" /> {user.email}
                                            </p>
                                        
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => toggleStatus(userId as string)}
                                        variant="destructive" 
                                        size="sm"
                                        disabled={isUpdating}
                                        className={`relative overflow-hidden mt-3 sm:mt-0 ${
                                            user.status === 'blocked' 
                                                ? 'bg-transparent border border-green-500/50 text-green-500 hover:bg-green-500/10' 
                                                : 'bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10'
                                        } rounded-full px-6 shadow-md transition-all duration-300`}
                                    >
                                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        {user.status === 'blocked' ? (
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4" /> Unblock User
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <ShieldAlert className="h-4 w-4" /> Block User
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                        variants={itemVariants}
                        className="md:col-span-2 space-y-6"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Hash className="h-5 w-5 text-blue-400" /> Bio
                            </h3>
                            <p className="text-slate-300 whitespace-pre-wrap">
                                {user.bio || 'No bio provided'}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-blue-400" /> Skills
                            </h3>
                            {user.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string) => (
                                        <Badge
                                            key={skill}
                                            className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition-colors duration-200 shadow-sm py-1.5"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400">No skills listed</p>
                            )}
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-400" /> Statistics
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <p className="text-sm text-slate-400 font-medium">Sessions Booked</p>
                                    <p className="text-xl font-semibold text-slate-100 mt-2">
                                        {0}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <p className="text-sm text-slate-400 font-medium">Member Since</p>
                                    <p className="text-base font-semibold text-slate-100 mt-2 flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-blue-400" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <p className="text-sm text-slate-400 font-medium">User ID</p>
                                    <p className="text-xs font-mono text-slate-300 mt-2 truncate">
                                        {userId}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-400" /> Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                {user.contact ? (
                                    <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
                                        <Phone className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm">{user.contact}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-400 bg-slate-800/30 p-3 rounded-xl opacity-70">
                                        <Phone className="w-5 h-5" />
                                        <span className="text-sm">No phone number provided</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm">{user.location || "No location provided"}</span>
                                </div>
                            </div>
                        </motion.div>

                        {user.socialLinks && Object.keys(user.socialLinks).length > 0 ? (
                            <motion.div
                                variants={itemVariants}
                                className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                            >
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-400" /> Social Links
                                </h3>
                                <div className="space-y-3">
                                    {user.socialLinks.github && (
                                        <a
                                            href={user.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1"
                                        >
                                            <Github className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm">GitHub Profile</span>
                                        </a>
                                    )}
                                    {user.socialLinks.linkedIn && (
                                        <a
                                            href={user.socialLinks.linkedIn}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1"
                                        >
                                            <Linkedin className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm">LinkedIn Profile</span>
                                        </a>
                                    )}
                                    {user.socialLinks.twitter && (
                                        <a
                                            href={user.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1"
                                        >
                                            <Twitter className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm">Twitter Profile</span>
                                        </a>
                                    )}
                                    {user.socialLinks.portfolio && (
                                        <a
                                            href={user.socialLinks.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1"
                                        >
                                            <Globe className="w-5 h-5 text-blue-400" />
                                            <span className="text-sm">Portfolio Website</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ) : null}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}