/** Animated three-dot typing indicator displayed while AI is generating a response. */
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600
                      flex items-center justify-center text-white text-xs font-bold shadow-md">
        N
      </div>
      {/* Bubble */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                      rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
