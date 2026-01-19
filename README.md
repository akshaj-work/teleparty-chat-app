🎉 Teleparty Real-Time Chat Application

This project is a simplified real-time chat application built as part of the Teleparty Frontend Engineer Challenge.
It demonstrates real-time communication using the Teleparty WebSocket library, with a clean, event-driven React architecture.

🚀 Live Demo
👉 Live App:  https://akshaj-work.github.io/teleparty-chat-app/

Deployed using GitHub Pages with client-side routing support.

🧠 Key Features
✅ Create a chat room
✅ Join an existing chat room using Room ID
✅ Real-time messaging via WebSockets
✅ Load previous chat messages on join
✅ System messages (join/leave notifications)
✅ Typing presence indicator
✅ Multi-user & multi-tab tested
✅ Responsive, clean UI

🏗️ Architecture Overview
Teleparty Client Design

A single WebSocket client instance is created for the entire app lifecycle
The client self-initializes on import
All room operations internally wait for socket readiness
No polling, no manual initialization, no client recreation
Event-driven message and presence handling
This approach avoids race conditions and ensures reliable real-time behavior.

🛠️ Tech Stack
React + TypeScript
Vite
Tailwind CSS
React Router
Teleparty WebSocket Library

GitHub Pages (deployment)

📁 Project Structure
src/
├── components/
│   ├── Message.tsx
│   ├── MessageList.tsx
│   ├── MessageInput.tsx
│   └── TypingIndicator.tsx
├── pages/
│   ├── Home.tsx
│   └── ChatRoom.tsx
├── utils/
│   └── telepartyClient.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx

▶️ Running Locally
npm install
npm run dev

🌐 Deployment

The app is deployed using GitHub Pages.
Key deployment considerations:
Uses HashRouter to support client-side routing on GitHub Pages
Vite base path configured for the repository name

To deploy:

npm run build
npm run deploy

🧪 Testing Notes

Tested with multiple browser tabs simulating different users
Verified message history loading on join
Verified typing indicator behavior
Verified room creation vs join flow
Verified refresh behavior inside chat room

💡 Design Decisions
Prioritized correct real-time behavior over heavy UI styling
Avoided unnecessary abstractions and state libraries
Focused on clarity, maintainability, and correctness
Styling kept intentionally minimal and readable

📌 Final Notes
This project focuses on:
Understanding and integrating a WebSocket-based API
Managing real-time state correctly
Building a clean, maintainable frontend architecture
Thank you for reviewing! 😊# teleparty-chat-app
