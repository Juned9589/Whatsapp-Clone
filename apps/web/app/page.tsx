"use client";
import { useEffect, useState } from "react";
import { useChats } from "@/hooks/useChats";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSocket } from "@/hooks/useSocket";
import { useMessages } from "@/hooks/useMessages";
import { useQueryClient } from "@tanstack/react-query";



export default function Home() {
  const { data: chatsData, isLoading } = useChats();
  const { data: currentUserData } = useCurrentUser();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const socketRef = useSocket()
  const { data: messagesData } = useMessages(selectedChat?._id)
  const [messageText, setMessageText] = useState("")

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
      socketRef.current.emit("chat:join", selectedChat._id)
    }
  }, [selectedChat])

  function handleSendMessage() {
    if (!messageText.trim() || !selectedChat) return;
    socketRef.current?.emit("message:send", {
      chatId: selectedChat._id,
      content: messageText,
    });
    setMessageText("")
  }

  return (
    <div className="flex h-screen bg-[#0B1414]">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r border-[#1E2E2C] flex flex-col">
        <div className="p-4 border-b border-[#1E2E2C]">
          <h1 className="text-xl font-bold text-[#EAF6F2] font-[family-name:var(--font-display)]">
            Chats
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading && <p className="text-[#7FA69B] p-4">Loading...</p>}
          {chatsData?.chats?.map((chat: any) => {
            const otherMember = chat.members.find(
              (m: any) => m._id !== currentUserData?.userExist?._id
            );
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className="p-4 border-b border-[#1E2E2C] hover:bg-[#121D1C] cursor-pointer text-[#EAF6F2]"
              >
                {otherMember?.name || "Unknown"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat window area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#1E2E2C] text-[#EAF6F2]">
            {selectedChat.members.find(
              (m: any) => m._id !== currentUserData?.userExist?._id
            )?.name}
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
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#1E2E2C] flex gap-2">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
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
    </div>
  );
}