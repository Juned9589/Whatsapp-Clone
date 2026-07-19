export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: string; // "online" | "offline"
  lastSeen?: Date;
  isAI?: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  members: string[];
  groupAdmin?: string;
  groupName?: string;
  groupAvatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "document";
  status: "sent" | "delivered" | "read";
  replyTo?: string;
  createdAt: Date;
}

export interface Status {
  id: string;
  userId: string;
  mediaUrl: string;
  caption?: string;
  viewers: string[];
  expiresAt: Date;
}

export const SOCKET_EVENTS = {
  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
} as const;

export interface MessageSendPayload {
  chatId: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "document";
  replyTo?: string;
}

export interface TypingPayload {
  chatId: string;
  userId: string;
}

export interface UserPresencePayload {
  userId: string;
  status: "online" | "offline";
}
