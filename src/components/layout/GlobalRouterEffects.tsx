import { Outlet } from "react-router-dom";
import { useIncomingCall } from "@/hooks/videoCall/useIncomingCall";
import { useEffect } from "react";

export default function GlobalRouterEffects() {
  console.log("📞 [GlobalRouterEffects] Component mounted");
  
  useEffect(() => {
    console.log("📞 [GlobalRouterEffects] useEffect - Calling useIncomingCall");
    return () => {
      console.log("📞 [GlobalRouterEffects] Component unmounting");
    };
  }, []);

  useIncomingCall();
  return <Outlet />;
}