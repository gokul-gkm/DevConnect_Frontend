import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/ProfileSidebar'
import { EditProfile } from '@/components/user/Profile/EditProfile'
import Navbar from '@/components/layout/Navbar'
import { useProfile } from '@/hooks/profile/useProfile';
import LoadingSpinner from '@/components/ui/LoadingSpinner'

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
      <LoadingSpinner
        size="lg"
        text="Loading edit profile..."
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