'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { UserProfile } from '@/components/user/Profile/UserProfile'
import Navbar from '@/components/layout/Navbar'
import { useProfile } from '@/hooks/profile/useProfile'
import { useLocation } from 'react-router-dom'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function UserProfilePage() {
  const [activeItem, setActiveItem] = useState('Profile');
  const location = useLocation();
  const { profile: userData, refetch,isLoading, error, isError } = useProfile();

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Loading profile..."
        color="white"
        bgColor="dark"
        fullScreen={true}
      />
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