<div align="center">

# 🚀 LearnerAI

### AI-powered Mind Map Generator

AI-powered **Mind Map Generation Platform** that helps learners visualize knowledge using interactive mind maps, Google OAuth login, and AI-driven topic breakdowns. Built with **React (TypeScript, Tailwind, Vite)** on the frontend and **Flask + Redis + Gemini API** on the backend.

</div>

---

## ✨ Features

* 🔑 **Authentication** – Secure Google OAuth login with session management.
* 🧠 **AI-Powered Mind Maps** – Generates structured mind maps using Gemini API.
* 💾 **Caching with Redis** – Reduces API calls by storing generated mind maps.
* 🖼️ **Export Options** – Export generated mind maps as SVG or PDF.
* 📱 **Responsive Design** – Optimized for mobile and desktop.
* ⚙️ **Admin Panel** – Manage active sessions and cached mind maps.
* 🐳 **Dockerized Deployment** – Backend services ready for containerized environments.

---

## 📂 Project Structure

```plaintext
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
```

---

## ⚡ Getting Started

### 🔧 Prerequisites

* Node.js (v18+)
* Python 3.12+
* Redis
* Docker (optional)

### 📥 Installation

```bash
# Clone the repository
git clone https://github.com/rudresh69/LearnerAi.git
cd LearnerAi.git

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r requirements.txt
```

### ▶️ Running

```bash
# Start frontend (Vite dev server)
npm run dev

# Start backend (Flask)
python src/api/server.py
```

Using Docker:

```bash
docker build -t learnerai .
docker run -p 3000:3000 learnerai
```

---

## 🧪 Testing

Frontend:

```bash
npm test
```

Backend:

```bash
pytest
```

---

## 🛣️ Roadmap

* [x] Google OAuth integration
* [x] Mind map generation (Gemini API)
* [x] Session & cache management with Redis
* [ ] Collaborative editing of mind maps
* [ ] Multi-language support
* [ ] Cloud deployment (AWS/GCP)

---

## 🙌 Acknowledgments

* [Google Gemini API](https://ai.google/) – for mind map generation
* [Mermaid.js](https://mermaid.js.org/) – for diagram rendering
* [Redis](https://redis.io/) – for caching & session management
* [TailwindCSS](https://tailwindcss.com/) – for styling
