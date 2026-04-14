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
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 flex flex-col
                    bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600
                            flex items-center justify-center shadow">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">NeuroChat</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
                       bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium
                       transition-all duration-200 shadow-md hover:shadow-violet-500/30"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 mt-2 space-y-0.5">
          {isLoadingThreads ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : threads.length === 0 ? (
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 py-8">
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
                  /* Inline rename input */
                  <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 bg-transparent border-b border-violet-500 outline-none text-xs
                                 text-gray-800 dark:text-gray-100 py-0.5"
                    />
                    <button onClick={confirmEdit} className="text-green-500 hover:text-green-400">
                      <Check size={13} />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-300">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 truncate text-xs">{thread.title}</span>
                    {/* Action buttons (visible on hover) */}
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => startEdit(thread, e)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400
                                   hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(thread._id, e)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400
                                   hover:text-red-500 transition-colors"
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

        {/* Footer — user info + logout */}
        <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg
                          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400
                         hover:text-red-500 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
