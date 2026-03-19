# 🤖 AI Chat Assistant

A full-stack AI-powered chat application built with **React + Vite** frontend and **Node.js + Express** backend. Features real-time AI responses via the **Groq API**, secure JWT authentication, multi-session chat management, conversation summarization, and a sleek modern dark UI with smooth animations.

---

## ✨ Features

- **🔐 JWT Authentication** — Secure signup & login with hashed passwords (bcrypt) and token-based sessions
- **💬 Real-Time AI Chat** — Streaming AI responses powered by Groq SDK (LLM)
- **📂 Multi-Session Management** — Create, switch between, and delete multiple chat sessions
- **📝 Conversation Summarization** — AI-generated summaries of chat conversations
- **💾 Persistent Chat History** — All messages stored in MongoDB Atlas
- **🎨 Modern Dark UI** — Glassmorphism, gradients, and smooth Framer Motion animations
- **⚡ Rate Limiting** — API and auth endpoint throttling for abuse prevention
- **🛡️ Security** — Helmet.js HTTP headers, CORS protection, protected routes
- **📱 Responsive Design** — Sidebar navigation with mobile-friendly layout
- **🔔 Toast Notifications** — Elegant feedback with react-hot-toast
- **📄 Markdown Rendering** — AI responses rendered with full markdown support
- **🔄 Typing Indicator** — Animated indicator while AI generates a response

---

## 🛠️ Tech Stack

### Frontend

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| React 18           | UI library                     |
| Vite 5             | Build tool & dev server        |
| Tailwind CSS v4    | Utility-first styling          |
| Framer Motion      | Animations & transitions       |
| React Router v6    | Client-side routing            |
| Axios              | HTTP client                    |
| Lucide React       | Icon library                   |
| react-markdown     | Markdown rendering             |
| react-hot-toast    | Toast notifications            |
| uuid               | Unique ID generation           |

### Backend

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| Node.js            | Runtime environment            |
| Express 4          | Web framework                  |
| Groq SDK           | AI / LLM integration           |
| Mongoose 8         | MongoDB ODM                    |
| JSON Web Token     | Authentication                 |
| bcryptjs           | Password hashing               |
| Helmet             | HTTP security headers          |
| express-rate-limit | Rate limiting middleware       |
| dotenv             | Environment variable management|
| Nodemon            | Dev auto-restart               |

### Database

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| MongoDB Atlas| Cloud-hosted NoSQL database|

---

## 📋 Prerequisites

Before you begin, make sure you have the following:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/atlas)
- **Groq API Key** — [Get one here](https://console.groq.com/)
- **Git** (optional, for cloning)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-assistant-chat-app.git
cd ai-assistant-chat-app
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env` file (see [Environment Variables](#-environment-variables) below), then start the server:

```bash
npm run dev
```

The backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 🔑 Environment Variables

Create a `server/.env` file with the following variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

| Variable       | Description                                      |
| -------------- | ------------------------------------------------ |
| `MONGODB_URI`  | MongoDB Atlas connection string                  |
| `JWT_SECRET`   | Secret key for signing JWT tokens (keep it long) |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g., `7d`, `24h`)      |
| `GROQ_API_KEY` | API key from Groq for AI model access            |
| `PORT`         | Server port (default: `5000`)                    |

---

## 📁 Folder Structure

```
AI Assistant Chat App/
│
├── client/                     # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── InputBar.jsx        # Chat message input with send button
│   │   │   ├── MessageBubble.jsx   # Individual chat message (user/AI)
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── Sidebar.jsx         # Session list & navigation
│   │   │   ├── SummaryPanel.jsx    # Conversation summary display
│   │   │   └── TypingIndicator.jsx # AI typing animation
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication state provider
│   │   ├── hooks/
│   │   │   ├── useChat.js          # Chat logic & AI streaming
│   │   │   └── useSessions.js      # Session CRUD operations
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx        # Main chat interface
│   │   │   ├── LoginPage.jsx       # Login form
│   │   │   └── SignupPage.jsx      # Registration form
│   │   ├── utils/
│   │   │   ├── api.js              # Axios instance configuration
│   │   │   └── auth.js             # Token storage helpers
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # App entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js       # Signup & login logic
│   │   ├── chatController.js       # AI chat & streaming
│   │   ├── sessionsController.js   # Session CRUD
│   │   └── summaryController.js    # Conversation summarization
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification guard
│   │   └── rateLimiter.js          # API & auth rate limiters
│   ├── models/
│   │   ├── Message.js              # Message schema
│   │   ├── Session.js              # Chat session schema
│   │   └── User.js                 # User schema
│   ├── routes/
│   │   ├── auth.js                 # POST /api/auth/signup & /login
│   │   ├── chat.js                 # POST /api/chat
│   │   ├── sessions.js             # CRUD /api/sessions
│   │   └── summary.js              # POST /api/summary
│   ├── .env.example
│   ├── index.js                    # Express app entry point
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint            | Description          | Auth |
| ------ | ------------------- | -------------------- | ---- |
| POST   | `/api/auth/signup`  | Register a new user  | ❌   |
| POST   | `/api/auth/login`   | Login & get JWT token| ❌   |

### Chat

| Method | Endpoint            | Description                  | Auth |
| ------ | ------------------- | ---------------------------- | ---- |
| POST   | `/api/chat`         | Send message & get AI reply  | ✅   |

### Sessions

| Method | Endpoint                    | Description                  | Auth |
| ------ | --------------------------- | ---------------------------- | ---- |
| GET    | `/api/sessions`             | Get all user sessions        | ✅   |
| POST   | `/api/sessions`             | Create a new session         | ✅   |
| DELETE | `/api/sessions/:id`         | Delete a session             | ✅   |
| GET    | `/api/sessions/:id/messages`| Get messages for a session   | ✅   |

### Summary

| Method | Endpoint            | Description                      | Auth |
| ------ | ------------------- | -------------------------------- | ---- |
| POST   | `/api/summary`      | Generate conversation summary    | ✅   |

### Health

| Method | Endpoint            | Description          | Auth |
| ------ | ------------------- | -------------------- | ---- |
| GET    | `/api/health`       | Server health check  | ❌   |

---


## 🔒 Security

- **Password Hashing** — bcryptjs with salt rounds
- **JWT Auth** — Token-based authentication with configurable expiry
- **Helmet.js** — Secures HTTP headers against common attacks
- **CORS** — Restricted to frontend origin (`http://localhost:5173`)
- **Rate Limiting** — Auth: 10 req/15 min · API: 30 req/min
- **Protected Routes** — Client-side route guards + server-side middleware

---

## 📜 Available Scripts

### Backend (`server/`)

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server with Nodemon    |
| `npm start`     | Start production server          |

### Frontend (`client/`)

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite dev server          |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
