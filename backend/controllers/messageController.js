const Message = require('../models/Message');
const Thread = require('../models/Thread');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Get messages for a thread ────────────────────────────────────────────────
// GET /api/messages/:threadId
const getMessages = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Verify the thread belongs to the current user
    const thread = await Thread.findOne({ _id: threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    const messages = await Message.find({ threadId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('getMessages error:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// ─── Send a message and get AI response ──────────────────────────────────────
// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { threadId, content } = req.body;

    if (!threadId || !content || !content.trim()) {
      return res.status(400).json({ error: 'threadId and content are required' });
    }

    // Verify thread ownership
    const thread = await Thread.findOne({ _id: threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Save user message
    const userMessage = await Message.create({
      threadId,
      role: 'user',
      content: content.trim(),
    });

    // Auto-title thread from first message
    if (thread.title === 'New Chat') {
      const shortTitle = content.trim().slice(0, 50);
      await Thread.findByIdAndUpdate(threadId, { title: shortTitle });
    }

    // Fetch conversation history for context
    const history = await Message.find({ threadId }).sort({ createdAt: 1 });
    const groqMessages = history.map((m) => ({ role: m.role, content: m.content }));

    // ── Streaming response via Server-Sent Events ─────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are NeuroChat, a helpful, knowledgeable, and friendly AI assistant. You provide clear, accurate, and concise responses. Format code with proper markdown code blocks.',
        },
        ...groqMessages,
      ],
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    // Save the complete assistant message
    const assistantMessage = await Message.create({
      threadId,
      role: 'assistant',
      content: fullContent,
    });

    // Signal stream end with the saved message id
    res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMessage._id })}\n\n`);
    res.end();
  } catch (err) {
    console.error('sendMessage error:', err.message);
    // If headers not sent yet, send JSON error
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to get AI response' });
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
};

module.exports = { getMessages, sendMessage };
