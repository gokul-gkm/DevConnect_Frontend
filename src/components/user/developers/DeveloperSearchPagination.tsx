import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const getVisiblePages = () => {
        if (totalPages <= 7) return pages;
        
        if (currentPage <= 4) {
            return [...pages.slice(0, 5), '...', totalPages];
        }
        
        if (currentPage >= totalPages - 3) {
            return [1, '...', ...pages.slice(totalPages - 5)];
        }
        
        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages
        ];
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white/5 border-white/10 text-white
                         hover:bg-white/10 disabled:opacity-50"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            {getVisiblePages().map((page, index) => (
                <Button
                    key={index}
                    variant={page === currentPage ? 'default' : 'outline'}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={typeof page !== 'number'}
                    className={`min-w-[2.5rem] ${
                        page === currentPage
                            ? 'bg-indigo-500 hover:bg-indigo-600'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white/5 border-white/10 text-white
                         hover:bg-white/10 disabled:opacity-50"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default Pagination;