import { useState } from 'react';

import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';
import PortfolioPage from '../../../components/developer/portfolio/PortfolioPage';

const DevPortfolioPage = () => {
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
            <div className="max-w-[800px] mx-auto w-full"> 
                <PortfolioPage />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevPortfolioPage;