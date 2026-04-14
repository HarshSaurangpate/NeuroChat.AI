# NeuroChat 🧠

A full-stack AI chat application built with the **MERN stack** and powered by **Groq LLM** — inspired by ChatGPT.

---

## ✨ Features

- 🔐 JWT-based authentication (register / login)
- 💬 Real-time AI responses via Groq streaming (SSE)
- 📝 Markdown + code syntax highlighting in responses
- 🗂️ Thread management — create, rename, delete conversations
- 🌙 Dark / light mode toggle
- 📱 Responsive design (mobile + desktop)
- ⚡ Auto-scroll, typing indicator, optimistic UI updates

---

## 🏗️ Project Structure

```
NeuroChat/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── threadController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Thread.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── threads.js
│   │   └── messages.js
│   ├── .env                  ← create from .env.example
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow.jsx
    │   │   ├── InputBar.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   └── TypingIndicator.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── chatStore.js   ← Zustand
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- [Groq API Key](https://console.groq.com/)

---

### 1. Clone & Install

```bash
# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

**Backend** — edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neurochat
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=gsk_your_groq_api_key
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** — edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Start the Backend

```bash
cd backend
npm run dev      # development (nodemon)
# or
npm start        # production
```

Server starts at: **http://localhost:5000**

---

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

App available at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/threads` | ✅ | List user threads |
| POST | `/api/threads` | ✅ | Create thread |
| DELETE | `/api/threads/:id` | ✅ | Delete thread + messages |
| PATCH | `/api/threads/:id` | ✅ | Rename thread |
| GET | `/api/messages/:threadId` | ✅ | Get messages |
| POST | `/api/messages` | ✅ | Send message (SSE stream) |

---

## 🤖 AI Model

Default model: **`llama-3.3-70b-versatile`** via Groq API.
You can change this in `backend/controllers/messageController.js`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| State | Zustand |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Groq SDK (streaming) |
| Markdown | react-markdown + remark-gfm |
| Syntax HL | react-syntax-highlighter |
