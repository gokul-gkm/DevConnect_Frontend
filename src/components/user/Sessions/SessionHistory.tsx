'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { format, formatDistance } from 'date-fns'
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  History,
  Clock,
  DollarSign,
  Check,
  AlertCircle,
} from 'lucide-react'
import { HistorySession } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import { useSessionHistory } from '@/hooks/session/useSessionHistory'
import { useDebounce } from '@/hooks/useDebounce'
import { StatsCard } from '@/components/user/Sessions/StatsCard'
import { SessionTable } from '@/components/user/Sessions/SessionTable'
import Pagination from '@/components/ui/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export function SessionHistory() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<'completed' | 'cancelled' | 'all'>('all')
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  
  const debouncedSearch = useDebounce(searchValue, 300)

  const { filteredSessions, isLoading, stats, pagination } = useSessionHistory(
    debouncedSearch,
    statusFilter,
    currentPage
  )

  const columns = useMemo<ColumnDef<HistorySession>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Session ID',
      cell: (info) => (
        <span className="font-mono text-sm text-purple-300/90">{(info.getValue() as string).slice(0,8)}</span>
      )
    },
    {
      accessorKey: 'developer',
      header: 'Developer',
      cell: (info) => {
        const developer = info.getValue() as HistorySession['developer']
        return (
          <div className="flex items-center gap-3">
            <img
              src={developer.avatar}
              alt={developer.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20"
            />
            <div>
              <span className="font-medium text-white text-sm">{developer.name}</span>
              <p className="text-xs text-gray-400">{developer.role}</p>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => {
        const date = info.getValue() as Date
        return (
          <div className="flex flex-col text-sm">
            <span className="text-white">{format(date, 'MMM dd, yyyy')}</span>
            <span className="text-xs text-gray-400">
              {formatDistance(date, new Date(), { addSuffix: true })}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{info.getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{info.getValue() as number}min</span>
        </div>
      )
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{info.getValue() as number}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as HistorySession['status']
        const statusConfig = {
          completed: {
            label: 'Completed',
            classes: 'bg-green-500/10 text-green-400 border-green-500/20',
            icon: Check
          },
          cancelled: {
            label: 'Cancelled',
            classes: 'bg-red-500/10 text-red-400 border-red-500/20',
            icon: AlertCircle
          }
        } as const
        const StatusIcon = statusConfig[status]?.icon || AlertCircle
        const config = statusConfig[status] || {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          classes: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        }
        
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border ${config.classes}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-white/5 text-xs border border-white/10 rounded-xl"
          onClick={() => navigate(`/sessions/history/${info.row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      )
    }
  ], [navigate])

  const table = useReactTable({
    data: filteredSessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const statsData = [
    {
      label: 'Total Sessions',
      value: stats.total,
      icon: <History className="w-6 h-6 text-blue-400" />,
      colorClass: 'bg-blue-500/10'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <Check className="w-6 h-6 text-green-400" />,
      colorClass: 'bg-green-500/10'
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: <AlertCircle className="w-6 h-6 text-red-400" />,
      colorClass: 'bg-red-500/10'
    },
    {
      label: 'Total Spent',
      value: `$${stats.totalSpent}`,
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      colorClass: 'bg-yellow-500/10'
    }
  ];

   if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading session history..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

  return (
    <main className="w-full">
      <div className="min-h-screen p-4 lg:p-8 pt-20">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {statsData.map((stat) => (
              <StatsCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                colorClass={stat.colorClass}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl backdrop-blur-sm border border-white/5
              hover:border-white/10 transition-all"
          >
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Session History
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">View your past mentoring sessions</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-64">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isSearching ? 'text-purple-400' : 'text-gray-400'
                    } transition-colors`} />
                    <Input
                      value={searchValue}
                      onChange={(e) => {
                        setIsSearching(true)
                        setSearchValue(e.target.value)
                      }}
                      className="pl-9 bg-zinc-900/50 border-white/5 focus:border-purple-500/50 w-full"
                      placeholder="Search sessions..."
                    />
                  </div>
                  <div className="relative min-w-[140px]">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'completed' | 'cancelled' | 'all')}
                      className="w-full appearance-none bg-zinc-900/50 border border-white/5 rounded-lg px-3 py-2 pr-8
                        text-white focus:outline-none focus:border-purple-500/50 transition-colors
                        hover:border-white/10"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <SessionTable
              table={table}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No session history found"
            />

            
          </motion.div>
          <Pagination
              pagination={{
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
              }}
              updateParams={({ page }) => setCurrentPage(page)}
            />
        </div>
      </div>
    </main>
  )
}