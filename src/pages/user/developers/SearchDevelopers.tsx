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
            <div className="min-h-screen bg-black/95 pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="text-red-400 text-center text-sm sm:text-base">
                        Error loading developers: {(error as any)?.message || 'Something went wrong'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/95 pt-20 sm:pt-24 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Search and Filter Section */}
                <div className="flex flex-col space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 sm:gap-4">
                        {/* Search Input */}
                        <div className="relative w-full lg:w-80 xl:w-96">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search developers, skills..."
                                className="w-full px-4 py-2 sm:py-2.5 pl-4 pr-10 rounded-xl sm:rounded-xl
                                         bg-white/5 border border-white/10
                                         text-sm sm:text-base text-white placeholder:text-white/50
                                         focus:outline-none focus:border-indigo-500/50
                                         backdrop-blur-xl transition-all"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        {/* Sort and Filter Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            {/* Sort Dropdown */}
                            <div className="relative flex-1 lg:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none w-full lg:w-auto pl-8 sm:pl-10 pr-8 sm:pr-12 py-2 sm:py-2.5 rounded-xl sm:rounded-xl
                                             bg-white/5 border border-white/10
                                             text-xs sm:text-sm text-white
                                             focus:outline-none focus:border-indigo-500/50
                                             backdrop-blur-xl cursor-pointer
                                             lg:min-w-[160px] xl:min-w-[180px]"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name_asc">Name (A-Z)</option>
                                    <option value="name_desc">Name (Z-A)</option>
                                    <option value="price_low">Price (Low to High)</option>
                                    <option value="price_high">Price (High to Low)</option>
                                </select>
                                
                                <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                    {sortBy === 'newest' && <Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
                                    {sortBy === 'oldest' && <Clock className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />}
                                    {sortBy === 'name_asc' && <SortAsc className="w-3 h-3 sm:w-4 sm:h-4" />}
                                    {sortBy === 'name_desc' && <SortDesc className="w-3 h-3 sm:w-4 sm:h-4" />}
                                </div>
                                
                                <ArrowUpDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-3 h-3 sm:w-4 sm:h-4" />
                            </div>

                            {/* Filter Button */}
                            <Button
                                onClick={() => setIsFilterOpen(true)}
                                variant="outline"
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border-white/10 text-white rounded-xl sm:rounded-xl text-xs sm:text-sm whitespace-nowrap"
                            >
                                <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Filters</span>
                                <span className="sm:hidden">Filter</span>
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(filters.skills.length > 0 || filters.languages.length > 0 || filters.location) && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                            {filters.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                                             bg-indigo-500/10 text-indigo-400
                                             border border-indigo-500/20
                                             flex items-center gap-1 sm:gap-2"
                                >
                                    {skill}
                                    <X
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer hover:text-white"
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
                                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                                             bg-purple-500/10 text-purple-400
                                             border border-purple-500/20
                                             flex items-center gap-1 sm:gap-2"
                                >
                                    {language}
                                    <X
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer hover:text-white"
                                        onClick={() => handleFilterChange({
                                            ...filters,
                                            languages: filters.languages.filter(l => l !== language)
                                        })}
                                    />
                                </span>
                            ))}
                            {filters.location && (
                                <span
                                    className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm
                                             bg-blue-500/10 text-blue-400
                                             border border-blue-500/20
                                             flex items-center gap-1 sm:gap-2"
                                >
                                    {filters.location}
                                    <X
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer hover:text-white"
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

                {/* Results Count */}
                {data && (
                    <div className="text-white/60 mb-4 sm:mb-6 text-sm sm:text-base">
                        Found {data.total} developer{data.total !== 1 ? 's' : ''}
                    </div>
                )}

                {/* Developer Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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

                {/* Empty State */}
                {!isLoading && data && data.developers.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="text-white/60 text-sm sm:text-base">
                            No developers found matching your criteria
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={data.totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}

                {/* Filter Sidebar */}
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