import { useEffect, useRef } from 'react';
import type { SessionChatMessage } from '../types';
import Message from './Message';

interface MessageListProps {
  messages: SessionChatMessage[];
  currentUserPermId?: string | null;
}

export default function MessageList({ messages, currentUserPermId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message
            key={`${message.permId}-${message.timestamp}`}
            message={message}
            currentUserPermId={currentUserPermId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
