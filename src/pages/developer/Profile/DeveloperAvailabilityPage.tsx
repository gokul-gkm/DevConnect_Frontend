import { useState } from 'react';
import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';
import AvailabilitySettings from '@/components/developer/profile/AvailabilitySettings';

const DeveloperAvailabilityPage = () => {
  const [_activeItem, setActiveItem] = useState('Availability');

  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row">
          <DeveloperProfileSidebar  setActiveItem={setActiveItem} />
          <div className="flex-1 flex justify-center">
            <AvailabilitySettings />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperAvailabilityPage;
