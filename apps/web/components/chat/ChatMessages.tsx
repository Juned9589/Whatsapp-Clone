"use client";

interface ChatMessagesProps {
    messages: any[];
    selectedChat: any;
    currentUser: any;
    setReplyMessage: React.Dispatch<React.SetStateAction<any>>;
}

export default function ChatMessages({
    messages,
    selectedChat,
    currentUser,
    setReplyMessage,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages?.map((msg: any) => {
                const isOwnMessage = msg.sender?._id === currentUser?._id;

                return (
                    <div
                        id={`message-${msg._id}`}
                        key={msg._id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setReplyMessage(msg);
                            }}
                            className={`max-w-xs rounded-2xl px-4 py-2 ${isOwnMessage
                                    ? "bg-[#2DD4A7] text-[#0B1414]"
                                    : "bg-[#121D1C] text-[#EAF6F2]"
                                }`}
                        >
                            {selectedChat.isGroup && !isOwnMessage && (
                                <div className="mb-1 text-xs text-[#2DD4A7]">
                                    {
                                        selectedChat.members.find(
                                            (m: any) => m._id === msg.sender?._id
                                        )?.name
                                    }
                                </div>
                            )}

                            {/* Reply Preview */}
                            {msg.replyTo && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const original = document.getElementById(
                                            `message-${msg.replyTo._id}`
                                        );

                                        if (original) {
                                            original.scrollIntoView({
                                                behavior: "smooth",
                                                block: "center",
                                            });

                                            original.classList.add("ring-2", "ring-[#25D366]");

                                            setTimeout(() => {
                                                original.classList.remove(
                                                    "ring-2",
                                                    "ring-[#25D366]"
                                                );
                                            }, 1500);
                                        }
                                    }}
                                    className="mb-2 w-full rounded-lg border-l-4 border-[#25D366] bg-black/10 px-3 py-2 text-left"
                                >
                                    <p className="text-xs font-semibold text-[#25D366]">
                                        {msg.replyTo.sender?.name || "Unknown"}
                                    </p>

                                    <p className="truncate text-xs opacity-80">
                                        {msg.replyTo.type === "image"
                                            ? "📷 Photo"
                                            : msg.replyTo.content}
                                    </p>
                                </button>
                            )}

                            {msg.type === "image" ? (
                                <img
                                    src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${msg.content}`}
                                    alt="uploaded"
                                    className="max-w-full rounded-lg"
                                />
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}