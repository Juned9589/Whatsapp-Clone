"use client";

import { useState } from "react";

export interface IncomingCall {
  from: string;
  offer: RTCSessionDescriptionInit;
  type: "audio" | "video";

  caller: {
    id: string;
    name: string;
    image?: string;
  };
}

export function useCallState() {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  const [isInCall, setIsInCall] = useState(false);

  const [callStartTime, setCallStartTime] = useState<number | null>(null);

  const [activeCallType, setActiveCallType] = useState<
    "audio" | "video" | null
  >(null);

  return {
    incomingCall,
    setIncomingCall,

    isInCall,
    setIsInCall,

    callStartTime,
    setCallStartTime,

    activeCallType,
    setActiveCallType,
  };
}
