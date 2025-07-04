'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import Navbar from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import { UserWallet } from '@/components/user/payments/UserWallet'

export default function UserWalletPage() {
  const [activeItem, setActiveItem] = useState('Wallet');
 
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-0 h-screen w-64 shrink-0 mt-20"
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
          className="flex-1 min-h-screen pt-16 px-8"
        >
          <UserWallet />
        </motion.div>
      </div>
    </div>
  );
}