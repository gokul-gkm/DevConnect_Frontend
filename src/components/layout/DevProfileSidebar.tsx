import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  MessageSquare,
  GalleryVerticalEnd,
  Star,
  Clock,
  Edit,
  CalendarPlus,
  CalendarCheck ,
  Wallet,
  CalendarCheck2,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
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
    title: 'Scheduled Sessions',
    icon: CalendarCheck2 ,
    path: '/developer/sessions/scheduled'
  },
  {
    title: 'Session History',
    icon: CalendarCheck ,
    path: '/developer/sessions/history'
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
    title: 'Reviews',
    icon: Star,
    path: '/developer/reviews'
  },
  {
    title: 'Availability',
    icon: Clock,
    path: '/developer/availability'
  },
  {
    title: 'Change Password',
    icon: Lock,
    path: '/developer/change-password'
  }
];

const buttonVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }),
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
}

export const DeveloperProfileSidebar: React.FC<SidebarProps> = ({ setActiveItem }) => {
  const location = useLocation();

  return (
    <>
  
      <div className="hidden lg:flex flex-col w-72 min-h-screen bg-gradient-to-b from-black to-gray-900/50 border-r border-white/5">
        <div className="top-0 z-10">
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

      <div className="lg:hidden fixed top-16 left-0 right-0 z-10">
        <div className={cn(
          "bg-gradient-to-b from-black/95 to-black/90",
          "border-b border-white/5 backdrop-blur-xl",
          "p-2"
        )}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-2 min-w-max">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.button
                    key={index}
                    custom={index}
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    onClick={() => {
                      setActiveItem(item.title);
                      window.location.href = item.path;
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap",
                      "transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive 
                        ? "text-indigo-400" 
                        : "group-hover:text-indigo-400"
                    )} />
                    <span className="font-medium">{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-mobile-dev"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 -z-10 backdrop-blur-xl"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};