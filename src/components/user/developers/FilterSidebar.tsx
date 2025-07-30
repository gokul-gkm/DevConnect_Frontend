import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { PriceRangeFilter } from './PriceRangeFilter';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        skills: string[];
        languages: string[];
        priceRange: {
            min: number;
            max: number;
        };
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

    const languageOptions = [
        'English', 'Spanish', 'French', 'German',
        'Chinese', 'Japanese', 'Korean', 'Hindi',
        'Arabic', 'Portuguese'
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

                            <div className="space-y-6">
                                <div>
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

                                <div>
                                    <h3 className="text-white font-medium mb-3">Languages</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {languageOptions.map((language) => (
                                            <button
                                                key={language}
                                                onClick={() => {
                                                    const newLanguages = filters.languages.includes(language)
                                                        ? filters.languages.filter(l => l !== language)
                                                        : [...filters.languages, language];
                                                    onFilterChange({ ...filters, languages: newLanguages });
                                                }}
                                                className={`px-3 py-1 rounded-full text-sm
                                                      transition-all duration-300
                                                      ${filters.languages.includes(language)
                                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                                                        : 'bg-white/5 text-white/60 border-white/10'
                                                    } border`}
                                            >
                                                {language}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <PriceRangeFilter
                                    onChange={(range) => onFilterChange({ ...filters, priceRange: range })}
                                />

                                <div>
                                    <h3 className="text-white font-medium mb-3">Location</h3>
                                    <input
                                        type="text"
                                        value={filters.location}
                                        onChange={(e) => onFilterChange({
                                            ...filters,
                                            location: e.target.value
                                        })}
                                        placeholder="Enter location..."
                                        className="w-full px-4 py-2 rounded-xl
                                             bg-white/5 border border-white/10
                                             text-white placeholder:text-white/50
                                             focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>

                                <Button
                                    onClick={() => onFilterChange({
                                        skills: [],
                                        languages: [],
                                        priceRange: { min: 0, max: 200 },
                                        location: ''
                                    })}
                                    variant="outline"
                                    className="w-full bg-white/5 border-white/10 text-white
                                         hover:bg-white/10 rounded-xl"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;