import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/shadcn-button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/projects/useProjects';
import { useState } from 'react';
import ProjectCard from '@/components/developer/portfolio/ProjectCard';
import ProjectPagination from '@/components/developer/portfolio/ProjectPagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PortfolioPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = useProjects(currentPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

     if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading portfolio..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

    return (
        <div className="min-h-screen bg-black p-4 sm:p-6 relative overflow-hidden">
        
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
           
            
            <div className="container mx-auto max-w-7xl relative">

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 sm:mb-16"
                >
                    <div className="flex flex-col items-center">
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400 mb-4"
                        >
                            Project Showcase
                        </motion.h1>
                    
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent w-full mb-8"
                        />
                        <div className="w-full flex justify-end px-4 sm:px-0">
                            <Button
                                className="group relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl 
                                         text-white font-medium transition-all duration-300
                                         bg-gradient-to-r from-indigo-600/20 to-purple-600/20
                                         hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]
                                         border border-indigo-500/20 hover:border-indigo-500/40"
                                onClick={()=> navigate('/developer/portfolio/add-project')}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    <span className="text-sm sm:text-base">Add New Project</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 
                                              translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                
                {isLoading && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                 
                )}


                {isError && (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <p className="text-red-400">Failed to load projects</p>
                    </div>
                )}

                {data && data.projects.length > 0 && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="space-y-6 sm:space-y-8">
                            <AnimatePresence mode="wait">
                                {data.projects.map((project: any, index: any) => (
                                    <ProjectCard 
                                        key={project._id} 
                                        project={project} 
                                        index={index} 
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {data.pagination && data.pagination.totalPages > 1 && (
                            <ProjectPagination
                                currentPage={currentPage}
                                totalPages={data.pagination.totalPages}
                                hasNextPage={data.pagination.hasNextPage}
                                hasPrevPage={data.pagination.hasPrevPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                )}

                {data && data.projects.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <p className="text-white/60 text-lg mb-4">No projects found</p>
                            <p className="text-white/40 mb-6">Start building your portfolio by adding your first project</p>
                            <Button
                                onClick={() => navigate('/developer/portfolio/add-project')}
                                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 
                                         hover:from-indigo-500/30 hover:to-purple-500/30
                                         text-white border border-white/10 rounded-xl"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Project
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioPage;