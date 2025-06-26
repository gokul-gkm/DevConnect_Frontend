import { Button } from '@/components/ui/shadcn-button';
import { PhoneOff } from 'lucide-react';

interface CallDisconnectedProps {
  error?: string | null;
  callDuration: number;
  formatDuration: (seconds: number) => string;
  onReturn: () => void;
}

export default function CallDisconnected({
  error,
  callDuration,
  formatDuration,
  onReturn,
}: CallDisconnectedProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl blur-2xl"></div>
        <div className="relative bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)] text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"></div>
            <div className="relative bg-zinc-900/80 rounded-full w-full h-full flex items-center justify-center border border-zinc-700/50">
              <PhoneOff className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-white mb-2">
            {error ? "Connection Failed" : "Call Ended"}
          </h2>
          {!error && (
            <p className="text-indigo-300 mb-1 text-sm font-medium">
              Duration: {formatDuration(callDuration)}
            </p>
          )}
          <p className="text-zinc-400 mb-6 text-sm">
            {error ? error : "The call has been disconnected"}
          </p>
          <Button
            onClick={onReturn}
            className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-2 px-6 mx-auto border border-zinc-700/50 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)]"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
