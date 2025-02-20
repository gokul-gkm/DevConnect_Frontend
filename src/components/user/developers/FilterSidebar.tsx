import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        skills: string[];
        experience: string;
        availability: string;
        location: string;
    };
    onFilterChange: (filters: FilterSidebarProps['filters']) => void;
}

const FilterSidebar = ({
    isOpen,
    onClose,
    filters,
    onFilterChange
}: FilterSidebarProps) => {
    const skillOptions = [
        'JavaScript', 'TypeScript', 'React', 'Node.js',
        'Python', 'Java', 'C++', 'Ruby', 'PHP',
        'AWS', 'Docker', 'Kubernetes', 'MongoDB'
    ];

    const experienceOptions = [
        'Entry Level (0-2 years)',
        'Mid Level (2-5 years)',
        'Senior (5-8 years)',
        'Lead (8+ years)'
    ];

    const availabilityOptions = [
        'Full Time',
        'Part Time',
        'Contract',
        'Freelance'
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md
                                 bg-black/95 border-l border-white/10
                                 backdrop-blur-xl z-50
                                 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-white">Filters</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="text-white/60 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-medium mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skillOptions.map((skill) => (
                                        <button
                                            key={skill}
                                            onClick={() => {
                                                const newSkills = filters.skills.includes(skill)
                                                    ? filters.skills.filter(s => s !== skill)
                                                    : [...filters.skills, skill];
                                                onFilterChange({ ...filters, skills: newSkills });
                                            }}
                                            className={`px-3 py-1 rounded-full text-sm
                                                      transition-all duration-300
                                                      ${filters.skills.includes(skill)
                                                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                                                        : 'bg-white/5 text-white/60 border-white/10'
                                                      } border`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-medium mb-3">Experience Level</h3>
                                <div className="space-y-2">
                                    {experienceOptions.map((exp) => (
                                        <button
                                            key={exp}
                                            onClick={() => onFilterChange({
                                                ...filters,
                                                experience: filters.experience === exp ? '' : exp
                                            })}
                                            className={`w-full px-4 py-2 rounded-lg text-left
                                                      transition-all duration-300
                                                      ${filters.experience === exp
                                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                                                        : 'bg-white/5 text-white/60 border-white/10'
                                                      } border`}
                                        >
                                            {exp}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-medium mb-3">Availability</h3>
                                <div className="space-y-2">
                                    {availabilityOptions.map((availability) => (
                                        <button
                                            key={availability}
                                            onClick={() => onFilterChange({
                                                ...filters,
                                                availability: filters.availability === availability ? '' : availability
                                            })}
                                            className={`w-full px-4 py-2 rounded-lg text-left
                                                      transition-all duration-300
                                                      ${filters.availability === availability
                                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                                        : 'bg-white/5 text-white/60 border-white/10'
                                                      } border`}
                                        >
                                            {availability}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-white font-medium mb-3">Location</h3>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => onFilterChange({
                                        ...filters,
                                        location: e.target.value
                                    })}
                                    placeholder="Enter location..."
                                    className="w-full px-4 py-2 rounded-lg
                                             bg-white/5 border border-white/10
                                             text-white placeholder:text-white/50
                                             focus:outline-none focus:border-indigo-500/50"
                                />
                            </div>

                            <Button
                                onClick={() => onFilterChange({
                                    skills: [],
                                    experience: '',
                                    availability: '',
                                    location: ''
                                })}
                                variant="outline"
                                className="w-full bg-white/5 border-white/10 text-white
                                         hover:bg-white/10"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;