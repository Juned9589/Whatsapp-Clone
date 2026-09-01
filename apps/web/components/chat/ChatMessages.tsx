"use client";
import { useState } from "react";
import MessageContextMenu from "./MessageContextMenu";
interface ChatMessagesProps {
    messages: any[];
    selectedChat: any;
    currentUser: any;
    setReplyMessage: React.Dispatch<React.SetStateAction<any>>;
    socketRef: any
}

export default function ChatMessages({
    messages,
    selectedChat,
    currentUser,
    setReplyMessage,
    socketRef,
}: ChatMessagesProps) {
    const [showReactionFor, setShowReactionFor] = useState<string | null>(null);
    const emojis = ["😀", "😂", "❤️", "👍", "😮", "😢", "🙏"];
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        message: any;
    } | null>(null);

    const [reactionPosition, setReactionPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);

    function groupReactions(reactions: any[] = []) {
        const grouped: Record<string, number> = {};




        reactions.forEach((reaction) => {
            grouped[reaction.emoji] = (grouped[reaction.emoji] || 0) + 1;
        });

        return Object.entries(grouped);
    }
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
                            className="relative"

                        >
                            <div
                                onContextMenu={(e) => {
                                    e.preventDefault();

                                    setContextMenu({
                                        x: e.clientX,
                                        y: e.clientY,
                                        message: msg,
                                    });
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

                                {/* Selected Reactions */}
                                {msg.reactions?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {groupReactions(msg.reactions).map(([emoji, count]) => (
                                            <div
                                                key={emoji}
                                                className="flex items-center gap-1 rounded-full bg-[#1E2E2C] px-2 py-1 text-xs"
                                            >
                                                <span>{emoji}</span>
                                                <span>{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {contextMenu && (
                            <MessageContextMenu
                                x={contextMenu.x}
                                y={contextMenu.y}
                                onClose={() => {
                                    setContextMenu(null);
                                }}
                                onReply={() => {
                                    setReplyMessage(contextMenu.message);
                                    setContextMenu(null);
                                }}
                                onReact={() => {
                                    setShowReactionFor(contextMenu.message._id)

                                    setReactionPosition({
                                        x: contextMenu.x,
                                        y: contextMenu.y - 60,
                                    })
                                    setContextMenu(null);
                                }}
                                onCopy={() => {
                                    navigator.clipboard.writeText(
                                        contextMenu.message.content || ""
                                    );
                                    setContextMenu(null);
                                }}
                                onForward={() => {
                                    console.log("Forward", contextMenu.message);
                                    setContextMenu(null);
                                }}
                                onDelete={() => {
                                    socketRef.current?.emit("message:delete", {
                                        messageId: contextMenu.message._id,
                                    });

                                    setContextMenu(null);
                                }}
                            />
                        )}

                        {showReactionFor && (
                            <div className="fixed z-[60] flex gap-1 rounded-full border border-[#2DD4A7]/20 bg-[#121D1C] px-2 py-1 shadow-xl"
                                style={{
                                    left: reactionPosition?.x ?? 0,
                                    top: reactionPosition?.y ?? 0,
                                }}
                            >
                                {["😀", "😂", "❤️", "👍", "😮", "😢", "🙏"].map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            socketRef.current?.emit("message:reaction", {
                                                messageId: showReactionFor,
                                                emoji,
                                            });

                                            setShowReactionFor(null);
                                            setReactionPosition(null)
                                        }}
                                        className="rounded-full p-1 text-lg transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}