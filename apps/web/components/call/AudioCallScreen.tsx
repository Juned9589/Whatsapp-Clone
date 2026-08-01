"use client";

import { useEffect, useState } from "react";
import CallTimer from "../CallTimer";
import CallControls from "../CallControls";


interface AudioCallScreenProps {
    userName: string;
    userImage?: string;

    isMicEnabled: boolean;

    toggleMicrophone: () => void;

    onEndCall: () => void;
}

export default function AudioCallScreen({
    userName,
    userImage,
    isMicEnabled,
    toggleMicrophone,
    onEndCall,
}: AudioCallScreenProps) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white">

            <img
                src={userImage || "/avatar.png"}
                alt={userName}
                className="h-36 w-36 rounded-full object-cover"
            />

            <h2 className="mt-6 max-w-[90%] break-words text-center text-3xl font-semibold">
                {userName}
            </h2>

            <p className="mt-2 text-zinc-400">
                Audio Call
            </p>

            <div className="mt-20">
                <CallTimer duration={duration} />
            </div>

            <CallControls
                isMicEnabled={isMicEnabled}
                toggleMicrophone={toggleMicrophone}
                onEndCall={onEndCall}
            />

        </div>
    );
}