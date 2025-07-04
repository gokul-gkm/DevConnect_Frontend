'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { SessionHistory } from '@/components/user/Sessions/SessionHistory'
import Navbar from '@/components/layout/Navbar'
import { motion } from 'framer-motion'

export default function SessionHistoryPage() {
  const [activeItem, setActiveItem] = useState('Session History');

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <Navbar />
      </div>
      
      <div className="flex flex-col lg:flex-row pt-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-64 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] shrink-0"
        >
          <Sidebar 
            activeItem={activeItem} 
            setActiveItem={setActiveItem}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 w-full"
        >
          <SessionHistory />
        </motion.div>
      </div>
    </div>
  );
}