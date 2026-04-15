import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { MessageSquare } from 'lucide-react';

/**
 * Main chat messages area.
 * Auto-scrolls to the latest message.
 * Shows streaming response in real-time.
 */
export default function ChatWindow() {
  const { messages, isStreaming, streamingContent, isLoadingMessages, activeThreadId } =
    useChatStore();

  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages or streaming content changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // ── Empty / loading states ──────────────────────────────────────────────────
  if (!activeThreadId) {
    return (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6 bg-[#0d1117]">
    
    <div className="w-16 h-16 rounded-xl bg-[#0d0f0e]
                    flex items-center justify-center shadow-md">
      <span className="text-white text-2xl font-bold">N</span>
    </div>

    <h1 className="text-2xl font-semibold text-[#e6edf3]">
      Welcome to NeuroChat
    </h1>

    <p className="text-[#8b949e] max-w-sm text-sm">
      Start a new conversation from the sidebar, or select an existing one.
    </p>

  </div>
);
  }

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading messages…</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <MessageSquare size={40} className="text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No messages yet. Say something to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto py-4 space-y-1">
      {/* Persisted messages */}
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}

      {/* Live streaming message */}
      {isStreaming && streamingContent && (
        <MessageBubble
          key="streaming"
          message={{
            _id: 'streaming',
            role: 'assistant',
            content: streamingContent,
            createdAt: new Date().toISOString(),
          }}
          isStreaming
        />
      )}

      {/* Typing dots (before first token arrives) */}
      {isStreaming && !streamingContent && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
