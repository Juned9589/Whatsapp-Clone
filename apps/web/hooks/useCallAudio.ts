import { useRef } from "react";

export function useCallAudio() {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const callingToneRef = useRef<HTMLAudioElement | null>(null);

  const playIncoming = () => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
      ringtoneRef.current.loop = true;
    }

    ringtoneRef.current.play().catch(() => {});
  };

  const stopIncoming = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  const playOutgoing = () => {
    if (!callingToneRef.current) {
      callingToneRef.current = new Audio("/sounds/calling.mp3");
      callingToneRef.current.loop = true;
    }

    callingToneRef.current.play().catch(() => {});
  };

  const stopOutgoing = () => {
    if (callingToneRef.current) {
      callingToneRef.current.pause();
      callingToneRef.current.currentTime = 0;
    }
  };

  return {
    playIncoming,
    stopIncoming,
    playOutgoing,
    stopOutgoing,
  };
}
