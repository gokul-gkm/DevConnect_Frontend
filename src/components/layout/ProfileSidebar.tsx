'use client'

import { motion } from 'framer-motion'
import {
  Settings,
  History,
  Calendar,
  Lock,
  User,
  Sparkles,
  Wallet2,
  MessageSquare
} from 'lucide-react'
import { SidebarProps } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Edit Profile', path: '/edit-profile' },
  { icon: History, label: 'Session History', path: '/sessions/history' },
  { icon: Calendar, label: 'Upcoming Sessions', path: '/sessions/upcoming' },
  { icon: MessageSquare, label: 'Chats', path: '/chats' },
  { icon: Lock, label: 'Password & Security', path: '/change-password' },
  { icon: Wallet2, label: 'Wallet', path: '/wallet' },
]

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

export function Sidebar({ activeItem, setActiveItem }: SidebarProps) {
  const navigate = useNavigate()

  const handleNavigation = (item: typeof sidebarItems[0]) => {
    setActiveItem(item.label)
    navigate(item.path)
  }

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 2xl:w-72 fixed">
        <div className={cn(
          "h-screen p-3 xl:p-4 2xl:p-5 space-y-4 xl:space-y-5 2xl:space-y-6",
          "bg-gradient-to-b from-black/95 via-black/90 to-black/95",
          "border-r border-white/5 backdrop-blur-xl"
        )}>
          <div className="flex items-center gap-2 xl:gap-2.5 2xl:gap-3 px-2 xl:px-2.5 2xl:px-3">
            <div className="p-2 xl:p-2.5 2xl:p-3 rounded-xl xl:rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
              <Sparkles className="w-4 h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 text-purple-400" />
            </div>
            <h2 className="text-base xl:text-lg 2xl:text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Profile Settings
            </h2>
          </div>

          <nav className="space-y-1.5 xl:space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                custom={index}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-2 xl:gap-2.5 2xl:gap-3 px-3 xl:px-3.5 2xl:px-4 py-2 xl:py-2.5 2xl:py-3 rounded-xl xl:rounded-xl",
                  "transition-all duration-200 group relative",
                  activeItem === item.label
                    ? "bg-gradient-to-r from-purple-950/50 to-blue-950/50 text-white border border-purple-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 transition-colors flex-shrink-0",
                  activeItem === item.label 
                    ? "text-purple-400" 
                    : "group-hover:text-purple-400"
                )} />
                <span className="font-medium text-sm xl:text-sm 2xl:text-base truncate">
                  {item.label}
                </span>
                {activeItem === item.label && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-xl xl:rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 -z-10 backdrop-blur-xl"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-10">
        <div className={cn(
          "bg-gradient-to-b from-black/95 to-black/90",
          "border-b border-white/5 backdrop-blur-xl",
          "p-1.5 sm:p-2"
        )}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2 p-1.5 sm:p-2 min-w-max">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={index}
                  custom={index}
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-xl whitespace-nowrap",
                    "transition-all duration-200 group relative",
                    activeItem === item.label
                      ? "bg-gradient-to-r from-purple-950/50 to-blue-950/50 text-white border border-purple-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 transition-colors flex-shrink-0",
                    activeItem === item.label 
                      ? "text-purple-400" 
                      : "group-hover:text-purple-400"
                  )} />
                  <span className="font-medium text-xs sm:text-sm">
                    {item.label}
                  </span>
                  {activeItem === item.label && (
                    <motion.div
                      layoutId="active-pill-mobile"
                      className="absolute inset-0 rounded-xl sm:rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 -z-10 backdrop-blur-xl"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}