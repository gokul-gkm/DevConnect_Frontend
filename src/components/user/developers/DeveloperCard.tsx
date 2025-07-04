import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface DeveloperCardProps {
    developer: {
        _id: string;
        username: string;
        title?: string;
        profilePicture?: string;
        socialLinks?: {
            github?: string;
            linkedin?: string;
            twitter?: string;
        };
    };
    index: number;
}

const DeveloperCard = ({ developer, index }: DeveloperCardProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-white/[0.05] to-transparent
                     border border-white/[0.05] rounded-2xl overflow-hidden
                     backdrop-blur-xl hover:border-indigo-500/20
                     transition-all duration-300"
        >
            <div className="p-6 flex flex-col items-center text-center">
            
                <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden
                                  border-2 border-indigo-500/20 group-hover:border-indigo-500/40
                                  transition-all duration-300">
                        <img
                            src={developer.profilePicture || '/default-avatar.png'}
                            alt={developer.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            
                <h3 className="text-lg font-semibold text-white mb-2 
                             group-hover:text-indigo-400 transition-colors">
                    {developer.username}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                    {developer.title || 'Software Developer'}
                </p>

          
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/dev-profile/${developer._id}`)}
                    className="w-full py-2 rounded-xl
                             bg-gradient-to-r from-indigo-500 to-purple-500
                             text-white text-sm font-medium
                             hover:from-indigo-600 hover:to-purple-600
                             transition-all duration-300"
                >
                    View Profile
                </motion.button>

                <div className="flex justify-center space-x-4 mt-4">
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
        </motion.div>
    );
};

export default DeveloperCard;