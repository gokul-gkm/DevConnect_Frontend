import { useParams } from 'react-router-dom';
import { Loader2, Mail, Phone, Github, Linkedin, Globe, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { useDevDetails } from '@/hooks/admin/useDevDetails';

export default function DevDetails() {
    const { id } = useParams();
    const { developerData, isLoading, error, toggleStatus, isUpdating } = useDevDetails(id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (error || !developerData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-slate-400">Failed to load developer details</p>
            </div>
        );
    }

    const { developer } = developerData;

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
                                    src={developer.userId.profilePicture || "https://i.imghippo.com/files/GFY5894omo.jpg"}
                                    alt={developer.userId.username}
                                    className="w-32 h-32 rounded-2xl border-4 border-slate-900 shadow-xl object-cover"
                                />
                                <Badge
                                    className={`absolute -top-3 -right-3 ${
                                        developer.status === 'approved' 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : developer.status === 'rejected'
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    }`}
                                >
                                    {developer.status.charAt(0).toUpperCase() + developer.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                                            {developer.userId.username}
                                        </h1>
                                        <p className="text-slate-400 mt-1">{developer.workingExperience.jobTitle}</p>
                                    </div>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => toggleStatus(developer.userId._id)}
                                        disabled={isUpdating}
                                        className="bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-6"
                                    >
                                        {developer.userId.status === 'blocked' ? 'Unblock' : 'Block'}
                                    </Button>
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Mail className="w-4 h-4" />
                                        <span>{developer.userId.email}</span>
                                    </div>
                                    {developer.userId.contact && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone className="w-4 h-4" />
                                            <span>{developer.userId.contact}</span>
                                        </div>
                                    )}
                                </div>

                                {developer.userId.socialLinks && (
                                    <div className="flex gap-3 mt-4">
                                        {developer.userId.socialLinks.github && (
                                            <a 
                                                href={developer.userId.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-slate-200 transition-colors"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.linkedIn && (
                                            <a 
                                                href={developer.userId.socialLinks.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-slate-200 transition-colors"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.twitter && (
                                            <a 
                                                href={developer.userId.socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-slate-200 transition-colors"
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.portfolio && (
                                            <a 
                                                href={developer.userId.socialLinks.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-slate-200 transition-colors"
                                            >
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                    >
                        <p className="text-sm text-slate-400">Total Sessions</p>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            {developer.totalSessions || 0}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                    >
                        <p className="text-sm text-slate-400">Hourly Rate</p>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            ${developer.hourlyRate}/hr
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                    >
                        <p className="text-sm text-slate-400">Rating</p>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            {developer.rating || 0}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">About</h3>
                            <p className="text-slate-400 whitespace-pre-wrap">
                                {developer.userId.bio || 'No bio provided'}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Professional Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-400">Current Position</p>
                                    <p className="text-slate-200">{developer.workingExperience.jobTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Company</p>
                                    <p className="text-slate-200">{developer.workingExperience.companyName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Experience</p>
                                    <p className="text-slate-200">{developer.workingExperience.experience} years</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {developer.expertise.map((skill: string) => (
                                    <Badge
                                        key={skill}
                                        className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Languages</h3>
                            <div className="flex flex-wrap gap-2">
                                {developer.languages.map((language: string) => (
                                    <Badge
                                        key={language}
                                        className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                                    >
                                        {language}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Available Schedule</h3>
                            <div className="flex flex-wrap gap-2">
                                {developer.schedule.length > 0 ? (
                                    developer.schedule.map((time: any, index: any) => (
                                        <Badge
                                            key={index}
                                            className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                                        >
                                            {time}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400">No schedule set</p>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-6"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Resume</h3>
                            <a 
                                href={developer.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <Button 
                                    variant="outline"
                                    className="bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800"
                                >
                                    View Resume
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}