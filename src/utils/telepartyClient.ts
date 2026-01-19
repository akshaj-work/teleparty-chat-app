// WebSocket client wrapper for Teleparty library
import {
  TelepartyClient as TPClient,
  SocketMessageTypes,
  type SessionChatMessage,
  type MessageList,
} from 'teleparty-websocket-lib';
import type { SocketEventHandler } from 'teleparty-websocket-lib';
import type {
  SendMessageData,
  SetTypingMessageData,
  TypingMessageData,
} from '../types';

type IncomingMessage =
  | SessionChatMessage
  | TypingMessageData
  | MessageList;

export class TelepartyClient {
  private client: TPClient;
  private connectionReady = false;

  private readyResolvers: (() => void)[] = [];
  private onMessageCallbacks: ((msg: IncomingMessage) => void)[] = [];
  private onCloseCallbacks: (() => void)[] = [];

  private userPermId: string | null = null;

  constructor() {
    const eventHandler: SocketEventHandler = {
      onConnectionReady: () => {
        console.log('Teleparty: connection ready');
        this.connectionReady = true;
        this.readyResolvers.forEach(resolve => resolve());
        this.readyResolvers = [];
      },

      onMessage: (socketMessage) => {
        this.handleMessage(socketMessage);
      },

      onClose: () => {
        console.log('Teleparty: connection closed');
        this.connectionReady = false;
        this.onCloseCallbacks.forEach(cb => cb());
      },
    };

    console.log('Teleparty: creating client');
    this.client = new TPClient(eventHandler);
  }

  // ---------- Connection handling ----------

  private async waitUntilReady(): Promise<void> {
    if (this.connectionReady) return;

    return new Promise(resolve => {
      this.readyResolvers.push(resolve);
    });
  }

  isReady(): boolean {
    return this.connectionReady;
  }

  // ---------- Room management ----------

  async createChatRoom(
    nickname: string,
    userIcon?: string
  ): Promise<string> {
    await this.waitUntilReady();
    console.log('Teleparty: creating room');
    return this.client.createChatRoom(nickname, userIcon);
  }

  async joinChatRoom(
    nickname: string,
    roomId: string,
    userIcon?: string
  ): Promise<MessageList> {
    await this.waitUntilReady();
    console.log('Teleparty: joining room', roomId);

    const messageList = await this.client.joinChatRoom(
      nickname,
      roomId,
      userIcon
    );

    if (messageList?.messages) {
      this.onMessageCallbacks.forEach(cb => cb(messageList));
    }

    return messageList;
  }

  // ---------- Messaging ----------

  sendMessage(data: SendMessageData): void {
    if (!this.connectionReady) {
      throw new Error('Teleparty: connection not ready');
    }

    this.client.sendMessage(
      SocketMessageTypes.SEND_MESSAGE,
      data
    );
  }

  sendTypingPresence(data: SetTypingMessageData): void {
    if (!this.connectionReady) return;

    this.client.sendMessage(
      SocketMessageTypes.SET_TYPING_PRESENCE,
      data
    );
  }

  // ---------- Incoming messages ----------

  private handleMessage(socketMessage: {
    type: string;
    data: any;
  }): void {
    const { type, data } = socketMessage;

    if (type === SocketMessageTypes.SEND_MESSAGE) {
      const message = data as SessionChatMessage;

      if (!this.userPermId && message.permId) {
        this.userPermId = message.permId;
      }

      this.onMessageCallbacks.forEach(cb => cb(message));
      return;
    }

    if (type === SocketMessageTypes.SET_TYPING_PRESENCE) {
      this.onMessageCallbacks.forEach(cb =>
        cb(data as TypingMessageData)
      );
      return;
    }

    if (data && 'messages' in data) {
      this.onMessageCallbacks.forEach(cb =>
        cb(data as MessageList)
      );
    }
  }

  // ---------- Subscriptions ----------

  onMessage(
    callback: (message: IncomingMessage) => void
  ): void {
    this.onMessageCallbacks.push(callback);
  }

  onClose(callback: () => void): void {
    this.onCloseCallbacks.push(callback);
  }

  // ---------- Helpers ----------

  getUserPermId(): string | null {
    return this.userPermId;
  }

  disconnect(): void {
    try {
      this.client.teardown();
      console.log('Teleparty: teardown complete');
    } catch (e) {
      console.warn('Teleparty: teardown error', e);
    }

    this.connectionReady = false;
    this.userPermId = null;
  }
}

// ✅ SINGLETON EXPORT (correct)
export const telepartyClient = new TelepartyClient();
