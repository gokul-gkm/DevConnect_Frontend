import { useEffect, useState } from 'react';
import DeveloperProfile from '@/components/developer/profile/DevProfile';
import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';

const DeveloperProfilePage = () => {
  const [activeItem, setActiveItem] = useState('Profile');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          <DeveloperProfileSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
          <DeveloperProfile />
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperProfilePage;