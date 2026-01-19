import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type {
  SessionChatMessage,
  TypingMessageData,
  MessageList as MessageListType,
} from '../types';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import { telepartyClient } from '../utils/telepartyClient';

export default function ChatRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const nickname = searchParams.get('nickname') || '';

  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [anyoneTyping, setAnyoneTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPermId, setUserPermId] = useState<string | null>(null);

  // ---- Join room ONCE on mount ----
  useEffect(() => {
    if (!roomId || !nickname) {
      setError('Missing room ID or nickname');
      setIsLoading(false);
      return;
    }

    const handleMessage = (
      message: SessionChatMessage | TypingMessageData | MessageListType
    ) => {
      if ('messages' in message) {
        setMessages(message.messages || []);
        return;
      }

      if ('anyoneTyping' in message) {
        setAnyoneTyping(message.anyoneTyping);
        return;
      }

      setMessages(prev => {
        const exists = prev.some(
          m =>
            m.permId === message.permId &&
            m.timestamp === message.timestamp
        );
        if (exists) return prev;
        return [...prev, message];
      });

      if (!userPermId && message.userNickname === nickname) {
        setUserPermId(message.permId);
      }
    };

    const handleClose = () => {
      setIsConnected(false);
      setError('Connection lost. Please return home.');
    };

    telepartyClient.onMessage(handleMessage);
    telepartyClient.onClose(handleClose);

    const join = async () => {
      try {
        const messageList = await telepartyClient.joinChatRoom(
          nickname,
          roomId
        );

        if (messageList?.messages) {
          setMessages(messageList.messages);
        }

        setIsConnected(true);
        setIsLoading(false);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to connect to room: ${msg}`);
        setIsLoading(false);
      }
    };

    join();

    return () => {
      // Do NOT teardown socket here.
      // Leave is handled explicitly.
    };
  }, [roomId, nickname]);

  // ---- Send message ----
  const handleSendMessage = useCallback((text: string) => {
    if (!isConnected) return;

    try {
      telepartyClient.sendMessage({ body: text });
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    }
  }, [isConnected]);

  // ---- Typing presence ----
  const handleTypingChange = useCallback((typing: boolean) => {
    if (!isConnected) return;
    telepartyClient.sendTypingPresence({ typing });
  }, [isConnected]);

  const handleLeaveRoom = () => {
    telepartyClient.disconnect();
    navigate('/');
  };

  // ---- UI STATES ----
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Connecting to room…</p>
      </div>
    );
  }

  if (error && !isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Centered chat container */}
      <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto bg-white shadow-sm">

        {/* Header */}
        <header className="border-b px-4 py-3 flex justify-between items-center bg-white">
          <div>
            <h1 className="font-bold">Teleparty Chat</h1>
            <p className="text-sm text-gray-500">
              Room: {roomId} {isConnected && '●'}
            </p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Leave
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MessageList
            messages={messages}
            currentUserPermId={userPermId}
          />
          <TypingIndicator anyoneTyping={anyoneTyping} />
        </div>

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingChange={handleTypingChange}
          disabled={!isConnected}
        />

      </div>
    </div>
  );

}
