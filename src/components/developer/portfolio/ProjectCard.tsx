import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';
import { useDeleteProject } from '@/hooks/projects/useDeleteProject';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
    project: {
        _id: string;
        title: string;
        category: string;
        description: string;
        projectLink?: string;
        coverImage?: string;
    };
    index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

    const handleDelete = () => {
        deleteProject(project._id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
            }
        });
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                className="flex flex-col md:flex-row items-center w-full md:w-[75vw] max-w-[650px] px-10 md:px-12 py-11 bg-[#121212] rounded-[24px] text-[#fdfcfd] font-['Poppins'] mx-auto mb-8 md:mb-12 max-[600px]:mb-16 max-[440px]:mb-20"
            >
                <motion.img
                    src={project.coverImage || '/placeholder-project.jpg'}
                    alt={project.title}
                    className="max-w-[280px] w-[50vw] h-[250px] sm:h-[300px] object-cover 
                            md:ml-[-78px] md:mr-[30px] rounded-[24px] md:rounded-[24px]
                            shadow-[0_60px_40px_rgba(0,0,0,0.08)]
                            md:w-[36vw]
                            max-[440px]:w-[50vw] max-[440px]:h-[50vw] max-[440px]:rounded-full max-[440px]:border-[12px] max-[440px]:border-[#272524] max-[440px]:shadow-none max-[440px]:mt-[-140px] max-[440px]:mb-[20px]
                            max-[600px]:mt-[-100px] max-[600px]:mb-[20px] max-[600px]:mx-0 max-[600px]:w-full max-[600px]:max-w-[1000px]"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.4 }
                    }}
                />

                <div className="flex-1 max-[600px]:text-center">
                    <motion.div 
                        className="flex items-center gap-3 mb-2 sm:mb-3 max-[600px]:justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-medium 
                                     bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
                                     text-indigo-400 border border-indigo-500/20
                                     hover:border-indigo-500/40 transition-colors duration-300"
                        >
                            {project.category}
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-[22px] font-normal mt-1 md:mr-[30px] mb-[10px] max-[600px]:mr-0 max-[600px]:text-[26px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {project.title}
                    </motion.h2>

                    <motion.p
                        className="text-[13px] font-normal mb-[24px] opacity-50 max-[600px]:max-w-[360px] max-[600px]:mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        {project.description}
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-4 max-[600px]:justify-center max-[600px]:gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <motion.button
                            className="border-0 bg-transparent text-[#f8f8f8] p-0"
                            onClick={() => navigate(`/developer/portfolio/projects/edit/${project._id}`)}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <motion.div
                                className="border-4 border-[#272524] bg-[#3f3b39] flex items-center justify-center text-[24px] w-[50px] h-[50px] rounded-[40px]"
                            >
                                <Pencil className="h-5 w-5 text-white" />
                            </motion.div>
                        </motion.button>

                        <motion.button
                            className="border-0 bg-transparent text-[#f8f8f8] p-0"
                            onClick={() => setShowDeleteDialog(true)}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <motion.div
                                className="border-4 border-[#272524] bg-[#3f3b39] flex items-center justify-center text-[24px] w-[50px] h-[50px] rounded-[40px]"
                            >
                                <Trash2 className="h-5 w-5 text-white" />
                            </motion.div>
                        </motion.button>

                        {project.projectLink && (
                            <motion.a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-0 bg-transparent text-[#f8f8f8] p-0"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <motion.div
                                    className="border-4 border-[#272524] bg-[#3f3b39] flex items-center justify-center text-[24px] w-[50px] h-[50px] rounded-[40px]"
                                >
                                    <ExternalLink className="h-5 w-5 text-white" />
                                </motion.div>
                            </motion.a>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                isDeleting={isDeleting}
                projectTitle={project.title}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};

export default ProjectCard;