import { useEffect } from "react";
import { socketService } from "@/service/socket/socketService";
import { useCallContext } from "@/contexts/CallContext";

export function useSessionRealtimeStatus(sessionId?: string) {
  const {
    callAcknowledged,
    setSessionActive,
  } = useCallContext();

  useEffect(() => {
    if (!sessionId) return;

    const handler = (data: any) => {
      if (data.sessionId !== sessionId) return;

      if (!callAcknowledged) return;

      setSessionActive(true);
    };

    const attach = async () => {
      await socketService.waitForConnection();
      socketService.on("video:session:initiated", handler);
    };

    attach();

    return () => {
      socketService.off("video:session:initiated", handler);
    };
  }, [sessionId, callAcknowledged]);
}
