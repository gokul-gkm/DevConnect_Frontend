import { useState } from 'react';
import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';
import DeveloperSessionHistory from '@/components/developer/sessions/DeveloperSessionHistory';

const DeveloperSessionHistoryPage = () => {
  const [_activeItem, setActiveItem] = useState('Sessions History');

  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex">
        <DeveloperProfileSidebar setActiveItem={setActiveItem} />
        <main className="flex-1 ">
          <div className="min-h-screen p-4 lg:p-8 pt-32 lg:pt-8">
            <div className="max-w-[1600px] mx-auto">
              <DeveloperSessionHistory />
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default DeveloperSessionHistoryPage;