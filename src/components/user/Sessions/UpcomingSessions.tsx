'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { format, formatDistance, isToday, isTomorrow } from 'date-fns'
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  Check,
  AlertCircle,
  BadgeCheck,
  Activity
} from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { UpcomingSession } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import { useUpcomingSessions } from '@/hooks/session/useUpcomingSessions'
import { useDebounce } from '@/hooks/useDebounce'
import { StatsCard } from '@/components/user/Sessions/StatsCard'
import { SessionTable } from '@/components/user/Sessions/SessionTable'
import Pagination from '@/components/ui/Pagination'

export function UpcomingSessions() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<UpcomingSession['status'] | 'all'>('all')
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  
  const debouncedSearch = useDebounce(searchValue, 300)

  const { filteredSessions, isLoading, stats, pagination } = useUpcomingSessions(
    debouncedSearch,
    statusFilter,
    currentPage
  )

  const columns = useMemo<ColumnDef<UpcomingSession>[]>(() => [
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
        const developer = info.getValue() as UpcomingSession['developer']
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={developer.avatar}
                alt={developer.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                developer.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
              }`} />
            </div>
            <div>
              <span className="font-medium text-white">{developer.name}</span>
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
        const formattedDate = format(date, 'MMM, dd, yyyy')
        let relativeDate = ''

        if (isToday(date)) {
          relativeDate = 'Today'
        } else if (isTomorrow(date)) {
          relativeDate = 'Tomorrow'
        } else {
          relativeDate = formatDistance(date, new Date(), { addSuffix: true })
        }

        return (
          <div className="flex flex-col text-sm">
            <span className="text-white">{formattedDate}</span>
            <span className="text-xs text-gray-400">{relativeDate}</span>
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
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-1 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{info.getValue() as number}</span>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as UpcomingSession['status']
        const defaultConfig = {
          label: 'Unknown',
          classes: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
          icon: AlertCircle
        }
        
        const statusConfig = {
          pending: {
            label: 'Pending',
            classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            icon: Clock
          },
          scheduled: {
            label: 'Scheduled',
            classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            icon: Calendar
          },
          cancelled: {
            label: 'Cancelled',
            classes: 'bg-red-500/10 text-red-400 border-red-500/20',
            icon: AlertCircle
          },
          approved: {
            label: 'Approved',
            classes: 'bg-green-500/10 text-green-400 border-green-500/20',
            icon: BadgeCheck 
          },
          active: {
            label: 'Active',
            classes: 'bg-green-500/10 text-green-400 border-green-500/20',
            icon: Activity 
          }
        } as const
        
        const config = status && status in statusConfig 
          ? statusConfig[status as keyof typeof statusConfig]
          : defaultConfig

        const StatusIcon = config.icon
    
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
          onClick={() => navigate(`/sessions/${info.row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      )
    }
  ], [])

  const table = useReactTable({
    data: filteredSessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
      icon: <Calendar className="w-6 h-6 text-blue-400" />,
      colorClass: 'bg-blue-500/10'
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      colorClass: 'bg-purple-500/10'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Check className="w-6 h-6 text-green-400" />,
      colorClass: 'bg-green-500/10'
    },
    {
      label: 'Total Cost',
      value: `$${stats.totalCost}`,
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      colorClass: 'bg-yellow-500/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    )
  }

  return (
    <main className="w-full">
      <div className="min-h-screen p-4 lg:p-8 pt-20">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/5
              hover:border-white/10 transition-all"
          >
            <div className="p-4 sm:p-6 border-b border-white/5">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Upcoming Sessions
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Manage your scheduled mentoring sessions</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
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
                      className="pl-9 bg-zinc-900/50 border-white/5 focus:border-purple-500/50 w-full text-sm sm:text-base"
                      placeholder="Search sessions..."
                    />
                  </div>
                  <div className="relative min-w-[140px]">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as UpcomingSession['status'] | 'all')}
                      className="w-full appearance-none bg-zinc-900/50 border border-white/5 rounded-xl px-3 py-2 pr-8
                        text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm sm:text-base
                        hover:border-white/10"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
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
              emptyMessage="No upcoming sessions found"
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