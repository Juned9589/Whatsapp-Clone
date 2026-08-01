"use client";

import { useEffect, useState } from "react";
import CallTimer from "../CallTimer";
import CallControls from "../CallControls";



interface CallScreenProps {
    localVideoRef: React.RefObject<HTMLVideoElement>;
    remoteVideoRef: React.RefObject<HTMLVideoElement>;
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    onEndCall: () => void;
    toggleMicrophone: () => void;
    toggleCamera: () => void;
    isMicEnabled: boolean;
    isCameraEnabled: boolean
}

export default function CallScreen({
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    onEndCall,
    toggleMicrophone,
    toggleCamera,
    isMicEnabled,
    isCameraEnabled
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

                className="h-full w-full object-cover"
            />

            {/* Local Video */}
            <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline

                className="absolute bottom-6 right-6 h-48 w-36 rounded-xl border-2 border-white object-cover"
            />

            {/* Timer */}
            <CallTimer duration={duration} />

            {/* End Call Button */}
            <CallControls
                isMicEnabled={isMicEnabled}
                isCameraEnabled={isCameraEnabled}
                showCamera
                toggleMicrophone={toggleMicrophone}
                toggleCamera={toggleCamera}
                onEndCall={onEndCall}
            />
        </div>
    );
}