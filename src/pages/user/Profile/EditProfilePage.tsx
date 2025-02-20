import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { EditProfile } from '@/components/user/Profile/EditProfile'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useProfile } from '@/hooks/profile/useProfile';

export default  function EditProfilePage() {
  const [activeItem, setActiveItem] = useState('Edit Profile');
    const { profile: userData, isLoading,isError, error, updateProfile, isUpdating } = useProfile();
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
  
    const handleSave = (formData: FormData) => {
      updateProfile(formData);
    };
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (isError || !userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error?.message || 'Something went wrong'}</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex mt-16">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
        />
        <EditProfile 
          userData={userData}
          onSave={handleSave}
          isUpdating = {isUpdating}
        />
      </div>
    </>
  )
}