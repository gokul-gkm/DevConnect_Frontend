'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { SessionHistory } from '@/components/user/Sessions/SessionHistory'
import Navbar from '@/components/layout/Navbar'

export default function SessionHistoryPage() {
  const [activeItem, setActiveItem] = useState('Session History');

  return (
    <div className="min-h-screen bg-black mt-16">
      <Navbar />
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
        />

        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <SessionHistory />
          </div>
        </div>
      </div>
    </div>
  );
}