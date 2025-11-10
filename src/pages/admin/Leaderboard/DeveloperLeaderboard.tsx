import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Star, DollarSign, Award, Users, Trophy, Zap } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { Card, Title, Text } from '@tremor/react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminApi from '@/service/Api/AdminApi';
import { StatCard } from '@/components/admin/dashboard/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Developer = {
  id: string;
  userId: string;
  username: string;
  profilePicture: string;
  expertise: string[];
  rating: number;
  totalSessions: number;
  totalEarnings: number;
  combinedScore: number;
};

export default function DeveloperLeaderboard() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'combined' | 'rating' | 'earnings' | 'sessions'>('combined');
  
  const { data, isLoading } = useQuery({
    queryKey: ['developerLeaderboard', page, sortBy],
    queryFn: () => AdminApi.getDeveloperLeaderboard(page, 10, sortBy),
  });

  const updateParams = ({ page: newPage }: { page: number }) => {
    setPage(newPage);
  };

  const handleTabChange = (value: string) => {
    setSortBy(value as 'combined' | 'rating' | 'earnings' | 'sessions');
    setPage(1);
  };

  const getOrdinal = (position: number) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = position % 100;
    return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const developers = data?.developers || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 };

  const columns: ColumnDef<Developer>[] = [
    {
      accessorKey: 'rank',
      header: () => <div className="font-semibold">Rank</div>,
      cell: ({ row }) => {
        const position = (page - 1) * 10 + row.index + 1;
        
        return (
          <div className="flex items-center gap-2">
            {position <= 3 ? (
              <Trophy className={`h-5 w-5 ${
                position === 1 ? 'text-yellow-400' : 
                position === 2 ? 'text-slate-400' : 
                'text-amber-700'
              }`} />
            ) : null}
            <span className="font-medium">{getOrdinal(position)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'developer',
      header: () => <div className="font-semibold">Developer</div>,
      cell: ({ row }) => {
        const developer = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-purple-500/20">
              <img
                src={developer.profilePicture}
                alt={developer.username}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                }}
              />
            </div>
            <div>
              <div className="font-medium text-white">{developer.username}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {developer.expertise?.slice(0, 2).map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-indigo-950/40 text-xs py-0">
                    {skill}
                  </Badge>
                ))}
                {developer.expertise?.length > 2 && (
                  <Badge variant="outline" className="bg-indigo-950/40 text-xs py-0">
                    +{developer.expertise.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'rating',
      header: () => (
        <div className="font-semibold flex items-center gap-1">
          <Star className="h-4 w-4" /> Rating
        </div>
      ),
      cell: ({ row }) => {
        const rating = row.original.rating;
        return (
          <div className="flex items-center">
            <span className="font-medium mr-1 text-slate-300">{rating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : i < Math.ceil(rating) && i > Math.floor(rating) - 1
                        ? 'text-yellow-400 fill-yellow-400/50'
                        : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'sessions',
      header: () => (
        <div className="font-semibold flex items-center gap-1">
          <Users className="h-4 w-4" /> Sessions
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium text-slate-300">
            {row.original.totalSessions}
          </div>
        );
      },
    },
    {
      accessorKey: 'earnings',
      header: () => (
        <div className="font-semibold flex items-center gap-1">
          <DollarSign className="h-4 w-4" /> Earnings
        </div>
      ),
      cell: ({ row }) => {
        const earnings = row.original.totalEarnings;
        return (
          <div className="font-medium text-green-400">
            ${earnings.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'score',
      header: () => (
        <div className="font-semibold flex items-center gap-1">
          <Award className="h-4 w-4" /> Score
        </div>
      ),
      cell: ({ row }) => {
        const score = row.original.combinedScore;

        const percentage = Math.min(100, Math.round(score));
        
        return (
          <div className="w-28">
            <div className="font-medium mb-1 text-slate-300">{score.toFixed(1)}</div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  if (isLoading || !developers) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading Leaderboard Data..."
        color="indigo"
        fullScreen={true}
      />
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
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 p-8 rounded-2xl border border-slate-800/50 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Developer Leaderboard
            </h1>
            <p className="text-slate-400 mt-1">
              Ranking the top performing developers based on ratings, earnings, and completed sessions
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              Performance Rankings
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-full">
            <StatCard
              title="Scoring System"
              value="Combined Metric"
              icon={Zap}
              description="60% Rating + 40% Earnings"
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Top Developer"
              value={developers[0]?.username || 'None'}
              icon={Trophy}
              description={`${developers[0]?.rating.toFixed(1) || 0} ★ | $${developers[0]?.totalEarnings.toLocaleString() || 0}`}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Highest Rated"
              value={[...developers].sort((a, b) => b.rating - a.rating)[0]?.username || 'None'}
              icon={Star}
              description={`${[...developers].sort((a, b) => b.rating - a.rating)[0]?.rating.toFixed(1) || 0} ★`}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
          <div className="h-full">
            <StatCard
              title="Top Earner"
              value={[...developers].sort((a, b) => b.totalEarnings - a.totalEarnings)[0]?.username || 'None'}
              icon={DollarSign}
              description={`$${[...developers].sort((a, b) => b.totalEarnings - a.totalEarnings)[0]?.totalEarnings.toLocaleString() || 0}`}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-lg backdrop-blur-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-hidden rounded-xl border border-slate-700/30">
            <Card className="bg-slate-900/60 border-0 shadow-xl backdrop-blur-lg rounded-xl p-6">
              <div className="mb-6">
                <Title className="text-white text-lg font-semibold">Developer Rankings</Title>
                <Text className="text-slate-400 text-sm">Performance based on various metrics</Text>
              </div>
              
              <Tabs 
                defaultValue="combined" 
                value={sortBy}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 rounded-xl mb-6">
                  <TabsTrigger 
                    value="combined"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl"
                  >
                    <Award className="h-4 w-4 mr-2" /> Combined Score
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="rating"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl"
                  >
                    <Star className="h-4 w-4 mr-2" /> Rating
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="earnings"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl"
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> Earnings
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="sessions"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl"
                  >
                    <Users className="h-4 w-4 mr-2" /> Sessions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={sortBy} className="mt-0">
                  <AdminTable
                    data={developers}
                    columns={columns}
                    pagination={pagination}
                    updateParams={updateParams}
                    isLoading={isLoading}
                    emptyMessage="No developers found to rank yet."
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
