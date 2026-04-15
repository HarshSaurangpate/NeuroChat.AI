/** Animated three-dot typing indicator displayed while AI is generating a response. */
export default function TypingIndicator() {
  return (
  <div className="flex items-start gap-3 px-4 py-3 animate-fade-in">
    
    {/* Avatar */}
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#21262d]
                    flex items-center justify-center text-[#e6edf3] text-xs font-bold">
      N
    </div>

    {/* Bubble */}
    <div className="bg-[#161b22] border border-[#30363d]
                    rounded-2xl rounded-tl-sm px-4 py-3">
      <div className="flex items-center gap-1.5">
        <div className="typing-dot bg-[#8b949e]" />
        <div className="typing-dot bg-[#8b949e]" />
        <div className="typing-dot bg-[#8b949e]" />
      </div>
    </div>

  </div>
);
}
