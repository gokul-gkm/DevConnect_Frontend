'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import Navbar from '@/components/layout/Navbar'
import SessionDetails from '@/components/user/Sessions/SessionDetails'
import { motion } from 'framer-motion'

export default function SessionDetailsPage() {
  const [activeItem, setActiveItem] = useState('Upcoming Sessions');
 
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <Navbar />
      </div>
      
      <div className="pt-16">
        <div className="w-full">
          <Sidebar 
            activeItem={activeItem} 
            setActiveItem={setActiveItem}
          />
        </div>
        
        <div className="flex flex-col lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:w-64 shrink-0"
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
            className="flex-1 min-h-screen pt-4 lg:pt-8 px-0 lg:px-8 w-full"
          >
            <SessionDetails />
          </motion.div>
        </div>
      </div>
    </div>
  );
}