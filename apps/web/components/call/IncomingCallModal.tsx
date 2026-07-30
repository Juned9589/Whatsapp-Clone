"use client";

interface IncomingCallModalProps {
    callerName: string;
    onAccept: () => void;
    onReject: () => void;
}

export default function IncomingCallModal({
    callerName,
    onAccept,
    onReject,
}: IncomingCallModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-80 rounded-2xl bg-zinc-900 p-6 shadow-xl">
                <h2 className="text-center text-2xl font-semibold text-white">
                    Incoming Call
                </h2>

                <p className="mt-4 text-center text-gray-300">
                    {callerName}
                </p>

                <div className="mt-8 flex justify-between">
                    <button
                        onClick={onReject}
                        className="rounded-full bg-red-600 px-6 py-3 text-white"
                    >
                        Reject
                    </button>

                    <button
                        onClick={onAccept}
                        className="rounded-full bg-green-600 px-6 py-3 text-white"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}