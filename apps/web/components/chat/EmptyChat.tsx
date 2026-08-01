"use client";

export default function EmptyChat() {
    return (
        <div className="flex flex-1 items-center justify-center bg-[#0B1414]">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#EAF6F2]">
                    Welcome to WhatsApp
                </h2>

                <p className="mt-2 text-[#7FA69B]">
                    Select a chat to start messaging.
                </p>
            </div>
        </div>
    );
}