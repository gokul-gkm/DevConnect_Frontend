import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    description: string;
    coverImage: string;
    projectLink: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.coverImage} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
            <span className="text-sm text-purple-400">{project.category}</span>
          </div>
          {project.projectLink && (
            <motion.a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          )}
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 