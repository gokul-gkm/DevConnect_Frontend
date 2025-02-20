'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { UserProfile } from '@/components/user/Profile/UserProfile'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useProfile } from '@/hooks/profile/useProfile'
import { useLocation } from 'react-router-dom'

export default function UserProfilePage() {
  const [activeItem, setActiveItem] = useState('Profile');
  const location = useLocation();
  const { profile: userData, refetch,isLoading, error, isError } = useProfile();

  useEffect(() => {
    refetch();
  }, [location.pathname]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-black text-white flex mt-16">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
        />
        <UserProfile 
          userData={userData}
        />
      </div>
    </>
  )
}