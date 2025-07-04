import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Twitter, DollarSign, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeveloperCardProps {
    developer: {
        _id: string;
        username: string;
        email: string;
        title?: string;
        profilePicture?: string;
        socialLinks?: {
            github?: string;
            linkedin?: string;
            twitter?: string;
        };
        developerProfile?: {
            bio?: string;
            hourlyRate?: number;
            languages?: string[];
            skills?: string[];
            title?: string;
        };
    };
    index: number;
}

const DeveloperCard = ({ developer, index }: DeveloperCardProps) => {
    const navigate = useNavigate();
    
    const skills = developer.developerProfile?.skills || [];
    const displaySkills = skills.slice(0, 3);
    const remainingSkills = skills.length > 3 ? skills.length - 3 : 0;
    
    const title = developer.title || developer.developerProfile?.title || 'Software Developer';
    const hourlyRate = developer.developerProfile?.hourlyRate;
    const hasLanguage = developer.developerProfile?.languages && developer.developerProfile.languages.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className={cn(
                "group relative overflow-hidden",
                "bg-gradient-to-br from-white/[0.05] to-transparent",
                "border border-white/[0.05] hover:border-indigo-500/20",
                "rounded-xl sm:rounded-2xl",
                "transition-all duration-300",
                "backdrop-blur-xl",
                "h-[320px] sm:h-[360px]",
                "flex flex-col"
            )}
        >
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-indigo-600/20 to-transparent"></div>
            
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="relative flex items-start justify-between z-10 mb-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden
                                      border-2 border-white/20 group-hover:border-indigo-500/40
                                      transition-all duration-300 bg-black/20">
                            <img
                                src={developer.profilePicture || '/default-avatar.png'}
                                alt={developer.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 items-end">
                        {hourlyRate && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-xs font-medium text-indigo-400">{hourlyRate}/hr</span>
                            </div>
                        )}
                        
                        {hasLanguage && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-950 to-black shadow-xl border border-blue-950">
                                <span className="text-xs font-medium text-white">{developer.developerProfile?.languages?.[0]}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-base sm:text-lg font-semibold text-white
                                            group-hover:text-indigo-400 transition-colors truncate">
                                    {developer.username}
                                </h3>
                                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent text-xs sm:text-sm truncate">
                                    {title}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                        <Mail className="w-3.5 h-3.5 text-white/30 mr-1.5 flex-shrink-0" />
                        <span className="text-white/50 text-xs truncate">{developer.email}</span>
                    </div>
                    
                    <div className="mb-auto">
                        {displaySkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {displaySkills.map((skill) => (
                                    <span 
                                        key={skill} 
                                        className="px-2 py-1 rounded-full text-xs
                                                bg-indigo-500/10 text-indigo-400
                                                border border-indigo-500/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {remainingSkills > 0 && (
                                    <span className="px-2 py-1 rounded-full text-xs
                                                bg-white/10 text-white/60
                                                border border-white/10">
                                        +{remainingSkills} more
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-3 mt-4 border-t border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/dev-profile/${developer._id}`)}
                                className="flex-1 py-2 rounded-xl
                                        bg-gradient-to-r from-blue-950 to-blue-800
                                        text-white text-xs sm:text-sm font-medium
                                        hover:from-blue-800 hover:to-blue-600
                                        transition-all duration-300
                                        shadow-md shadow-blue-900/20"
                            >
                                View Profile
                            </motion.button>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                            {developer.socialLinks?.github && (
                                <a
                                    href={developer.socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {developer.socialLinks?.linkedin && (
                                <a
                                    href={developer.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                            {developer.socialLinks?.twitter && (
                                <a
                                    href={developer.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <Twitter className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DeveloperCard;