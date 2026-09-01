"use client";

import { formatDistanceToNow } from "date-fns";

interface ChatHeaderProps {
    selectedChat: any;
    currentUser: any;
    onlineUsers: Set<string>;
    isOtherTyping: boolean;

    onAudioCall: () => void;
    onVideoCall: () => void;
}

export default function ChatHeader({
    selectedChat,
    currentUser,
    onlineUsers,
    isOtherTyping,
    onAudioCall,
    onVideoCall,
}: ChatHeaderProps) {
    if (!selectedChat) return null;

    const otherUser = selectedChat.isGroup
        ? null
        : selectedChat.members.find(
            (m: any) => m._id !== currentUser?._id
        );

    return (
        <div className="p-4 border-b border-[#1E2E2C] flex items-center justify-between text-[#EAF6F2]">
            <div className="flex flex-col">
                <span className="font-medium">
                    {selectedChat.isGroup
                        ? selectedChat.groupName
                        : otherUser?.name}
                </span>

                {!selectedChat.isGroup && otherUser && (
                    <span className="text-xs text-[#7FA69B]">
                        {onlineUsers.has(otherUser._id)
                            ? "🟢 Online"
                            : `Last seen ${formatDistanceToNow(
                                new Date(otherUser.lastSeen),
                                {
                                    addSuffix: true,
                                }
                            )}`}
                    </span>
                )}
            </div>

            {isOtherTyping && (
                <div className="text-xs text-[#2DD4A7]">typing...</div>
            )}

            <div className="flex items-center gap-2">
                <button
                    onClick={onAudioCall}
                    className="rounded-full p-2 transition hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                    📞
                </button>

                <button
                    onClick={onVideoCall}
                    className="rounded-full bg-[#2DD4A7] px-4 py-2 text-black"
                >
                    📹
                </button>
            </div>
        </div>
    );
}