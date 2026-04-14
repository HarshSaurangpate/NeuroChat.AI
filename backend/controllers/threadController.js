const Thread = require('../models/Thread');
const Message = require('../models/Message');

// ─── Get all threads for the authenticated user ───────────────────────────────
// GET /api/threads
const getThreads = async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error('getThreads error:', err.message);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};

// ─── Create a new thread ──────────────────────────────────────────────────────
// POST /api/threads
const createThread = async (req, res) => {
  try {
    const { title } = req.body;
    const thread = await Thread.create({
      userId: req.user._id,
      title: title || 'New Chat',
    });
    res.status(201).json(thread);
  } catch (err) {
    console.error('createThread error:', err.message);
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

// ─── Delete a thread and its messages ────────────────────────────────────────
// DELETE /api/threads/:id
const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Delete all messages belonging to this thread
    await Message.deleteMany({ threadId: thread._id });
    await thread.deleteOne();

    res.json({ message: 'Thread deleted successfully' });
  } catch (err) {
    console.error('deleteThread error:', err.message);
    res.status(500).json({ error: 'Failed to delete thread' });
  }
};

// ─── Rename a thread ──────────────────────────────────────────────────────────
// PATCH /api/threads/:id
const renameThread = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const thread = await Thread.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim() },
      { new: true }
    );

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    res.json(thread);
  } catch (err) {
    console.error('renameThread error:', err.message);
    res.status(500).json({ error: 'Failed to rename thread' });
  }
};

module.exports = { getThreads, createThread, deleteThread, renameThread };
