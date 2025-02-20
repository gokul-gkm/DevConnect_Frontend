import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Calendar, DollarSign, Tag } from 'lucide-react';
import { Session } from '@/types/session';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/shadcn-button';

interface SessionCardProps {
  session: Session;
  onPayment?: () => void;
  onCancel?: () => void;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  awaiting_payment: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
};

export function SessionCard({ session, onPayment, onCancel }: SessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">{session.title}</h3>
          <p className="text-sm text-zinc-400 mt-1">{session.description}</p>
        </div>
        <Badge className={statusColors[session.status]}>
          {session.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(session.sessionDate), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Clock className="w-4 h-4" />
          <span>
            {format(new Date(session.startTime), 'hh:mm a')} ({session.duration} mins)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <DollarSign className="w-4 h-4" />
        <span>${session.price}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {session.topics.map((topic) => (
          <div
            key={topic}
            className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-full"
          >
            <Tag className="w-3 h-3" />
            {topic}
          </div>
        ))}
      </div>

      {session.status === 'awaiting_payment' && onPayment && (
        <Button
          onClick={onPayment}
          className="w-full"
        >
          Make Payment
        </Button>
      )}

      {session.status === 'pending' && onCancel && (
        <Button
          onClick={onCancel}
          variant="destructive"
          className="w-full"
        >
          Cancel Request
        </Button>
      )}

      {session.status === 'rejected' && session.rejectionReason && (
        <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
          <strong>Rejection Reason:</strong> {session.rejectionReason}
        </div>
      )}
    </motion.div>
  );
}