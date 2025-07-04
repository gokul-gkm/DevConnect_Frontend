import { motion } from 'framer-motion';
import { SessionsList } from '@/components/user/Sessions/SessionList';
import { Button } from '@/components/ui/shadcn-button';
import { useNavigate } from 'react-router-dom';

export default function SessionsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-100">My Sessions</h1>
          <Button
            onClick={() => navigate('/developers')}
          >
            Book New Session
          </Button>
        </div>

        <SessionsList />
      </motion.div>
    </div>
  );
}