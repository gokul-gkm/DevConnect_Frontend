'use client'

import {  useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { UpcomingSessions } from '@/components/user/Sessions/UpcomingSessions'
import Navbar from '@/components/layout/Navbar'

export default function UpcomingSessionsPage() {
  const [activeItem, setActiveItem] = useState('Upcoming Sessions');
 
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex mt-16">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
        />
        <UpcomingSessions />
      </div>
    </>
  );
}