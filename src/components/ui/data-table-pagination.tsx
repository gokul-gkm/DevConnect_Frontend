import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/shadcn-button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-slate-400">Rows per page</p>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px] bg-slate-800/50 border-slate-700/50">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 bg-slate-800/50 border-slate-700/50"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 bg-slate-800/50 border-slate-700/50"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium text-slate-400">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 bg-slate-800/50 border-slate-700/50"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 bg-slate-800/50 border-slate-700/50"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}