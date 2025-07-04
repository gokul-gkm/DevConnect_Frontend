import { useQuery } from '@tanstack/react-query';
import { SessionCard } from './SessionCard';
import SessionApi from '@/service/Api/SessionApi';
import { Spinner } from '@/components/ui/spinner';

export function SessionsList() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: SessionApi.getUserSessions
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <div className="text-center p-8 text-zinc-400">
        No sessions found. Book a session to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          onPayment={() => {
            // Handle payment
          }}
          onCancel={() => {
            // Handle cancellation
          }}
        />
      ))}
    </div>
  );
}