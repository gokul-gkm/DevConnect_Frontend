import { useEffect, useState } from 'react';
import { socketService } from '@/service/socket/socketService';
import { Wifi, WifiOff } from 'lucide-react';

export const SocketStatusIndicator = () => {
    const [isConnected, setIsConnected] = useState(socketService.isConnected());
    console.log("isConnected SSIndicator : ", isConnected)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
    
    return (
        <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-zinc-800 bg-black/95 backdrop-blur-sm p-4">
            <div className={`flex items-center gap-2 p-3 rounded-xl ${isConnected ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Offline'}</span>
            </div>
        </div>
    );
};
