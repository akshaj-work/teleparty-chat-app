interface TypingIndicatorProps {
  anyoneTyping: boolean;
}

export default function TypingIndicator({ anyoneTyping }: TypingIndicatorProps) {
  if (!anyoneTyping) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      <span className="inline-flex items-center gap-1">
        <span className="animate-pulse">●</span>
        Someone is typing...
      </span>
    </div>
  );
}
