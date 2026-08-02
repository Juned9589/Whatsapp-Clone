"use client";

import { formatDistanceToNow } from "date-fns";

interface ChatSidebarProps {
    isLoading: boolean;

    chatsData: any;
    currentUser: any;

    selectedChat: any;
    setSelectedChat: (chat: any) => void;

    showGroupModal: boolean;
    setShowGroupModal: (value: boolean) => void;

    statusesData: any;
    usersData: any;

    statusFileInputRef: React.RefObject<HTMLInputElement | null>;

    handleStatusUpload: (file: File) => void;

    setViewingStatus: (status: any) => void;

    viewStatus: any;
    showNewChatModal: boolean
    SetShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatSidebar({
    isLoading,
    chatsData,
    currentUser,
    setSelectedChat,
    setShowGroupModal,
    statusesData,
    statusFileInputRef,
    handleStatusUpload,
    setViewingStatus,
    viewStatus,
    showNewChatModal,
    SetShowNewChatModal
}: ChatSidebarProps) {
    return (
        <div className="w-full md:w-96 border-r border-[#1E2E2C] flex flex-col">
            <div className="p-4 border-b border-[#1E2E2C] flex items-center justify-between">
                <h1 className="text-xl font-bold text-[#EAF6F2]">
                    Chats
                </h1>

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => SetShowNewChatModal(true)}
                        className="text-xl"
                        title="New Chat"
                    >
                        💬
                    </button>

                    <button
                        onClick={() => setShowGroupModal(true)}
                        className="text-[#2DD4A7] text-2xl"
                        title="Create Group"
                    >
                        +
                    </button>

                </div>
            </div>
            <div className="border-b border-[#1E2E2C] p-4">
                <h2 className="mb-3 text-sm font-semibold text-[#7FA69B]">
                    Status
                </h2>

                {/* My Status */}

                <button
                    onClick={() => statusFileInputRef.current?.click()}
                    className="mb-3 flex w-full items-center gap-3 rounded-lg p-2 hover:bg-[#121D1C]"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2DD4A7] text-black">
                        +
                    </div>

                    <div className="text-left">
                        <p className="text-[#EAF6F2]">
                            My Status
                        </p>

                        <p className="text-xs text-[#7FA69B]">
                            Add a status
                        </p>
                    </div>
                </button>

                <input
                    ref={statusFileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                            handleStatusUpload(file);
                        }
                    }}
                />
            </div>
            <div className="mt-4">
                <p className="text-xs text-[#7FA69B] mb-2 uppercase">
                    Recent Updates
                </p>

                <div className="space-y-2">
                    {statusesData?.statuses?.map((status: any) => (
                        <button
                            key={status._id}
                            onClick={() => {
                                setViewingStatus(status);
                                viewStatus.mutate(status._id);
                            }}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#121D1C]"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#2DD4A7] flex items-center justify-center text-black font-bold">
                                {status.userId.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <p className="text-[#EAF6F2] font-medium">
                                    {status.userId.name}
                                </p>

                                <p className="text-xs text-[#7FA69B]">
                                    {formatDistanceToNow(new Date(status.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {isLoading && <p className="text-[#7FA69B] p-4">Loading...</p>}
                {chatsData?.chats?.map((chat: any) => {
                    const otherMember = chat.members.find(
                        (m: any) => m._id !== currentUser?._id
                    );
                    const displayName = chat.isGroup ? chat.groupName : otherMember?.name;
                    return (
                        <div
                            key={chat._id}
                            onClick={() => { console.log(chat); setSelectedChat(chat) }}
                            className="p-4 border-b border-[#1E2E2C] hover:bg-[#121D1C] cursor-pointer text-[#EAF6F2]"
                        >
                            {displayName || "Unknown"}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}