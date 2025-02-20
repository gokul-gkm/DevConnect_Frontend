import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { User } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/shadcn-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, ArrowUpDown, Search, Shield, Mail, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";

function UsersListPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const {
    users,
    pagination,
    isLoading,
    queryParams,
    updateParams,
    toggleStatusMutation,
  } = useAdminUsers();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  const handleSearch = debounce((search: string) => {
    updateParams({ search, page: 1 });
  }, 500);

  const handleSort = (sortBy: string) => {
    const sortOrder = queryParams.sortOrder === "asc" ? "desc" : "asc";
    updateParams({ sortBy, sortOrder });
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleSort("username")}
            className="text-slate-400 hover:text-slate-100"
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center shadow-lg ring-1 ring-slate-700/50">
              {row.original.profilePicture ? (
                <img
                  src={row.original.profilePicture}
                  className="object-cover rounded-full"
                  alt={row.original.username}
                />
              ) : (
                <Users className="h-5 w-5 text-slate-300" />
              )}
            </div>
            <div>
              <div className="font-medium text-slate-100">
                {row.original.username}
              </div>
              <div className="text-xs text-slate-400">
                ID: {row.original._id.slice(0, 8)}
              </div>
            </div>
          </motion.div>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleSort("email")}
            className="text-slate-400 hover:text-slate-100"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-slate-700 bg-slate-800/50 text-slate-100 shadow-lg"
              )}
            >
              {row.original.role}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "active" ? "success" : "destructive"
            }
            className={cn(
              "font-medium shadow-lg",
              row.original.status === "active"
                ? "bg-emerald-950/50 text-emerald-200 border-emerald-900/50"
                : "bg-red-950/50 text-red-200 border-red-900/50"
            )}
          >
            <span
              className={cn(
                "mr-1 h-2 w-2 rounded-full inline-block",
                row.original.status === "active"
                  ? "bg-emerald-400"
                  : "bg-red-400"
              )}
            />
            {row.original.status === "active" ? "Active" : "Blocked"}
          </Badge>
        ),
      },
      {
        accessorKey: "isVerified",
        header: "Verified",
        cell: ({ row }) => (
          <Badge
            variant={row.original.isVerified ? "success" : "warning"}
            className={cn(
              "font-medium shadow-lg",
              row.original.isVerified
                ? "bg-blue-950/50 text-blue-200 border-blue-900/50"
                : "bg-amber-950/50 text-amber-200 border-amber-900/50"
            )}
          >
            {row.original.isVerified ? "✓ Verified" : "⚠ Pending"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant={
                row.original.status === "active" ? "destructive" : "default"
              }
              size="sm"
              onClick={() => toggleStatusMutation.mutate(row.original._id)}
              disabled={toggleStatusMutation.isPending}
              className={cn(
                "w-24 transition-all shadow-lg rounded-full",
                row.original.status === "active"
                  ? "bg-red-950/50 hover:bg-red-900/50 text-red-200 border border-red-900/50"
                  : "bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50"
              )}
            >
              {row.original.status === "active" ? "Block" : "Unblock"}
            </Button>
          </div>
        ),
      },
      {
        id: "view",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2 rounded-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleViewDetails(row.original._id)}
              className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 border border-slate-700/50 shadow-lg rounded-full w-28"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        ),
      },
    ],
    [queryParams.sortOrder]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <div className="text-slate-400 animate-pulse">Loading users...</div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm shadow-xl"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
              Users Management
            </h1>
            <p className="text-slate-400 mt-1">
              Manage and monitor user accounts
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-200" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={handleSearchInput}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 shadow-lg"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Total Users",
              value: pagination?.total || 0,
              icon: Users,
              color: "from-blue-600/20 to-blue-800/20",
              borderColor: "border-blue-500/20",
            },
            {
              title: "Active Users",
              value: users.filter((u) => u.status === "active").length,
              icon: Shield,
              color: "from-green-600/20 to-green-800/20",
              borderColor: "border-green-500/20",
            },
            {
              title: "Verified Users",
              value: users.filter((u) => u.isVerified).length,
              icon: Mail,
              color: "from-purple-600/20 to-purple-800/20",
              borderColor: "border-purple-500/20",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 border ${stat.borderColor} shadow-xl backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-sm font-medium">
                    {stat.title}
                  </div>
                  <div className="text-3xl font-bold text-slate-100 mt-1">
                    {stat.value?.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <stat.icon className="h-5 w-5 text-slate-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-slate-800/50 hover:bg-slate-800/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-slate-300">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination && (
            <Pagination pagination={pagination} updateParams={updateParams} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UsersListPage;
