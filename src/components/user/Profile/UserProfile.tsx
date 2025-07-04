'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Github, Linkedin, Twitter, Globe, MapPin, Phone, Clock
} from 'lucide-react'
import { UserData } from '@/types/types'
import { format } from 'date-fns';

interface UserProfileProps {
  userData: UserData;
}

export function UserProfile({ userData }: UserProfileProps) {
  
  return (
    <main className="flex-1 lg:ml-72">
      <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
            
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <Avatar className="w-32 h-32 ring-4 ring-purple-500/30 rounded-2xl">
                    <AvatarImage src={userData.profilePicture} className="object-cover" />
                    <AvatarFallback>{userData.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full ring-4 ring-black" />
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                        {userData.username}
                      </h1>
                      <p className="text-gray-400 mt-1">{userData.email}</p>
                    </div>
                    
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">{userData.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Member since {format(new Date(userData.createdAt), 'MMMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 rounded-2xl p-6 border border-purple-500/10 backdrop-blur-sm"
            >
              <h3 className="text-gray-400 text-sm">Total Sessions</h3>
              <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {userData.totalSessions || 0}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 rounded-2xl p-6 border border-blue-500/10 backdrop-blur-sm"
            >
              <h3 className="text-gray-400 text-sm">Member Since</h3>
              <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {format(new Date(userData.createdAt), 'MMMM dd, yyyy')}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Bio
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {userData.bio}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {userData.skills?.map((skill) => (
                <Badge 
                  key={skill}
                  className="bg-purple-500/10 text-purple-300 border-purple-500/20"
                >
                  {skill}
                </Badge>
              ))}
              {
                userData.skills.length==0 && <span className='text-xs text-gray-400'>Please add your skills</span>
              }
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Social Links
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData.socialLinks?.github && (
                <a 
                  href={userData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {userData.socialLinks?.linkedIn && (
                <a 
                  href={userData.socialLinks.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {userData.socialLinks?.twitter && (
                <a 
                  href={userData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              )}
              {userData.socialLinks?.portfolio && (
                <a 
                  href={userData.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}