import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/ui/Pagination";
import { paginationType } from '@/types/ui.type';

type AdminTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: paginationType;
  updateParams?: (params: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
};

export default function AdminTable<TData>({ 
  data, 
  columns, 
  pagination, 
  updateParams,
  isLoading,
  emptyMessage = "No data found"
}: AdminTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <div className="text-slate-400 animate-pulse">Loading data...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-slate-800/50 bg-slate-900/50 shadow-2xl backdrop-blur-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-slate-800/50"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-slate-400 bg-slate-900/90 first:rounded-tl-2xl last:rounded-tr-2xl py-5"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={row.id}
                    className="border-slate-800/50 hover:bg-slate-800/50 transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-slate-300">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {pagination && updateParams && (
        <Pagination pagination={pagination} updateParams={updateParams} />
      )}
    </>
  );
}