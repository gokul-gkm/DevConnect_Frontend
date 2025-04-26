import { Card, Title } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Star, Users, Award } from "lucide-react";

interface TopDeveloper {
  id: string;
  name: string;
  avatar: string;
  revenue: number;
  sessions: number;
  rating: number;
  expertise?: string[];
}

interface TopDevelopersProps {
  developers: TopDeveloper[];
}

export const TopDevelopers = ({ developers }: TopDevelopersProps) => {
  if (!developers || developers.length === 0) {
    return (
      <Card className="bg-slate-900/60 border-slate-700/30 shadow-xl backdrop-blur-lg rounded-xl p-6">
        <Title className="text-white text-lg font-semibold mb-4">Top Performing Developers</Title>
        <div className="text-center py-12 text-slate-500">No developer data available</div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/60 border-slate-700/30 shadow-xl backdrop-blur-lg rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <Title className="text-white text-lg font-semibold">Top Performing Developers</Title>
        <div className="text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
          <Award className="w-3 h-3" />
          <span>Top Performers</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developers.map((developer, index) => (
          <div 
            key={developer.id}
            className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl border border-slate-700/30 shadow-lg"
          >
            {index === 0 && (
              <div className="absolute top-0 right-0">
                <div className="w-20 h-20 bg-yellow-500/20 transform rotate-45 translate-x-10 -translate-y-10"></div>
                <Award className="absolute top-2 right-2 w-4 h-4 text-yellow-400" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 border-2 border-purple-500/20">
                  <AvatarImage src={developer.avatar} />
                  <AvatarFallback className="bg-purple-900/50 text-purple-300">
                    {developer.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-white">{developer.name}</h4>
                  <div className="flex items-center text-xs text-slate-500">
                    {developer.expertise && developer.expertise.slice(0, 2).map((skill, i) => (
                      <span key={i} className="mr-1">
                        {skill}{i < Math.min(1, (developer.expertise?.length || 1) - 1) ? "," : ""}
                      </span>
                    ))}
                    {developer.expertise && developer.expertise.length > 2 && 
                      <span>+{developer.expertise.length - 2} more</span>
                    }
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-800/50 rounded-xl p-2 text-center border border-slate-700/30">
                  <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Revenue</p>
                  <p className="text-sm font-medium text-white">${developer.revenue}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 text-center border border-slate-700/30">
                  <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Sessions</p>
                  <p className="text-sm font-medium text-white">{developer.sessions}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 text-center border border-slate-700/30">
                  <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">Rating</p>
                  <p className="text-sm font-medium text-white">{developer.rating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
