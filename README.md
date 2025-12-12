# 🎨 Art-to-Content: AI-Powered Repurposing for Visual Creators

> Turn any piece of visual art into ready-to-publish SEO content — in seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.124-009688.svg)](https://fastapi.tiangolo.com/)

## 🧠 Core Concept

Freelance artists, illustrators, and designers create stunning visuals—but struggle to promote them or monetize their work through blogs, social media, or SEO.

**Art-to-Content** solves this by:
- Uploading an image (e.g., an illustration, digital painting, or design)
- Using GPT-4o Vision to analyze themes, mood, and visual elements
- Automatically generating:
  - A 200-word SEO-friendly blog intro + 2 FAQs
  - A 3-tweet viral thread with hashtags
  - 3–5 intent-based keywords for discoverability
- All in one clean, copy-paste interface.

## 💡 Unique Edge

> "Unlike generic AI writers that start from a blank prompt, we start from your art — so your content is authentic, on-brand, and deeply connected to your creative voice."

## 🎯 Target User

**Riya, 28, freelance illustrator**
- Creates beautiful nature-themed digital art
- Wants to grow her audience on Instagram & Medium
- Doesn't have time to write captions, blogs, or SEO meta descriptions
- Feels "stuck" turning art into income or visibility

## ✨ Features

- 🖼️ **Image Upload & Analysis**: Upload any visual artwork and get instant AI-powered analysis
- 📝 **SEO Blog Content**: Generate 200-word blog introductions with FAQs
- 🐦 **Social Media Posts**: Create 3-tweet viral threads with relevant hashtags
- 🔍 **Keyword Discovery**: Get 3-5 intent-based keywords for better discoverability
- ⚡ **Fast & Efficient**: Get results in seconds, not hours
- 🎨 **Clean Interface**: Simple, intuitive UI for seamless workflow

## 🚀 Tech Stack

### Backend
- **Python 3.13** - Core language
- **FastAPI** - Modern, fast web framework
- **OpenAI GPT-4o Vision** - Multimodal AI for image analysis
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **React Router v7** - Routing and navigation
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

## 📋 Prerequisites

- Python 3.13 or higher
- Node.js 18+ or Bun
- OpenAI API key

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd kaffe
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn openai python-dotenv python-multipart
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (using Bun)
bun install

# Or using npm
npm install
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎮 Usage

### Start the Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### Start the Frontend Development Server

```bash
cd frontend
bun dev
# Or: npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

### Using the Application

1. Open the application in your browser
2. Upload an image of your artwork
3. Wait for AI analysis (usually takes a few seconds)
4. Copy the generated content:
   - Blog intro and FAQs
   - Social media thread
   - SEO keywords

## 📁 Project Structure

```
kaffe/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py          # API endpoints
│   │   └── utils.py           # Utility functions
│   ├── main.py                # FastAPI application entry point
│   └── venv/                  # Python virtual environment
├── frontend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── home.tsx       # Home page route
│   │   ├── root.tsx           # Root component
│   │   ├── routes.ts          # Route configuration
│   │   └── app.css            # Global styles
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
└── README.md                  # This file
```

## 🔧 Development

### Backend Development

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
bun dev
```

### Type Checking (Frontend)

```bash
cd frontend
bun run typecheck
```

## 🧪 API Endpoints

### POST `/api/analyze-image`
Analyzes an uploaded image and generates content.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: Image file (PNG, JPG, JPEG, etc.)

**Response:**
```json
{
  "blog_intro": "...",
  "faqs": [
    {
      "question": "...",
      "answer": "..."
    }
  ],
  "social_thread": [
    "Tweet 1...",
    "Tweet 2...",
    "Tweet 3..."
  ],
  "keywords": ["keyword1", "keyword2", ...]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o Vision API
- FastAPI for the excellent web framework
- React Router team for the routing solution
- All the open-source contributors whose libraries made this possible

## 🏆 Hackathon Notes

Built for **YIP / KSUM / NASA-themed Hackathon**

**Why It Wins:**
- ✅ **AI + Creativity**: Leverages cutting-edge multimodal AI (GPT-4o Vision)
- ✅ **Real-world utility**: Solves a daily pain point for millions of creators
- ✅ **Fast, focused scope**: Image → structured content (no scope creep)
- ✅ **Polished UX**: Clean frontend + smart backend = demo-ready in 24h

---

**Made with ❤️ for visual creators everywhere**

