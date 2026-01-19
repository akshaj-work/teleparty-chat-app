import type { SessionChatMessage } from '../types';

interface MessageProps {
  message: SessionChatMessage;
  currentUserPermId?: string | null;
}

export default function Message({ message, currentUserPermId }: MessageProps) {
  const isOwnMessage = currentUserPermId !== null && message.permId === currentUserPermId;
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.isSystemMessage) {
    // Extract nickname from system message if available, or use default
    const displayText = message.userNickname 
      ? `${message.userNickname} ${message.body}`
      : message.body;
    
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full italic">
          {displayText}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        {message.userNickname && (
          <div className={`text-xs font-semibold mb-1 ${isOwnMessage ? 'text-blue-100' : 'opacity-75'}`}>
            {message.userNickname}
          </div>
        )}
        <div className="text-sm">{message.body}</div>
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
