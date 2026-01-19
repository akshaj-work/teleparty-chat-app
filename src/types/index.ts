// Types based on the Teleparty WebSocket Library documentation

export interface SendMessageData {
  body: string;
}

export interface SessionChatMessage {
  isSystemMessage: boolean;
  userIcon?: string;
  userNickname?: string;
  body: string;
  permId: string;
  timestamp: number;
}

export interface SetTypingMessageData {
  typing: boolean;
}

export interface TypingMessageData {
  anyoneTyping: boolean;
  usersTyping: string[];
}

export interface MessageList {
  messages: SessionChatMessage[];
}

export const SocketMessageTypes = {
  SEND_MESSAGE: 'SEND_MESSAGE',
  SET_TYPING_PRESENCE: 'SET_TYPING_PRESENCE',
} as const;

export type SocketMessageType = typeof SocketMessageTypes[keyof typeof SocketMessageTypes];

export interface User {
  nickname: string;
  permId?: string;
  icon?: string;
}

export interface RoomState {
  roomId: string | null;
  user: User | null;
  messages: SessionChatMessage[];
  isConnected: boolean;
  anyoneTyping: boolean;
}
