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
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800
                           bg-white dark:bg-gray-900 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Show NeuroChat branding when no thread selected */}
            {!activeThread && (
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-violet-500" />
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">NeuroChat</span>
              </div>
            )}

            {/* Show thread title when active */}
            {activeThread && (
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
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
