"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UseCallSocketProps {
  socketRef: any;

  playIncoming: () => void;
  stopIncoming: () => void;
  playOutgoing: () => void;
  stopOutgoing: () => void;

  setIncomingCall: any;
  setActiveCallType: any;

  setCallStartTime: any;
  setIsInCall: any;

  closeConnection: () => Promise<void>;
  addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
  setRemoteAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;

  callTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useCallSocket({
  socketRef,
  playIncoming,
  stopIncoming,
  playOutgoing,
  stopOutgoing,
  setIncomingCall,
  setActiveCallType,
  setCallStartTime,
  setIsInCall,
  closeConnection,
  addIceCandidate,
  setRemoteAnswer,
  callTimeoutRef,
}: UseCallSocketProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("message:receive", (message: any) => {
      queryClient.setQueryData(["messages", message.chatId], (old: any) => ({
        messages: [...(old?.messages || []), message],
      }));

      socketRef.current?.emit("message:delivered", {
        messageId: message._id,
      });
    });

    socketRef.current.on("message:reaction_update", (updatedMessage: any) => {
      queryClient.setQueryData(
        ["messages", updatedMessage.chatId],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            messages: old.messages.map((msg: any) =>
              msg._id === updatedMessage._id ? updatedMessage : msg,
            ),
          };
        },
      );
    });

    socketRef.current.on("message:delete_update", (updatedMessage: any) => {
      queryClient.setQueryData(
        ["messages", updatedMessage.chatId],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            messages: old.messages.map((msg: any) =>
              msg._id === updatedMessage._id ? updatedMessage : msg,
            ),
          };
        },
      );
    });

    return () => {
      socketRef.current?.off("message:receive");
      socketRef.current?.off("message:reaction_update");
      socketRef.current?.off("message:delete_update");
    };
  }, [queryClient]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current?.on("CALL_OFFER", ({ from, offer, caller, type }) => {
      playIncoming();
      setActiveCallType(type);
      setIncomingCall({
        from,
        offer,
        caller,
        type,
      });
    });

    return () => {
      socketRef.current?.off("CALL_OFFER");
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("CALL_ANSWER", async ({ answer }) => {
      stopOutgoing();

      //  Clear caller timeout
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }

      await setRemoteAnswer(answer);

      // Call actually connected now
      setCallStartTime(Date.now());

      console.log("Call answered");
    });

    return () => {
      socketRef.current?.off("CALL_ANSWER");
    };
  }, [socketRef.current, setRemoteAnswer]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("ICE_CANDIDATE", async ({ candidate }) => {
      try {
        await addIceCandidate(candidate);
      } catch (error) {
        console.error("Failed to add ICE candidate:", error);
      }
    });

    return () => {
      socketRef.current?.off("ICE_CANDIDATE");
    };
  }, [socketRef.current, addIceCandidate]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("CALL_END", ({ cancelled }) => {
      stopIncoming();
      stopOutgoing();

      closeConnection();

      if (cancelled) {
        setIncomingCall(null);
      }

      setIncomingCall(null);
      setCallStartTime(null);
      setIsInCall(false);
    });

    socketRef.current.on("CALL_REJECT", () => {
      console.log("CALL_REJECT received");

      stopIncoming();
      stopOutgoing();

      closeConnection();

      setIncomingCall(null);
      setCallStartTime(null);
      setIsInCall(false);

      alert("Call Rejected");
    });

    socketRef.current.on("CALL_BUSY", () => {
      console.log("CALL_BUSY received");

      stopOutgoing();
      stopIncoming();

      closeConnection();

      setIncomingCall(null);
      setCallStartTime(null);
      setIsInCall(false);

      alert("User is busy");
    });

    return () => {
      socketRef.current?.off("CALL_END");
      socketRef.current?.off("CALL_REJECT");
      socketRef.current?.off("CALL_BUSY");
    };
  }, [socketRef.current, closeConnection]);
}
