📘 LearnerAI.git

AI-powered Mind Map Generation Platform that helps learners visualize knowledge using interactive mind maps, Google OAuth login, and AI-driven topic breakdowns. Built with React (TypeScript, Tailwind, Vite) on the frontend and Flask + Redis + Gemini API on the backend.

🚀 Features

🔑 Authentication – Secure Google OAuth login with session management.

🧠 AI-Powered Mind Maps – Generates structured mind maps using Gemini API.

💾 Caching with Redis – Reduces API calls by storing generated mind maps.

🖼️ Export Options – Export generated mind maps as SVG or PDF.

📱 Responsive Design – Optimized for mobile and desktop.

⚙️ Admin Panel – Manage active sessions and cached mind maps.

🐳 Dockerized Deployment – Backend services ready for containerized environments.

📂 Project Structure
LearnerAi.git/
├── Dockerfile
├── package.json
├── requirements.txt
├── src/
│   ├── App.tsx
│   ├── components/     # UI Components
│   ├── api/            # Backend Flask API
│   ├── services/       # Frontend service layer
│   └── types.ts
└── vercel.json

⚡ Getting Started
Prerequisites

Node.js (v18+)

Python 3.12+

Redis

Docker (optional, for containerized deployment)

Installation
# Clone the repository
git clone https://github.com/rudresh69/LearnerAi.git
cd LearnerAi.git

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt

Running
# Start frontend (Vite dev server)
npm run dev

# Start backend (Flask)
python src/api/server.py


Using Docker:

docker build -t learnerai .
docker run -p 3000:3000 learnerai

🧪 Testing

Frontend:

npm test


Backend:

pytest

🛣️ Roadmap

 Google OAuth integration

 Mind map generation (Gemini API)

 Session & cache management with Redis

 
🙌 Acknowledgments

Google Gemini API
 for mind map generation

Mermaid.js
 for diagram rendering

Redis
 for caching & session management

TailwindCSS
 for styling

<div align="right">

⬆️ Back to Top

</div>
