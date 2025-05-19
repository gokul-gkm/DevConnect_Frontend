import { flexRender, Table } from '@tanstack/react-table';

interface SessionTableProps<T> {
  table: Table<T>;
  columns: any[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function SessionTable<T>({
  table,
  columns,
  isLoading = false,
  emptyMessage = 'No sessions found',
}: SessionTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left py-4 px-4 text-sm font-medium text-gray-400 first:pl-6 last:pr-6"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-2 first:pl-4 last:pr-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
