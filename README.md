# Spirit11 - Fantasy Cricket Platform

[![Next.js Version](https://img.shields.io/badge/Next.js-15.2.1-000000.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)

A high-performance fantasy cricket platform built with **Next.js 15** and **FastAPI**, featuring real-time gameplay, secure authentication, and an AI-powered chatbot.

## ✨ Features

- 🏏 Fantasy team creation and budget management
- 📊 Player statistics and analytics
- 💬 AI-powered chatbot (Spiriter) for smart recommendations
- 🔒 Secure authentication with JWT
- 📱 Responsive design with Tailwind CSS
- 📈 Leaderboard and tournament insights
- ⚙️ Admin panel for managing players and system logic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local instance)
- Python 3.9+ (for FastAPI chatbot)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vihanga02/ViteBrackets_02.git
   cd spiriter
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Start the FastAPI chatbot:
- For more info, navigate to [Chatbot dir/](https://github.com/vihanga02/ViteBrackets_02/tree/main/chatbot)

## ⚙️ Configuration

### Environment Variables (.env)
```
MONGODB_URI=
JWT_SECRET=
NODE_ENV=production
```

## 🛠 Tech Stack

- **Frontend & Backend:** Next.js 15
- **Chatbot:** FastAPI (with Gemini AI)
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Styling:** Tailwind CSS

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server

## 🚨 Deployment

1. Set up production environment variables
2. Build project:
   ```bash
   npm run build
   ```
3. Start production server:
   ```bash
   npm start
   ```

### Hosting
- Vercel (Next.js hosting)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.