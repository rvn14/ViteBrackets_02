# Spirit11 - Fantasy Cricket Platform

[![Next.js Version](https://img.shields.io/badge/Next.js-15.2.1-000000.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)

A high-performance fantasy cricket platform built with Next.js 15, featuring real-time gameplay, secure authentication, and immersive animations.

## ✨ Features

- 🏏 Real-time cricket match updates using Socket.IO
- 🔒 Secure authentication with NextAuth & JWT
- 📊 MongoDB integration with Mongoose
- 🎮 Interactive UI with Framer Motion & GSAP
- 📱 Responsive design with Tailwind CSS
- 📈 Player statistics and analytics
- 💬 Live chat functionality
- 🔔 Toast notifications system
- 📝 Markdown content support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/spirit11.git
cd spirit11
Install dependencies

bash
Copy
npm install
Configure environment variables

bash
Copy
cp .env.example .env.local
Start development server

bash
Copy
npm run dev
⚙️ Configuration
Environment Variables (.env.local)
env
Copy
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
🛠 Tech Stack
Framework: Next.js 15 (App Router)

Authentication: NextAuth + JWT

Database: MongoDB + Mongoose

State Management: React Context

Animations: Framer Motion + GSAP

Styling: Tailwind CSS

HTTP Client: Axios

Form Handling: React Hook Form

Notifications: React Hot Toast

Real-time: Socket.IO

📦 Scripts
npm run dev: Start development server (with Turbopack)

npm run build: Create production build

npm start: Start production server

npm lint: Run ESLint

🚨 Deployment
Set up production environment variables

Build project:

bash
Copy
npm run build
Start production server:

bash
Copy
npm start
Recommended hosting platforms:

Vercel

AWS Amplify

Netlify

🤝 Contributing
Fork the repository

Create your feature branch

Commit your changes

Push to the branch

Open a Pull Request

📄 License
MIT License - see LICENSE for details

Note: Ensure you have proper security measures in place when handling user data and authentication. Use HTTPS in production and keep your secrets secure.

Copy

This README includes:
1. Badges for key technologies
2. Feature highlights using emojis
3. Clear installation instructions
4. Environment configuration guide
5. Technology stack breakdown
6. Deployment instructions
7. Contribution guidelines
8. Security reminders

You might want to:
1. Add screenshots in a dedicated section
2. Include API documentation if applicable
3. Add a roadmap section
4. Include testing instructions
5. Add team/author information

Let me know if you need any modifications! 🚀
