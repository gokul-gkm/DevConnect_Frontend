import { useEffect, useRef } from "react";

export function useAudioUnlock(onUnlocked?: () => void) {
  const unlocked = useRef(false);

  useEffect(() => {
    const unlock = async () => {
      if (unlocked.current) return;

      try {
        const audio = new Audio(
          "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAA=="
        );
        await audio.play();
        unlocked.current = true;
        console.log("🔓 Audio unlocked");
        onUnlocked?.();
      } catch {}

      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);
}
