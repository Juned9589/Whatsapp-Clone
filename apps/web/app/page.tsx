"use client";
import { useEffect, useState, useRef } from "react";
import { useChats } from "@/hooks/useChats";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSocket } from "@/hooks/useSocket";
import { useMessages } from "@/hooks/useMessages";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "@/hooks/useUsers";
import { useCreateGroup } from "@/hooks/useCreateGroup";
import { useStatuses } from "@/hooks/useStatuses";
import { useCreateStatus } from "@/hooks/useCreateStatus";
import { useViewStatus } from "@/hooks/useViewStatus";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: chatsData, isLoading } = useChats();
  const { data: currentUserData } = useCurrentUser();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const socketRef = useSocket();
  const { data: messagesData } = useMessages(selectedChat?._id);
  const [messageText, setMessageText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { data: usersData } = useUsers();
  const createGroup = useCreateGroup();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { data: statusesData } = useStatuses();
  const createStatus = useCreateStatus();
  const viewStatus = useViewStatus();
  const [viewingStatus, setViewingStatus] = useState<any>(null);
  const statusFileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("message:receive", (message: any) => {
      queryClient.setQueryData(["messages", message.chatId], (old: any) => ({
        messages: [...(old?.messages || []), message],
      }));
    });

    return () => {
      socketRef.current?.off("message:receive");
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (selectedChat && socketRef.current) {
      socketRef.current.emit("chat:join", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("typing:start", (data: any) => {
      if (data.chatId === selectedChat?._id) {
        setIsOtherTyping(true);
      }
    });

    socketRef.current.on("typing:stop", (data: any) => {
      if (data.chatId === selectedChat?._id) {
        setIsOtherTyping(false);
      }
    });

    return () => {
      socketRef.current?.off("typing:start");
      socketRef.current?.off("typing:stop");
    };
  }, [socketRef.current, selectedChat]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("user:online", (data: any) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    });
    socketRef.current.on("online_users:list", (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    });

    socketRef.current.on("user:offline", (data: any) => {
      console.log("User online event:", data);

      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(data.userId);
        return updated;
      });
    });

    return () => {
      socketRef.current?.off("user:online");
      socketRef.current?.off("user:offline");
    };
  }, [socketRef.current]);

  async function handleFileUpload(file: File) {
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { uploadUrl, key } = await presignRes.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const fileType = file.type.startsWith("image/") ? "image" : "document";

      socketRef.current?.emit("message:send", {
        chatId: selectedChat._id,
        content: key,
        type: fileType,
      });
    } catch (error) {
      console.error("File upload error:", error);
    }
  }

  function handleSendMessage() {
    if (!messageText.trim() || !selectedChat) return;
    socketRef.current?.emit("message:send", {
      chatId: selectedChat._id,
      content: messageText,
    });
    socketRef.current?.emit("typing:stop", selectedChat._id);
    setMessageText("");
  }

  function handleCreateGroup() {
    if (!groupName.trim() || selectedMembers.length === 0) return
    createGroup.mutate(
      { groupName, memberIds: selectedMembers },
      {
        onSuccess: () => {
          setShowGroupModal(false)
          setGroupName("")
          setSelectedMembers([])
          queryClient.invalidateQueries({ queryKey: ["chats"] })
        }
      }
    )
  }
  async function handleStatusUpload(file: File) {
    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { uploadUrl, key } = await presignRes.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      createStatus.mutate(
        { mediaUrl: key },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
          },
        }
      );
    } catch (error) {
      console.error("Status upload error:", error);
    }
  }
  return (
    <div className="flex h-screen bg-[#0B1414]">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-[#1E2E2C] flex flex-col">
        <div className="p-4 border-b border-[#1E2E2C] flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#EAF6F2] font-[family-name:var(--font-display)]">
            Chats
          </h1>
          <button
            onClick={() => setShowGroupModal(true)}
            className="text-[#2DD4A7] text-2xl"
          >
            +
          </button>
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
              (m: any) => m._id !== currentUserData?.userExist?._id
            );
            const displayName = chat.isGroup ? chat.groupName : otherMember?.name;
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className="p-4 border-b border-[#1E2E2C] hover:bg-[#121D1C] cursor-pointer text-[#EAF6F2]"
              >
                {displayName || "Unknown"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat window area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Header — naam + typing indicator dono yahan grouped hain */}
          <div className="p-4 border-b border-[#1E2E2C] text-[#EAF6F2]">
            <div className="flex items-center gap-2">
              {selectedChat.isGroup
                ? selectedChat.groupName
                : selectedChat.members.find(
                  (m: any) => m._id !== currentUserData?.userExist?._id
                )?.name}
              {!selectedChat.isGroup &&
                onlineUsers.has(
                  selectedChat.members.find(
                    (m: any) => m._id !== currentUserData?.userExist?._id
                  )?._id
                ) && <span className="w-2 h-2 rounded-full bg-[#2DD4A7]" />}
            </div>
            {isOtherTyping && (
              <div className="text-xs text-[#2DD4A7]">typing...</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messagesData?.messages?.map((msg: any) => {
              const isOwnMessage = msg.sender === currentUserData?.userExist?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${isOwnMessage
                      ? "bg-[#2DD4A7] text-[#0B1414]"
                      : "bg-[#121D1C] text-[#EAF6F2]"
                      }`}
                  >
                    {selectedChat.isGroup && !isOwnMessage && (
                      <div className="text-xs text-[#2DD4A7] mb-1">
                        {selectedChat.members.find((m: any) => m._id === msg.sender)?.name}
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

          <div className="p-4 border-t border-[#1E2E2C] flex gap-2">

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#7FA69B] hover:text-[#2DD4A7] px-2"
              type="button"
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-[#7FA69B]">
          Select a chat to start messaging
        </div>
      )}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121D1C] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-[#EAF6F2] text-lg font-bold mb-4">Create Group</h2>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full bg-[#0B1414] border border-[#1E2E2C] rounded-lg px-3 py-2 text-[#EAF6F2] mb-4"
            />
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {usersData?.users?.map((user: any) => (
                <label key={user._id} className="flex items-center gap-2 text-[#EAF6F2]">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers((prev) => [...prev, user._id]);
                      } else {
                        setSelectedMembers((prev) => prev.filter((id) => id !== user._id));
                      }
                    }}
                  />
                  {user.name}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGroupModal(false)}
                className="flex-1 bg-[#1E2E2C] text-[#EAF6F2] py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 bg-[#2DD4A7] text-[#0B1414] py-2 rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>

        </div>

      )}
      {viewingStatus && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          onClick={() => setViewingStatus(null)}
        >
          <div className="max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-[#2DD4A7] flex items-center justify-center text-black font-bold">
                {viewingStatus.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[#EAF6F2] font-medium">{viewingStatus.userId.name}</p>
                <p className="text-xs text-[#7FA69B]">
                  {formatDistanceToNow(new Date(viewingStatus.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <img
              src={`https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${viewingStatus.mediaUrl}`}
              alt="status"
              className="w-full rounded-lg"
            />
            {viewingStatus.caption && (
              <p className="text-[#EAF6F2] text-center mt-3">{viewingStatus.caption}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}