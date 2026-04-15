import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import useChatStore from '../store/chatStore';

/**
 * Message input bar — expanding textarea, send on Enter (Shift+Enter for newline),
 * disabled while streaming.
 */
export default function InputBar() {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { sendMessage, isStreaming, activeThreadId, createThread } = useChatStore();

  // Auto-resize textarea up to max height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    let threadId = activeThreadId;

    // Auto-create thread if none selected
    if (!threadId) {
      const thread = await createThread();
      if (!thread) return;
      threadId = thread._id;
    }

    setInput('');
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
  <div className="px-4 py-3 border-t border-[#30363d] bg-[#161b22]">
    <div className="max-w-3xl mx-auto">
      <div
        className="flex items-end gap-3 bg-[#0d1117] border border-[#30363d]
                   rounded-xl px-4 py-3 shadow-sm
                   focus-within:border-[#838887]
                   focus-within:ring-2 focus-within:ring-[#10a37f]/20 transition-all"
      >
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message NeuroChat…"
          disabled={isStreaming}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-[#e6edf3]
                     placeholder-[#8b949e]
                     disabled:opacity-50 max-h-40 leading-relaxed"
        />

        {/* Send / Stop button */}
        <button
          onClick={handleSubmit}
          disabled={(!input.trim() && !isStreaming)}
          title={isStreaming ? 'Generating…' : 'Send message'}
          className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center
                      transition-all duration-200 disabled:opacity-40
                      ${
                        input.trim() || isStreaming
                          ? 'bg-[#06120e] hover:bg-[#06120e] text-white'
                          : 'bg-[#21262d] text-[#8b949e]'
                      }`}
        >
          {isStreaming ? <Square size={14} /> : <Send size={14} />}
        </button>
      </div>

      <p className="text-center text-[10px] text-[#8b949e] mt-2">
        NeuroChat can make mistakes. Verify important information.
      </p>
    </div>
  </div>
);
}
