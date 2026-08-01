"use client";

interface ChatMessagesProps {
    messages: any[];
    selectedChat: any;
    currentUser: any;
}

export default function ChatMessages({
    messages,
    selectedChat,
    currentUser,
}: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages?.map((msg: any) => {
                const isOwnMessage =
                    msg.sender === currentUser?._id;

                return (
                    <div
                        key={msg._id}
                        className={`flex ${isOwnMessage
                                ? "justify-end"
                                : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${isOwnMessage
                                    ? "bg-[#2DD4A7] text-[#0B1414]"
                                    : "bg-[#121D1C] text-[#EAF6F2]"
                                }`}
                        >
                            {selectedChat.isGroup &&
                                !isOwnMessage && (
                                    <div className="text-xs text-[#2DD4A7] mb-1">
                                        {
                                            selectedChat.members.find(
                                                (m: any) =>
                                                    m._id === msg.sender
                                            )?.name
                                        }
                                    </div>
                                )}

                            {msg.type === "image" ? (
                                <img
                                    src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${msg.content}`}
                                    alt="uploaded"
                                    className="rounded-lg max-w-full"
                                />
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}