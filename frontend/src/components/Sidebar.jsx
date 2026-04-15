import { useEffect, useState } from 'react';
import {
  Plus, MessageSquare, Trash2, Pencil, Check, X, LogOut, Brain, Menu, ChevronLeft,
} from 'lucide-react';
import useChatStore from '../store/chatStore';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

/**
 * Left sidebar — thread list, new chat button, rename/delete actions,
 * user info, theme toggle, and logout.
 * Collapsible on mobile.
 */
export default function Sidebar({ isOpen, onClose }) {
  const {
    threads, activeThreadId, isLoadingThreads,
    fetchThreads, createThread, deleteThread, renameThread, setActiveThread,
  } = useChatStore();
  const { user, logout } = useAuth();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleNewChat = async () => {
    await createThread();
    onClose?.();
  };

  const handleSelectThread = (id) => {
    setActiveThread(id);
    onClose?.();
  };

  const startEdit = (thread, e) => {
    e.stopPropagation();
    setEditingId(thread._id);
    setEditTitle(thread.title);
  };

  const confirmEdit = async (e) => {
    e?.stopPropagation();
    if (editTitle.trim()) await renameThread(editingId, editTitle.trim());
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      await deleteThread(id);
    }
  };

  return (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        className="fixed inset-0 z-20 bg-black/50 lg:hidden"
        onClick={onClose}
      />
    )}

    {/* Sidebar panel */}
    <aside
      className={`fixed top-0 left-0 h-full z-30 w-64 flex flex-col
                  bg-[#0d1117] border-r border-[#30363d]
                  transform transition-transform duration-300 ease-in-out
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                  lg:translate-x-0 lg:static lg:z-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#0e1211]
                          flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[#e6edf3] text-sm">NeuroChat</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-[#8b949e] hover:text-[#e6edf3]
                       hover:bg-[#21262d] transition-all"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md
                     bg-[#222423] hover:bg-[#2f3130] text-white text-sm font-medium
                     transition-all duration-200"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 mt-2 space-y-0.5">
        {isLoadingThreads ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-[#4d5150] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : threads.length === 0 ? (
          <p className="text-center text-xs text-[#8b949e] py-8">
            No conversations yet
          </p>
        ) : (
          threads.map((thread) => (
            <div
              key={thread._id}
              onClick={() => handleSelectThread(thread._id)}
              className={`thread-item group ${activeThreadId === thread._id ? 'active' : ''}`}
            >
              <MessageSquare size={14} className="flex-shrink-0 opacity-60" />

              {editingId === thread._id ? (
                <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="flex-1 bg-transparent border-b border-[#4b4e4d] outline-none text-xs
                               text-[#e6edf3] py-0.5"
                  />
                  <button onClick={confirmEdit} className="text-green-400 hover:text-green-300">
                    <Check size={13} />
                  </button>
                  <button onClick={cancelEdit} className="text-[#8b949e] hover:text-[#e6edf3]">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 truncate text-xs text-[#e6edf3]">
                    {thread.title}
                  </span>

                  {/* Action buttons */}
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    <button
                      onClick={(e) => startEdit(thread, e)}
                      className="p-1 rounded hover:bg-[#21262d] text-[#8b949e]
                                 hover:text-[#e6edf3] transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(thread._id, e)}
                      className="p-1 rounded hover:bg-red-500/10 text-[#8b949e]
                                 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#30363d]">
        <div className="flex items-center gap-2 px-2 py-2 rounded-md
                        hover:bg-[#21262d] transition-colors group">
          <div className="w-7 h-7 rounded-full bg-[#242626]
                          flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#e6edf3] truncate">
              {user?.name}
            </p>
            <p className="text-[10px] text-[#8b949e] truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#8b949e]
                       hover:text-red-400 transition-all"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  </>
);
}
