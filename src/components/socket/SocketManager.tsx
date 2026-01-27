import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { socketService } from "@/service/socket/socketService";

export const SocketManager = () => {
  const { token } = useAuth();

  const initializedRef = useRef(false);

  useEffect(() => {
  if (!token) {
    initializedRef.current = false;
    socketService.logout();
    return;
  }
  console.log("👑Socket service connect SocketManager")

  socketService.connect(token);
}, [token]);

  return null;
};
