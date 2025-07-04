import { useState, useEffect } from 'react';
import { useSearchDevelopers } from '@/hooks/useSearchDevelopers';
import { Search, SlidersHorizontal, X, ArrowUpDown, Clock, SortAsc, SortDesc } from 'lucide-react';
import DeveloperCard from '@/components/user/developers/DeveloperCard';
import DeveloperCardSkeleton from '@/components/user/developers/DeveloperCardSkelton';
import FilterSidebar from '@/components/user/developers/FilterSidebar';
import Pagination from '@/components/user/developers/DeveloperSearchPagination';
import { Button } from '@/components/ui/shadcn-button';
import { useDebounce } from '@/hooks/useDebounce';

const SearchDevelopers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        skills: [] as string[],
        languages: [] as string[],
        priceRange: {
            min: 0,
            max: 1000
        },
        location: ''
    });
    const [sortBy, setSortBy] = useState('newest');

    const debouncedSearch = useDebounce(searchQuery, 300);

    const {
        data,
        isLoading,
        isError,
        error
    } = useSearchDevelopers({
        search: debouncedSearch,
        sort: sortBy,
        page: currentPage,
        limit: 8,
        ...filters
    });

  
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filters, sortBy]);

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const renderSkeletons = () => {
        return Array(8).fill(0).map((_, index) => (
            <DeveloperCardSkeleton key={index} />
        ));
    };

    if (isError) {
        return (
            <div className="min-h-screen bg-black/95 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-red-400 text-center">
                        Error loading developers: {(error as any)?.message || 'Something went wrong'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/95 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search developers, skills..."
                                className="w-full px-4 py-2.5 rounded-xl
                                         bg-white/5 border border-white/10
                                         text-white placeholder:text-white/50
                                         focus:outline-none focus:border-indigo-500/50
                                         backdrop-blur-xl"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-10 pr-12 py-2.5 rounded-xl
                                             bg-white/5 border border-white/10
                                             text-white
                                             focus:outline-none focus:border-indigo-500/50
                                             backdrop-blur-xl cursor-pointer
                                             min-w-[180px]"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name_asc">Name (A-Z)</option>
                                    <option value="name_desc">Name (Z-A)</option>
                                    <option value="price_low">Price (Low to High)</option>
                                    <option value="price_high">Price (High to Low)</option>
                                </select>
                                
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                    {sortBy === 'newest' && <Clock className="w-4 h-4" />}
                                    {sortBy === 'oldest' && <Clock className="w-4 h-4 rotate-180" />}
                                    {sortBy === 'name_asc' && <SortAsc className="w-4 h-4" />}
                                    {sortBy === 'name_desc' && <SortDesc className="w-4 h-4" />}
                                </div>
                                
                                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                            </div>

                            <Button
                                onClick={() => setIsFilterOpen(true)}
                                variant="outline"
                                className="flex items-center gap-2 bg-white/5 border-white/10 text-white"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {(filters.skills.length > 0 || filters.languages.length > 0 || filters.location) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {filters.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 rounded-full text-sm
                                             bg-indigo-500/10 text-indigo-400
                                             border border-indigo-500/20
                                             flex items-center gap-2"
                                >
                                    {skill}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-white"
                                        onClick={() => handleFilterChange({
                                            ...filters,
                                            skills: filters.skills.filter(s => s !== skill)
                                        })}
                                    />
                                </span>
                            ))}
                            {filters.languages.map((language) => (
                                <span
                                    key={language}
                                    className="px-3 py-1 rounded-full text-sm
                                             bg-purple-500/10 text-purple-400
                                             border border-purple-500/20
                                             flex items-center gap-2"
                                >
                                    {language}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-white"
                                        onClick={() => handleFilterChange({
                                            ...filters,
                                            languages: filters.languages.filter(l => l !== language)
                                        })}
                                    />
                                </span>
                            ))}
                            {filters.location && (
                                <span
                                    className="px-3 py-1 rounded-full text-sm
                                             bg-blue-500/10 text-blue-400
                                             border border-blue-500/20
                                             flex items-center gap-2"
                                >
                                    {filters.location}
                                    <X
                                        className="w-3 h-3 cursor-pointer hover:text-white"
                                        onClick={() => handleFilterChange({
                                            ...filters,
                                            location: ''
                                        })}
                                    />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {data && (
                    <div className="text-white/60 mb-6">
                        Found {data.total} developer{data.total !== 1 ? 's' : ''}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? renderSkeletons() : (
                        data?.developers.map((developer: any, index: number) => (
                            <DeveloperCard
                                key={developer._id}
                                developer={developer}
                                index={index}
                            />
                        ))
                    )}
                </div>

                {data && data.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data.totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

                <FilterSidebar
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>
        </div>
    );
};

export default SearchDevelopers;