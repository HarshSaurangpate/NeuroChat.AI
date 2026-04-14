import { create } from 'zustand';
import api from '../services/api';

/**
 * Global chat state managed with Zustand.
 * Covers threads list, active thread, messages, and streaming state.
 */
const useChatStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────────
  threads: [],
  activeThreadId: null,
  messages: [],
  isLoadingThreads: false,
  isLoadingMessages: false,
  isStreaming: false,
  streamingContent: '',
  error: null,

  // ── Thread Actions ────────────────────────────────────────────────────────────

  fetchThreads: async () => {
    set({ isLoadingThreads: true, error: null });
    try {
      const { data } = await api.get('/threads');
      set({ threads: data, isLoadingThreads: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to load chats', isLoadingThreads: false });
    }
  },

  createThread: async () => {
    try {
      const { data } = await api.post('/threads', { title: 'New Chat' });
      set((s) => ({ threads: [data, ...s.threads], activeThreadId: data._id, messages: [] }));
      return data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to create chat' });
    }
  },

  deleteThread: async (threadId) => {
    try {
      await api.delete(`/threads/${threadId}`);
      set((s) => {
        const threads = s.threads.filter((t) => t._id !== threadId);
        const activeThreadId = s.activeThreadId === threadId
          ? (threads[0]?._id || null)
          : s.activeThreadId;
        return { threads, activeThreadId, messages: activeThreadId === null ? [] : s.messages };
      });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to delete chat' });
    }
  },

  renameThread: async (threadId, title) => {
    try {
      const { data } = await api.patch(`/threads/${threadId}`, { title });
      set((s) => ({
        threads: s.threads.map((t) => (t._id === threadId ? data : t)),
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to rename chat' });
    }
  },

  setActiveThread: async (threadId) => {
    if (get().activeThreadId === threadId) return;
    set({ activeThreadId: threadId, messages: [], isLoadingMessages: true });
    try {
      const { data } = await api.get(`/messages/${threadId}`);
      set({ messages: data, isLoadingMessages: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to load messages', isLoadingMessages: false });
    }
  },

  // ── Message Actions ───────────────────────────────────────────────────────────

  sendMessage: async (content) => {
    const { activeThreadId } = get();
    if (!activeThreadId || !content.trim()) return;

    // Optimistically add user message
    const tempUserMsg = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, tempUserMsg], isStreaming: true, streamingContent: '' }));

    try {
      const token = localStorage.getItem('nc_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ threadId: activeThreadId, content: content.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assembled = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6);
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.delta) {
              assembled += parsed.delta;
              set({ streamingContent: assembled });
            }
            if (parsed.done) {
              // Replace streaming content with persisted message
              set((s) => ({
                messages: [
                  ...s.messages,
                  {
                    _id: parsed.messageId,
                    role: 'assistant',
                    content: assembled,
                    createdAt: new Date().toISOString(),
                  },
                ],
                isStreaming: false,
                streamingContent: '',
              }));
              // Refresh threads to reflect auto-title update
              get().fetchThreads();
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      set((s) => ({
        messages: [
          ...s.messages,
          {
            _id: `err-${Date.now()}`,
            role: 'assistant',
            content: '⚠️ Sorry, something went wrong. Please try again.',
            createdAt: new Date().toISOString(),
          },
        ],
        isStreaming: false,
        streamingContent: '',
        error: err.message,
      }));
    }
  },

  clearError: () => set({ error: null }),
}));

export default useChatStore;
