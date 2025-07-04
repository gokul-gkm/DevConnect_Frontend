'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table'
import { Button } from "@/components/ui/shadcn-button"
import { Input } from "@/components/ui/Input"
import { format, formatDistance } from 'date-fns'
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  History,
  Clock,
  DollarSign,
  Check,
  AlertCircle,
} from 'lucide-react'
import { HistorySession } from '@/types/types'

const mockCompletedSessions: HistorySession[] = Array.from({ length: 50 }, (_, i) => ({
  id: `SES${String(i + 1).padStart(4, '0')}`,
  developer: {
    name: `Developer ${i + 1}`,
    avatar: `https://i.imghippo.com/files/GFY5894omo.jpg`,
    role: 'Full Stack Developer',
    status: 'offline'
  },
  date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
  time: '10:00 AM',
  duration: [30, 45, 60][Math.floor(Math.random() * 3)],
  cost: [50, 75, 100, 150][Math.floor(Math.random() * 4)],
  status: ['completed', 'cancelled'][Math.floor(Math.random() * 2)] as HistorySession['status'],
  rating: Math.floor(Math.random() * 5) + 1,
  feedback: "Great session! Very helpful and knowledgeable."
}))

export function SessionHistory() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<'completed' | 'cancelled' | 'all'>('all')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchValue)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue])

  const columns = useMemo<ColumnDef<HistorySession>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Session ID',
      cell: (info) => (
        <span className="font-mono text-sm text-purple-300/90">{info.getValue() as string}</span>
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
          const StatusIcon = statusConfig[status].icon
          return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border ${statusConfig[status].classes}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig[status].label}
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
          className="hover:bg-white/5 text-xs"
          onClick={() => console.log('View details:', info.row.original)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      )
    }
  ], [])

  const filteredData = useMemo(() => 
    mockCompletedSessions.filter(session => 
      statusFilter === 'all' ? true : session.status === statusFilter
    ),
    [statusFilter]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <main className="flex-1 lg:ml-64">
      <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sessions', value: '142', icon: History, color: 'blue' },
              { label: 'Completed', value: '128', icon: Check, color: 'green' },
              { label: 'Cancelled', value: '14', icon: AlertCircle, color: 'red' },
              { label: 'Total Spent', value: '$2,450', icon: DollarSign, color: 'yellow' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5
                  hover:border-white/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4
                  group-hover:bg-${stat.color}-500/20 transition-colors`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
              </motion.div>
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

            <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    {table.getHeaderGroups().map((headerGroup) => (
                      headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left py-4 px-4 text-sm font-medium text-gray-400 first:pl-6 last:pr-6"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-2 first:pl-4 last:pr-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </Button>
                </div>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="bg-zinc-900/50 border border-white/5 rounded-lg px-3 py-2 text-sm text-white
                    focus:outline-none focus:border-purple-500/50 transition-colors hover:border-white/10"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}