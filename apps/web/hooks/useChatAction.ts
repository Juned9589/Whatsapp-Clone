"use client";

interface UseChatActionsProps {
  socketRef: any;
  selectedChat: any;

  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;

  replyMessage: any;
  setReplyMessage: React.Dispatch<React.SetStateAction<any>>;

  queryClient: any;

  setSelectedChat: React.Dispatch<React.SetStateAction<any>>;

  setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;

  createGroup: any;

  groupName: string;
  setGroupName: React.Dispatch<React.SetStateAction<string>>;

  selectedMembers: string[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;

  setShowGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useChatActions({
  socketRef,
  selectedChat,
  messageText,
  setMessageText,
  replyMessage,
  setReplyMessage,
  queryClient,
  setSelectedChat,
  setShowNewChatModal,
  createGroup,
  groupName,
  setGroupName,
  selectedMembers,
  setSelectedMembers,
  setShowGroupModal,
}: UseChatActionsProps) {
  function handleSendMessage() {
    if (!messageText.trim() || !selectedChat) return;

    socketRef.current?.emit("message:send", {
      chatId: selectedChat._id,
      content: messageText,
      replyTo: replyMessage?._id || null,
    });

    socketRef.current?.emit("typing:stop", selectedChat._id);

    setMessageText("");
    setReplyMessage(null);
  }

  async function handleStartNewChat(user: any) {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: user._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      await queryClient.invalidateQueries({
        queryKey: ["chats"],
      });

      const refreshed = await queryClient.fetchQuery({
        queryKey: ["chats"],
      });

      const newChat = refreshed.chats.find((c: any) => c._id === data.chat._id);

      if (newChat) {
        setSelectedChat(newChat);
      }

      setShowNewChatModal(false);
    } catch (error) {
      console.error("Create chat failed:", error);
    }
  }

  function handleCreateGroup() {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    createGroup.mutate(
      {
        groupName,
        memberIds: selectedMembers,
      },
      {
        onSuccess: () => {
          setShowGroupModal(false);

          setGroupName("");

          setSelectedMembers([]);

          queryClient.invalidateQueries({
            queryKey: ["chats"],
          });
        },
      },
    );
  }

  return {
    handleSendMessage,
    handleStartNewChat,
    handleCreateGroup,
  };
}
