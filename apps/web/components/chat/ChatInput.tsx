"use client";

import ReplyPreview from "./ReplyPreview";

interface ChatInputProps {
    messageText: string;
    setMessageText: React.Dispatch<React.SetStateAction<string>>;

    handleSendMessage: () => void;
    handleFileUpload: (file: File) => void;

    fileInputRef: React.RefObject<HTMLInputElement | null>;

    selectedChat: any;
    socketRef: any;
    typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;

    replyMessage: any;
    setReplyMessage: React.Dispatch<React.SetStateAction<any>>;
}

export default function ChatInput({
    messageText,
    setMessageText,
    handleSendMessage,
    handleFileUpload,
    fileInputRef,
    selectedChat,
    socketRef,
    typingTimeoutRef,
    replyMessage,
    setReplyMessage,
}: ChatInputProps) {
    return (
        <div className="border-t border-[#1E2E2C] p-4">
            <ReplyPreview
                replyMessage={replyMessage}
                onCancel={() => setReplyMessage(null)}
            />

            <div className="flex gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                            handleFileUpload(file);
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 text-[#7FA69B] hover:text-[#2DD4A7]"
                >
                    📎
                </button>

                <input
                    value={messageText}
                    onChange={(e) => {
                        setMessageText(e.target.value);

                        if (selectedChat && socketRef.current) {
                            socketRef.current.emit("typing:start", selectedChat._id);

                            if (typingTimeoutRef.current) {
                                clearTimeout(typingTimeoutRef.current);
                            }

                            typingTimeoutRef.current = setTimeout(() => {
                                socketRef.current?.emit("typing:stop", selectedChat._id);
                            }, 1500);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-[#1E2E2C] bg-[#121D1C] px-4 py-2 text-[#EAF6F2] placeholder:text-[#4A6660] focus:outline-none focus:ring-2 focus:ring-[#2DD4A7]"
                />

                <button
                    onClick={handleSendMessage}
                    className="rounded-full bg-[#2DD4A7] px-6 py-2 font-medium text-[#0B1414]"
                >
                    Send
                </button>
            </div>
        </div>
    );
}