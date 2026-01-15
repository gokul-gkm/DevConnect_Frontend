import { useRef, useState } from "react";
import axiosClient from "@/service/axiosinstance/axios";

export const useCheckUsername = (excludeUserId?: string) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const checkUsername = async (username: string) => {
    if (!username) {
      setIsAvailable(null);
      return;
    }

    const normalizedUsername = username

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsChecking(true);

    try {
      const res = await axiosClient.get(
        `/auth/check-username?username=${normalizedUsername}&excludeUserId=${excludeUserId}`,
        { signal: controller.signal }
      );

      setIsAvailable(res.data.available);
    } catch (error: any) {
      if (error.name !== "CanceledError" && error.name !== "AbortError") {
        setIsAvailable(null);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const resetUsernameCheck = () => {
    abortControllerRef.current?.abort();
    setIsAvailable(null);
    setIsChecking(false);
  };

  return {
    checkUsername,
    resetUsernameCheck,
    isChecking,
    isAvailable,
  };
};
