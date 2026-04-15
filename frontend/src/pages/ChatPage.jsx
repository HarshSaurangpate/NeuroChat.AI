import { useState } from 'react';
import { Menu, Brain } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import InputBar from '../components/InputBar';
import useChatStore from '../store/chatStore';

/**
 * Main chat page layout:
 *   [Sidebar] | [Header + ChatWindow + InputBar]
 * Sidebar is collapsible on mobile via hamburger menu.
 */
export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeThreadId, threads } = useChatStore();

  // Find the active thread's title for the header
  const activeThread = threads.find((t) => t._id === activeThreadId);

  return ( 
  <div className="flex h-screen bg-[#0d1117] overflow-hidden">
    {/* Sidebar */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    {/* Main area */}
    <div className="flex flex-col flex-1 min-w-0">
      
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#30363d]
                         bg-[#161b22] shrink-0">
        
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#8b949e] hover:text-[#e6edf3]
                     hover:bg-[#21262d] transition-all"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          
          {/* Show NeuroChat branding when no thread selected */}
          {!activeThread && (
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-[#eaedec]" />
              <span className="font-semibold text-sm text-[#e6edf3]">NeuroChat</span>
            </div>
          )}

          {/* Show thread title when active */}
          {activeThread && (
            <h2 className="text-sm font-medium text-[#e6edf3] truncate">
              {activeThread.title}
            </h2>
          )}
        </div>
      </header>

      {/* Chat messages area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto w-full overflow-y-auto">
          <ChatWindow />
        </div>
      </main>

      {/* Input bar */}
      <InputBar />
    </div>
  </div>
);
}
