import { useParams } from 'react-router-dom';
import { Loader2, Mail, Phone, Github, Linkedin, Globe, Twitter, Calendar, Award, Code, Briefcase, ShieldAlert, ShieldCheck, FileText, Building, Star, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/shadcn-button';
import { Badge } from '@/components/ui/badge';
import { useDevDetails } from '@/hooks/admin/useDevDetails';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DevDetails() {
    const { id } = useParams();
    const { developerData, isLoading, error, toggleStatus, isUpdating } = useDevDetails(id);

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
            text="Loading developer details..."
            color="indigo"
            fullScreen={true}
          />
        );
    }

    if (error || !developerData) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="bg-slate-900/70 p-8 rounded-xl border border-red-500/20 backdrop-blur-md shadow-lg">
                    <p className="text-red-400 text-lg font-semibold">Failed to load developer details</p>
                    <p className="text-slate-400 mt-2">Please try again later or contact support</p>
                </div>
            </div>
        );
    }

    const { developer } = developerData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
            <motion.div
                key={id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-slate-900 rounded-2xl border border-slate-800/50 backdrop-blur-lg shadow-[0_10px_50px_-12px_rgba(59,130,246,0.15)] overflow-hidden"
                >
                    <div className="h-28 sm:h-32 bg-slate-900 relative overflow-hidden">
                    </div>
                    
                    <div className="px-5 sm:px-7 py-6 -mt-16 relative z-10">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 shadow-xl">
                                        <img
                                            src={developer.userId.profilePicture || "https://i.imghippo.com/files/GFY5894omo.jpg"}
                                            alt={developer.userId.username}
                                            className="w-full h-full rounded-full border-2 border-slate-900 object-cover"
                                        />
                                    </div>
                                    <Badge
                                        className={`absolute -top-2 -right-2 shadow-md ${
                                            developer.status === 'approved' 
                                                ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                                                : developer.status === 'rejected'
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
                                        }`}
                                    >
                                        {developer.status.charAt(0).toUpperCase() + developer.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 mt-4 md:mt-0">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
                                            {developer.userId.username}
                                        </h1>
                                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-blue-400" /> {developer.workingExperience.jobTitle}
                                        </p>
                                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-400" /> {developer.userId.email}
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => toggleStatus(developer.userId._id)}
                                        variant="destructive" 
                                        size="sm"
                                        disabled={isUpdating}
                                        className={`relative overflow-hidden mt-3 sm:mt-0 ${
                                            developer.userId.status === 'blocked' 
                                                ? 'bg-transparent border border-green-500/50 text-green-500 hover:bg-green-500/10' 
                                                : 'bg-transparent border border-red-500/50 text-red-500 hover:bg-red-500/10'
                                        } rounded-full px-6 shadow-md transition-all duration-300`}
                                    >
                                        {isUpdating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        {developer.userId.status === 'blocked' ? (
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4" /> Unblock Developer
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <ShieldAlert className="h-4 w-4" /> Block Developer
                                            </span>
                                        )}
                                    </Button>
                                </div>
                                
                                {developer.userId.socialLinks && (
                                    <div className="flex gap-3 mt-4">
                                        {developer.userId.socialLinks.github && (
                                            <a 
                                                href={developer.userId.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-blue-400 transition-colors p-2 bg-slate-800/30 rounded-full"
                                            >
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.linkedIn && (
                                            <a 
                                                href={developer.userId.socialLinks.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-blue-400 transition-colors p-2 bg-slate-800/30 rounded-full"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.twitter && (
                                            <a 
                                                href={developer.userId.socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-blue-400 transition-colors p-2 bg-slate-800/30 rounded-full"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {developer.userId.socialLinks.portfolio && (
                                            <a 
                                                href={developer.userId.socialLinks.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-blue-400 transition-colors p-2 bg-slate-800/30 rounded-full"
                                            >
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
                >
                    <div className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-5 backdrop-blur-lg shadow-lg hover:bg-slate-900/80 transition-colors duration-200">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-slate-400 font-medium">Total Sessions</p>
                            <Calendar className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            {developer.totalSessions || 0}
                        </p>
                    </div>
                    <div className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-5 backdrop-blur-lg shadow-lg hover:bg-slate-900/80 transition-colors duration-200">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-slate-400 font-medium">Hourly Rate</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            ${developer.hourlyRate}/hr
                        </p>
                    </div>
                    <div className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-5 backdrop-blur-lg shadow-lg hover:bg-slate-900/80 transition-colors duration-200">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-slate-400 font-medium">Rating</p>
                            <Star className="h-5 w-5 text-blue-400" />
                        </div>
                        <p className="text-2xl font-semibold text-slate-100 mt-2">
                            {developer.rating || 0}
                        </p>
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
                                <Award className="h-5 w-5 text-blue-400" /> About
                            </h3>
                            <p className="text-slate-300 whitespace-pre-wrap">
                                {developer.userId.bio || 'No bio provided'}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-400" /> Professional Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <Building className="h-5 w-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Current Position</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.workingExperience.jobTitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <Building className="h-5 w-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Company</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.workingExperience.companyName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Experience</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.workingExperience.experience} years</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-blue-400" /> Education
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="h-5 w-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Degree</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.education.degree}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                                            <path d="M12 11h4"></path>
                                            <path d="M12 16h4"></path>
                                            <path d="M8 11h.01"></path>
                                            <path d="M8 16h.01"></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Institution</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.education.institution}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800/70 transition-colors duration-200 shadow-md">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Graduation Year</p>
                                            <p className="text-slate-100 font-medium mt-1">{developer.education.year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Code className="h-5 w-5 text-blue-400" /> Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {developer.expertise.map((skill: string) => (
                                    <Badge
                                        key={skill}
                                        className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition-colors duration-200 shadow-sm py-1.5"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-400" /> Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {developer.languages.map((language: string) => (
                                    <Badge
                                        key={language}
                                        className="bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 transition-colors duration-200 shadow-sm py-1.5"
                                    >
                                        {language}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-400" /> Resume
                            </h3>
                            <a 
                                href={developer.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/60 transition-colors duration-200 rounded-xl p-3 text-slate-300"
                            >
                                <FileText className="h-5 w-5 text-blue-400" />
                                <span className="text-sm font-medium">View Developer's Resume</span>
                            </a>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-6 backdrop-blur-lg shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-400" /> Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm">{developer.userId.email}</span>
                                </div>
                                {developer.userId.contact ? (
                                    <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors duration-200">
                                        <Phone className="w-5 h-5 text-blue-400" />
                                        <span className="text-sm">{developer.userId.contact}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-slate-400 bg-slate-800/30 p-3 rounded-xl opacity-70">
                                        <Phone className="w-5 h-5" />
                                        <span className="text-sm">No phone number provided</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}