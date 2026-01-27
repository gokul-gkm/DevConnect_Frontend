import { useEffect, useRef } from "react";

export function useAudioUnlock(onUnlocked?: () => void) {
  const unlockedRef = useRef(false);
  const callbackRef = useRef(onUnlocked);

  useEffect(() => {
    callbackRef.current = onUnlocked;
  }, [onUnlocked]);

  useEffect(() => {
    const unlock = async () => {
      if (unlockedRef.current) return;

      try {

        const audio = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="
        );
        audio.volume = 0;
        await audio.play();
        audio.pause();
      } catch {

      }

      unlockedRef.current = true;
      callbackRef.current?.();

      removeListeners();
    };

    const removeListeners = () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("mousedown", unlock);
    };

    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    document.addEventListener("touchstart", unlock);
    document.addEventListener("mousedown", unlock);

    return removeListeners;
  }, []);
}
