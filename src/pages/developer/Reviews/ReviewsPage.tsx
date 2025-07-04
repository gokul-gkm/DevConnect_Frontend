import { useEffect, useState } from 'react';
import {DeveloperReviews} from '@/components/developer/reviews/DeveloperReviews';
import { DeveloperProfileSidebar } from '@/components/layout/DevProfileSidebar';
import { motion } from 'framer-motion';

const ReviewsPage = () => {
  const [_activeItem, setActiveItem] = useState('Reviews');
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
        <div className="flex flex-col lg:flex-row">
          <DeveloperProfileSidebar  setActiveItem={setActiveItem} />
          <div className="flex-1 flex justify-center">
            <DeveloperReviews />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsPage;