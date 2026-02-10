'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Activity,
  X,
  Filter,
  CalendarClock
} from 'lucide-react'
import { UpcomingSession } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import { useUpcomingSessions } from '@/hooks/session/useUpcomingSessions'
import { useDebounce } from '@/hooks/useDebounce'
import { SessionTable } from '@/components/user/Sessions/SessionTable'
import Pagination from '@/components/ui/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

export function UpcomingSessions() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<UpcomingSession['status'] | 'all'>('all')
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
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
        <span className="font-mono text-xs lg:text-sm text-purple-300/90">
          {(info.getValue() as string).slice(0, 8)}
        </span>
      )
    },
    {
      accessorKey: 'developer',
      header: 'Developer',
      cell: (info) => {
        const developer = info.getValue() as UpcomingSession['developer']
        return (
          <div className="flex items-center gap-2 lg:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={developer.avatar}
                alt={developer.name}
                className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-xl lg:rounded-xl object-cover ring-2 ring-purple-500/20"
              />

            </div>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-white text-xs lg:text-sm xl:text-base block truncate">
                {developer.name}
              </span>
              <p className="text-[10px] lg:text-xs text-gray-400 truncate">
                {developer.role}
              </p>
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
          className="p-0 hover:bg-transparent text-xs lg:text-sm h-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
        </Button>
      ),
      cell: (info) => {
        const date = info.getValue() as Date
        const formattedDate = format(date, 'MMM dd, yyyy')
        let relativeDate = ''

        if (isToday(date)) {
          relativeDate = 'Today'
        } else if (isTomorrow(date)) {
          relativeDate = 'Tomorrow'
        } else {
          relativeDate = formatDistance(date, new Date(), { addSuffix: true })
        }

        return (
          <div className="flex flex-col text-xs lg:text-sm space-y-0.5">
            <span className="text-white">{formattedDate}</span>
            <span className="text-[10px] lg:text-xs text-gray-400 hidden xl:block">
              {relativeDate}
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: (info) => (
        <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
          <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
          <span className="whitespace-nowrap">{info.getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: (info) => (
        <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
          <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
          <span className="whitespace-nowrap">{info.getValue() as number}min</span>
        </div>
      )
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-xs lg:text-sm h-auto"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cost
          <ArrowUpDown className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
        </Button>
      ),
      cell: (info) => (
        <div className="flex items-center gap-0.5 lg:gap-1">
          <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
          <span className="text-xs lg:text-sm font-medium">{info.getValue() as number}</span>
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
          <div className={cn(
            "inline-flex items-center gap-1 lg:gap-1.5 px-1.5 lg:px-2.5 py-1 lg:py-1.5 rounded-xl lg:rounded-full text-[10px] lg:text-xs font-medium border whitespace-nowrap",
            config.classes
          )}>
            <StatusIcon className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 flex-shrink-0" />
            <span className="hidden md:inline">{config.label}</span>
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
          className="hover:bg-white/5 text-[10px] lg:text-xs border border-white/10 rounded-xl lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 h-auto whitespace-nowrap"
          onClick={() => navigate(`/sessions/${info.row.original.id}`)}
        >
          <Eye className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1.5" />
          <span className="hidden lg:inline">View</span>
        </Button>
      )
    }
  ], [navigate])

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
      icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />,
      colorClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/20'
    },
    {
      label: 'Upcoming',
      value: stats.upcoming,
      icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" />,
      colorClass: 'bg-purple-500/10',
      borderClass: 'border-purple-500/20'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />,
      colorClass: 'bg-green-500/10',
      borderClass: 'border-green-500/20'
    },
    {
      label: 'Total Cost',
      value: `$${stats.totalCost}`,
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" />,
      colorClass: 'bg-yellow-500/10',
      borderClass: 'border-yellow-500/20'
    }
  ];

  const SessionCard = ({ session, index }: { session: UpcomingSession; index: number }) => {
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
    
    const config = session.status && session.status in statusConfig 
      ? statusConfig[session.status as keyof typeof statusConfig]
      : defaultConfig

    const StatusIcon = config.icon

    const date = session.date
    let relativeDate = ''
    if (isToday(date)) {
      relativeDate = 'Today'
    } else if (isTomorrow(date)) {
      relativeDate = 'Tomorrow'
    } else {
      relativeDate = formatDistance(date, new Date(), { addSuffix: true })
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-gradient-to-br from-zinc-900/70 to-black/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/5 hover:border-white/10 transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <img
                src={session.developer.avatar}
                alt={session.developer.name}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl object-cover ring-2 ring-purple-500/20"
              />

            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                {session.developer.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{session.developer.role}</p>
            </div>
          </div>
          <div className={cn(
            "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0",
            config.classes
          )}>
            <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{config.label}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
          <div className="bg-white/5 rounded-xl sm:rounded-xl p-2 sm:p-3 border border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <p className="text-[10px] sm:text-xs text-gray-400">Date</p>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-white font-medium">{format(session.date, 'MMM dd, yyyy')}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{relativeDate}</p>
          </div>
          
          <div className="bg-white/5 rounded-xl sm:rounded-xl p-2 sm:p-3 border border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <p className="text-[10px] sm:text-xs text-gray-400">Time</p>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-white font-medium">{session.time}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{session.duration} minutes</p>
          </div>
          
          <div className="bg-white/5 rounded-xl sm:rounded-xl p-2 sm:p-3 border border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <p className="text-[10px] sm:text-xs text-gray-400">Cost</p>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-white font-medium">${session.cost}</p>
          </div>
          
          <div className="bg-white/5 rounded-xl sm:rounded-xl p-2 sm:p-3 border border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <CalendarClock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <p className="text-[10px] sm:text-xs text-gray-400">Session ID</p>
            </div>
            <p className="font-mono text-xs sm:text-sm text-purple-300/90 truncate">{session.id.slice(0, 12)}</p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-blue-500/20 text-white rounded-xl sm:rounded-xl text-xs sm:text-sm h-9 sm:h-10 transition-all group"
          onClick={() => navigate(`/sessions/${session.id}`)}
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
          View Full Details
        </Button>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading upcoming sessions..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
    );
  }

  return (
    <main className="w-full min-h-screen bg-black">
      <div className="h-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 md:py-8 lg:py-12 pt-16 sm:pt-20 md:pt-24">
        <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden sm:block"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mb-1 md:mb-2">
              Upcoming Sessions
            </h1>
            <p className="text-sm md:text-base text-gray-400">Manage and track your scheduled mentoring sessions</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-gradient-to-br from-zinc-900/70 to-black/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 border backdrop-blur-sm hover:scale-105 transition-all duration-300",
                  stat.borderClass
                )}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className={cn("p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-xl", stat.colorClass)}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl sm:rounded-2xl lg:rounded-3xl backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all overflow-hidden"
          >
            {/* Search and Filter Header */}
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex flex-col gap-3 sm:gap-4">
                
                {/* Mobile Title */}
                <div className="sm:hidden">
                  <h2 className="text-lg font-semibold text-white">Upcoming</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your scheduled sessions</p>
                </div>

                {/* Desktop Title */}
                <div className="hidden sm:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4">
                  <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      All Upcoming Sessions
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">Manage your scheduled sessions</p>
                  </div>
                </div>

                {/* Search and Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:max-w-sm lg:max-w-md">
                    <Search className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none",
                      isSearching ? 'text-purple-400' : 'text-gray-400'
                    )} />
                    <Input
                      value={searchValue}
                      onChange={(e) => {
                        setIsSearching(true)
                        setSearchValue(e.target.value)
                      }}
                      onBlur={() => setIsSearching(false)}
                      className="pl-9 sm:pl-10 pr-3 bg-zinc-900/50 border-white/5 focus:border-purple-500/50 w-full text-sm h-10 sm:h-11 rounded-xl sm:rounded-xl transition-all"
                      placeholder="Search by developer, ID..."
                    />
                    {searchValue && (
                      <button
                        onClick={() => setSearchValue('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Status Filter */}
                    <div className="relative flex-1 sm:flex-none sm:min-w-[140px] md:min-w-[160px]">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as UpcomingSession['status'] | 'all')}
                        className="w-full appearance-none bg-zinc-900/50 border border-white/5 rounded-xl sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-9 text-white focus:outline-none focus:border-purple-500/50 transition-all hover:border-white/10 text-sm h-10 sm:h-11 cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="approved">Approved</option>
                        <option value="active">Active</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="sm:hidden bg-zinc-900/50 border-white/5 hover:bg-white/5 text-white rounded-xl h-10 px-3"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {(searchValue || statusFilter !== 'all') && (
                  <div className="flex flex-wrap gap-2">
                    {searchValue && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Search: {searchValue}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-white"
                          onClick={() => setSearchValue('')}
                        />
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Status: {statusFilter}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-white"
                          onClick={() => setStatusFilter('all')}
                        />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Table View (Desktop) */}
            <div className="hidden xl:block overflow-x-auto">
              <SessionTable
                table={table}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No upcoming sessions found"
              />
            </div>

            {/* Card View (Mobile & Tablet) */}
            <div className="xl:hidden p-3 sm:p-4 md:p-5 lg:p-6">
              <AnimatePresence mode="wait">
                {filteredSessions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 sm:py-16 lg:py-20"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 mb-4">
                      <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">No upcoming sessions found</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                    {filteredSessions.map((session, index) => (
                      <SessionCard key={session.id} session={session} index={index} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Pagination
                pagination={{
                  currentPage: pagination.currentPage,
                  totalPages: pagination.totalPages,
                }}
                updateParams={({ page }) => setCurrentPage(page)}
              />
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}