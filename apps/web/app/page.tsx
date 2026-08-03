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
import { useWebRTC } from "@/hooks/useWebRTC";
import IncomingCallModal from "@/components/call/IncomingCallModal";
import CallScreen from "@/components/call/CallScreen";
import { useCallAudio } from "@/hooks/useCallAudio";
import AudioCallScreen from "@/components/call/AudioCallScreen";
import { useCallState } from "@/hooks/useCallState";
import { useCallSocket } from "@/hooks/useCallSocket";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatSidebar from "@/components/chat/ChatSidebar";
import GroupModal from "@/components/group/GroupModal";
import StatusViewer from "@/components/status/StatusViewer";
import EmptyChat from "@/components/chat/EmptyChat";
import NewChatModal from "@/components/chat/NewChatModal";
import { useChatActions } from "@/hooks/useChatAction";
import { useUpload } from "@/hooks/useUpload";
import { useStatus } from "@/hooks/useStatus";



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



  const {
    incomingCall,
    setIncomingCall,

    isInCall,
    setIsInCall,

    callStartTime,
    setCallStartTime,

    activeCallType,
    setActiveCallType,
  } = useCallState();

  const {
    startLocalStream,
    createPeerConnection,
    addLocalTracks,
    createOffer,
    createAnswer,
    registerIceCandidateHandler,
    registerTrackHandler,
    setRemoteAnswer,
    addIceCandidate,
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isMicEnabled,
    isCameraEnabled,
    toggleMicrophone,
    toggleCamera,
    closeConnection,
  } = useWebRTC();

  const {
    playIncoming,
    stopIncoming,
    playOutgoing,
    stopOutgoing
  } = useCallAudio()

  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  const {
    handleSendMessage,
    handleStartNewChat,
    handleCreateGroup,
  } = useChatActions({
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
  });

  const { handleFileUpload } = useUpload({
    socketRef,
    selectedChat,
  });

  const { handleStatusUpload } = useStatus({
    createStatus,
    queryClient,
  });

  useCallSocket({
    socketRef,

    playIncoming,
    stopIncoming,
    playOutgoing,
    stopOutgoing,

    setIncomingCall,
    setActiveCallType,

    setCallStartTime,
    setIsInCall,

    closeConnection,
    addIceCandidate,
    setRemoteAnswer,

    callTimeoutRef,
  });



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


  async function handleStartCall(type: "audio" | "video") {
    setActiveCallType(type)
    if (!selectedChat) {
      console.log("selectedChat is null");
      return;
    }

    if (!socketRef.current) {
      console.log("socket is null");
      return;
    }

    const otherUser = selectedChat.members.find(
      (m: any) => m._id !== currentUserData?.userExist?._id
    );
    console.log("otherUser:", otherUser)
    if (!otherUser) return;
    playOutgoing();
    const stream = await startLocalStream(type);

    createPeerConnection();

    registerTrackHandler();

    registerIceCandidateHandler((candidate) => {
      socketRef.current?.emit("ICE_CANDIDATE", {
        to: otherUser._id,
        candidate,
      });
    });

    addLocalTracks(stream);

    const offer = await createOffer();

    socketRef.current.emit("CALL_OFFER", {
      to: otherUser._id,
      offer,
      type: type,
      caller: {
        id: currentUserData?.userExist?._id,
        name: currentUserData?.userExist?.name,
        image: currentUserData?.userExist?.avatar  // ya avatar/profileImage jo bhi field ho
      },
    });

    setIsInCall(true);


    callTimeoutRef.current = setTimeout(() => {
      handleNoAnswer(otherUser._id);
    }, 30000);
  }

  async function handleAcceptCall() {
    stopIncoming()
    if (!incomingCall || !socketRef.current) return;

    try {
      console.log("incomingCall.type:", incomingCall.type);
      const stream = await startLocalStream(incomingCall.type);

      setActiveCallType(incomingCall.type)
      createPeerConnection();

      registerTrackHandler();

      registerIceCandidateHandler((candidate) => {
        socketRef.current?.emit("ICE_CANDIDATE", {
          to: incomingCall.from,
          candidate,
        });
      });

      addLocalTracks(stream);

      const answer = await createAnswer(incomingCall.offer);

      socketRef.current.emit("CALL_ANSWER", {
        to: incomingCall.from,
        answer,
      });

      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }

      setIncomingCall(null);
      setIsInCall(true);

      console.log("Call accepted");
    } catch (error) {
      console.error("Accept call failed:", error);
    }
  }

  async function handleRejectCall() {
    if (!incomingCall) return;

    stopIncoming();

    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    socketRef.current?.emit("CALL_REJECT", {
      to: incomingCall.from,
    });

    try {
      await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: incomingCall.from,
          duration: 0,
          status: "rejected",
          type: incomingCall.type,
        }),
      });
    } catch (error) {
      console.error(error);
    }

    setIncomingCall(null);
  }

  async function handleNoAnswer(receiverId: string) {
    stopOutgoing();

    closeConnection();

    socketRef.current?.emit("CALL_END", {
      to: receiverId,
    });

    try {
      await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId,
          duration: 0,
          status: "missed",
          type: activeCallType!,
        }),
      });
    } catch (error) {
      console.error("Failed to save missed call:", error);
    } finally {
      setCallStartTime(null);
      setIsInCall(false);

      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }

      alert("No Answer");
    }
  }

  async function handleEndCall() {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    const otherUser = selectedChat?.members.find(
      (m: any) => m._id !== currentUserData?.userExist?._id
    );

    const answered = callStartTime !== null;

    stopIncoming();
    stopOutgoing();

    await closeConnection();

    socketRef.current?.emit("CALL_END", {
      to: otherUser?._id,
      cancelled: !answered,
    });

    if (answered && otherUser?._id) {
      try {
        const duration = Math.floor(
          (Date.now() - callStartTime!) / 1000
        );

        await fetch("/api/calls", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: otherUser._id,
            duration,
            status: "answered",
            type: activeCallType!,
          }),
        });
      } catch (error) {
        console.error("Failed to save call:", error);
      }
    }

    setCallStartTime(null);
    setIsInCall(false);
  }

  // function handleCallAgain(
  //   userId: string,
  //   type: "audio" | "video"
  // ) {
  //   const chat = chatsData?.chats?.find((chat: any) =>
  //     chat.members.some((member: any) => member._id === userId)
  //   );

  //   if (!chat) return;

  //   setSelectedChat(chat);

  //   if (type === "video") {
  //     handleStartCall(userId);
  //   } else {
  //     // Future: Audio call
  //     console.log("Audio call");
  //   }
  // }


  return (
    <div className="flex h-screen bg-[#0B1414]">
      {/* Sidebar */}
      <ChatSidebar
        isLoading={isLoading}
        chatsData={chatsData}
        currentUser={currentUserData?.userExist}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        showGroupModal={showGroupModal}
        setShowGroupModal={setShowGroupModal}
        statusesData={statusesData}
        usersData={usersData}
        statusFileInputRef={statusFileInputRef}
        handleStatusUpload={handleStatusUpload}
        setViewingStatus={setViewingStatus}
        viewStatus={viewStatus}
        showNewChatModal={showNewChatModal}
        SetShowNewChatModal={setShowNewChatModal}
      />

      {/* Chat window area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Header — naam + typing indicator dono yahan grouped hain */}

          <ChatHeader
            selectedChat={selectedChat}
            currentUser={currentUserData?.userExist}
            onlineUsers={onlineUsers}
            isOtherTyping={isOtherTyping}
            onAudioCall={() => handleStartCall("audio")}
            onVideoCall={() => handleStartCall("video")}
          />

          <ChatMessages
            messages={messagesData?.messages || []}
            selectedChat={selectedChat}
            currentUser={currentUserData?.userExist}
            setReplyMessage={setReplyMessage}
          />

          <ChatInput
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            selectedChat={selectedChat}
            socketRef={socketRef}
            typingTimeoutRef={typingTimeoutRef}
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
          />
        </div>
      ) : (
        <EmptyChat />
      )}
      <GroupModal
        show={showGroupModal}
        groupName={groupName}
        setGroupName={setGroupName}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        usersData={usersData}
        onClose={() => setShowGroupModal(false)}
        onCreate={handleCreateGroup}
      />

      <NewChatModal
        open={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        users={usersData?.users || []}
        onSelectUser={handleStartNewChat}
        currentUser={currentUserData?.userExist}
      />

      <StatusViewer
        viewingStatus={viewingStatus}
        setViewingStatus={setViewingStatus}
      />


      {incomingCall && (
        <IncomingCallModal
          callerName={incomingCall?.caller?.name}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {isInCall &&
        (activeCallType === "video" ? (
          <CallScreen
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            localStream={localStream}
            remoteStream={remoteStream}
            onEndCall={handleEndCall}
            toggleMicrophone={toggleMicrophone}
            toggleCamera={toggleCamera}
            isMicEnabled={isMicEnabled}
            isCameraEnabled={isCameraEnabled}
          />
        ) : (
          <AudioCallScreen
            userName={
              selectedChat?.members.find(
                (m: any) =>
                  m._id !== currentUserData?.userExist?._id
              )?.name || "Unknown"
            }
            userImage={
              selectedChat?.members.find(
                (m: any) =>
                  m._id !== currentUserData?.userExist?._id
              )?.avatar
            }
            isMicEnabled={isMicEnabled}
            toggleMicrophone={toggleMicrophone}
            onEndCall={handleEndCall}
          />
        ))}
    </div>
  );
}