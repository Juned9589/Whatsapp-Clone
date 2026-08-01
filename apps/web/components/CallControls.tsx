"use client";

interface CallControlsProps {
    isMicEnabled: boolean;
    isCameraEnabled?: boolean;
    showCamera?: boolean;

    toggleMicrophone: () => void;
    toggleCamera?: () => void;

    onEndCall: () => void;
}

export default function CallControls({
    isMicEnabled,
    isCameraEnabled = true,
    showCamera = false,
    toggleMicrophone,
    toggleCamera,
    onEndCall,
}: CallControlsProps) {
    return (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
            <button
                onClick={toggleMicrophone}
                className="rounded-full bg-gray-800 px-5 py-4 text-white"
            >
                {isMicEnabled ? "🎤" : "🔇"}
            </button>

            <button
                onClick={onEndCall}
                className="rounded-full bg-red-600 px-6 py-4 text-white"
            >
                📞
            </button>

            {showCamera && toggleCamera && (
                <button
                    onClick={toggleCamera}
                    className="rounded-full bg-gray-800 px-5 py-4 text-white"
                >
                    {isCameraEnabled ? "📹" : "🚫📹"}
                </button>
            )}
        </div>
    );
}