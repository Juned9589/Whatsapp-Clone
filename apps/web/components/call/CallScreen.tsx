"use client";

import { useEffect, useState } from "react";

interface CallScreenProps {
    localVideoRef: React.RefObject<HTMLVideoElement>;
    remoteVideoRef: React.RefObject<HTMLVideoElement>;
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    onEndCall: () => void;
}

export default function CallScreen({
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    onEndCall,
}: CallScreenProps) {
    const [duration, setDuration] = useState(0);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Local video
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(console.error);
        }
    }, [localStream]);

    // Remote video
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch(console.error);
        }
    }, [remoteStream]);


    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Remote Video */}
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
                controls
                className="h-full w-full object-cover"
            />

            {/* Local Video */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                controls
                className="absolute bottom-6 right-6 h-48 w-36 rounded-xl border-2 border-white object-cover"
            />

            {/* Timer */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
                {Math.floor(duration / 60)
                    .toString()
                    .padStart(2, "0")}
                :
                {(duration % 60).toString().padStart(2, "0")}
            </div>

            {/* End Call Button */}
            <button
                onClick={onEndCall}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            >
                End Call
            </button>
        </div>
    );
}