import { Outlet } from "react-router-dom";
import { useIncomingCall } from "@/hooks/videoCall/useIncomingCall";

export default function GlobalRouterEffects() {
  useIncomingCall();
  return <Outlet />;
}
