"use client";

interface CallTimerProps {
    duration: number;
}

export default function CallTimer({
    duration,
}: CallTimerProps) {
    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
            {Math.floor(duration / 60)
                .toString()
                .padStart(2, "0")}
            :
            {(duration % 60)
                .toString()
                .padStart(2, "0")}
        </div>
    );
}