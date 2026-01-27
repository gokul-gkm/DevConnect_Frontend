import { createContext, useContext, useState } from "react";

interface CallContextValue {
  callAcknowledged: boolean;
  setCallAcknowledged: (v: boolean) => void;

  sessionActive: boolean;
  setSessionActive: (v: boolean) => void;
}

const CallContext = createContext<CallContextValue | null>(null);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [callAcknowledged, setCallAcknowledged] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  return (
    <CallContext.Provider
      value={{
        callAcknowledged,
        setCallAcknowledged,
        sessionActive,
        setSessionActive,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCallContext() {
  const ctx = useContext(CallContext);
  if (!ctx) {
    throw new Error("useCallContext must be used inside CallProvider");
  }
  return ctx;
}
