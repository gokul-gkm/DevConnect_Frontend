import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    pagination: {
        currentPage: number;
        totalPages: number;
    };
    updateParams: (params: { page: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, updateParams }) => {
    const { currentPage, totalPages } = pagination;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let start = Math.max(2, currentPage - delta);
            let end = Math.min(totalPages - 1, currentPage + delta);

            if (currentPage <= delta + 2) {
                end = Math.min(5, totalPages - 1);
                start = 2;
            }

            if (currentPage >= totalPages - (delta + 1)) {
                start = Math.max(totalPages - 4, 2);
                end = totalPages - 1;
            }

            if (start > 2) {
                pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="mt-12 flex justify-center items-center">
            <div className="flex items-center gap-2 p-2 rounded-full 
                          bg-gradient-to-r from-white/[0.03] to-white/[0.05]
                          backdrop-blur-xl border border-white/10
                          shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <button
                    onClick={() => updateParams({ page: currentPage - 1 })}
                    disabled={currentPage === 1}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "transition-all duration-300",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "hover:bg-white/10 active:scale-95",
                        "text-white/70 hover:text-white",
                        "bg-gradient-to-r from-white/[0.05] to-transparent",
                        "border border-white/10"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1 px-2">
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-8 h-8 flex items-center justify-center text-white/50"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => updateParams({ page: page as number })}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                                    "transition-all duration-300",
                                    "relative overflow-hidden",
                                    currentPage === page
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <span className="relative z-10">{page}</span>
                                {currentPage === page && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl" />
                                )}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => updateParams({ page: currentPage + 1 })}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "transition-all duration-300",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "hover:bg-white/10 active:scale-95",
                        "text-white/70 hover:text-white",
                        "bg-gradient-to-r from-transparent to-white/[0.05]",
                        "border border-white/10"
                    )}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;