import { useState } from 'react';
import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';
import AddProject from '@/components/developer/portfolio/AddProject';

const AddProjectPage = () => {
  const [activeItem, setActiveItem] = useState('Profile');

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
          <div className="flex-1 p-6">
            <div className="max-w-[800px] mx-auto w-full"> 
              <AddProject />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProjectPage;