import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  MessageSquare,
  GalleryVerticalEnd,
  BookOpen,
  DollarSign,
  Users,
  Star,
  Clock,
  BarChart,
  Edit,
  CalendarPlus,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const menuItems = [
  {
    title: 'Profile',
    icon: User,
    path: '/developer/profile'
  },
  {
    title: 'Edit Profile',
    icon: Edit,
    path: '/developer/edit-profile'
  },
  {
    title: 'Portfolio',
    icon: GalleryVerticalEnd,
    path: '/developer/portfolio'
  },
  {
    title: 'Session Requests',
    icon: CalendarPlus,
    path: '/developer/session-requests'
  },
  {
    title: 'Chats',
    icon: MessageSquare,
    path: '/developer/chats'
  },
  {
    title: 'Wallet',
    icon: Wallet,
    path: '/developer/wallet'
  },
  {
    title: 'Students',
    icon: Users,
    path: '/developer/students'
  },
  {
    title: 'Reviews',
    icon: Star,
    path: '/developer/reviews'
  },
  {
    title: 'Earnings',
    icon: DollarSign,
    path: '/developer/earnings'
  },
  {
    title: 'Analytics',
    icon: BarChart,
    path: '/developer/analytics'
  },
  {
    title: 'Resources',
    icon: BookOpen,
    path: '/developer/resources'
  },
  {
    title: 'Availability',
    icon: Clock,
    path: '/developer/availability'
  }
];

export const DeveloperProfileSidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem }) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-72 min-h-screen bg-gradient-to-b from-black to-gray-900/50 border-r border-white/5">
      <div className=" top-0 z-10">
        <div className="p-6">
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/5">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Developer Portal</h3>
              <p className="text-xs text-gray-400">Manage your sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.title}
                to={item.path}
                onClick={() => setActiveItem(item.title)}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? 'text-indigo-400' 
                      : 'text-gray-400 group-hover:text-white'
                  }`} />
                  <span className={`font-medium ${
                    isActive 
                      ? 'text-indigo-400' 
                      : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {item.title}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <Star className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Active Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};