"use client";



interface ChatInputProps {
    messageText: string;
    setMessageText: React.Dispatch<React.SetStateAction<string>>;

    handleSendMessage: () => void;
    handleFileUpload: (file: File) => void;

    fileInputRef: React.RefObject<HTMLInputElement | null>;

    selectedChat: any;
    socketRef: any;
    typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
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
}: ChatInputProps) {
    return (
        <div className="p-4 border-t border-[#1E2E2C] flex gap-2">

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
                className="text-[#7FA69B] hover:text-[#2DD4A7] px-2"
            >
                📎
            </button>

            <input
                value={messageText}
                onChange={(e) => {
                    setMessageText(e.target.value);

                    if (selectedChat && socketRef.current) {
                        socketRef.current.emit(
                            "typing:start",
                            selectedChat._id
                        );

                        if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                        }

                        typingTimeoutRef.current = setTimeout(() => {
                            socketRef.current?.emit(
                                "typing:stop",
                                selectedChat._id
                            );
                        }, 1500);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-[#121D1C] border border-[#1E2E2C] rounded-full px-4 py-2 text-[#EAF6F2] placeholder:text-[#4A6660] focus:outline-none focus:ring-2 focus:ring-[#2DD4A7]"
            />

            <button
                onClick={handleSendMessage}
                className="bg-[#2DD4A7] text-[#0B1414] px-6 py-2 rounded-full font-medium"
            >
                Send
            </button>

        </div>
    );
}