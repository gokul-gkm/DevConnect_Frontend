import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onPageChange: (page: number) => void;
}

const ProjectPagination = ({ 
    currentPage, 
    totalPages, 
    hasNextPage, 
    hasPrevPage, 
    onPageChange 
}: PaginationProps) => {
    return (
        <div className="mt-12 flex justify-center items-center">
            <div className="flex items-center gap-2 p-2 rounded-full 
                          bg-gradient-to-r from-white/[0.03] to-white/[0.05]
                          backdrop-blur-xl border border-white/10
                          shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
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
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => onPageChange(i + 1)}
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                                "transition-all duration-300",
                                "relative overflow-hidden",
                                currentPage === i + 1
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <span className="relative z-10">{i + 1}</span>
                            {currentPage === i + 1 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
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

export default ProjectPagination;