import { Title, Text } from '@tremor/react';
import AdminTable from '@/components/admin/AdminTable';
import { ColumnDef } from '@tanstack/react-table';
import { User } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  email: string;
  sessions: number;
  averageRating: number;
  totalEarnings: number;
}

interface DeveloperEarningsTableProps {
  data: Developer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  updateParams: (params: { page?: number; limit?: number }) => void;
  isLoading: boolean;
}

const DeveloperEarningsTable = ({ 
  data, 
  pagination, 
  updateParams,
  isLoading 
}: DeveloperEarningsTableProps) => {
  
  const columns: ColumnDef<Developer>[] = [
    {
      accessorKey: 'name',
      header: 'Developer',
      cell: ({ row }) => {
        const dev = row.original;
        return (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{dev.name}</div>
              <div className="text-xs text-slate-400">{dev.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'sessions',
      header: 'No of Sessions',
      cell: ({ row }) => <span className="text-slate-300">{row.original.sessions}</span>
    },
    {
      accessorKey: 'averageRating',
      header: 'Average Rating',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="text-sm text-slate-300 ml-1">{row.original.averageRating}</div>

          <div className="text-yellow-500">★</div>
        </div>
      )
    },
    {
      accessorKey: 'totalEarnings',
      header: 'Total Earnings',
      cell: ({ row }) => <span className="text-slate-300">$ {row.original.totalEarnings}</span>
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <Title className="text-white text-lg font-semibold">Earnings By Developers</Title>
        <Text className="text-slate-400 text-sm">Top performing developers by revenue</Text>
      </div>
      
      <AdminTable
        data={data}
        columns={columns}
        pagination={pagination}
        updateParams={updateParams}
        isLoading={isLoading}
        emptyMessage="No developer earnings data available"
      />
    </div>
  );
};

export default DeveloperEarningsTable;
