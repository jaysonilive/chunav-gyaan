# 🗳️ Chunav Gyaan — चुनाव ज्ञान

> **India's Complete Interactive Election Guide**

![Live](https://img.shields.io/badge/Live-Vercel-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange) ![Free](https://img.shields.io/badge/Cost-Free-green) ![India](https://img.shields.io/badge/Made%20for-India%20🇮🇳-orange)

**🌐 Live Site → [https://chunav-gyaan.vercel.app](https://chunav-gyaan.vercel.app)**

## 📖 About

Chunav Gyaan is an interactive civic education web application designed to help Indian citizens, students, and first-time voters understand the complete election process. The Indian electoral system is complex and often hard to navigate; this platform simplifies it through an engaging, guided experience. What makes Chunav Gyaan special is its integration of a powerful, multilingual AI chatbot with voice input, providing completely free, non-partisan civic knowledge to everyone.

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🏠 **Home Dashboard** | Rotating facts, stats, and quick navigation. |
| 📅 **Election Timeline** | 12 interactive milestones from ECI announcement to government formation. |
| 🗳️ **How to Vote Wizard** | 6-step guided voting process with tips and common mistakes. |
| 🏛️ **Election Types** | All 6 Indian election types with real 2024 examples. |
| 👤 **Key Officials** | ECI, CEC, Returning Officer, and Presiding Officer explained. |
| 📊 **Results Process** | Post-election flow with Myth vs Fact panels. |
| 📖 **Glossary** | 20+ searchable Indian election terms. |
| 🎯 **Civic Quiz** | 10 India-specific questions with explanations. |
| 💬 **Chunav Mitra AI** | AI chatbot in 6 Indian languages with voice input. |

## 🤖 Chunav Mitra — AI Election Assistant

- Powered by Llama 3.3 70B (via Groq — fastest LLM inference)
- Responds in 6 languages: English, Hindi, Tamil, Telugu, Bengali, Marathi
- Voice input supported (speak your question)
- Smart follow-up question suggestions after each reply
- Neutral and non-partisan — civic education only
- API key 100% secure — stored in server environment only

🌐 **Live Site → [https://chunav-gyaan.vercel.app](https://chunav-gyaan.vercel.app)**

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite |
| **Backend** | Vercel Serverless Functions |
| **AI Model** | Llama 3.3 70B (Groq) |
| **Hosting** | Vercel (Free tier) |
| **Voice** | Web Speech API (built into browser) |
| **Styling** | Pure inline CSS (no external libraries) |

## 📂 Project Structure

```text
chunav-gyaan/
├── api/
│   └── chat.js        ← Groq AI serverless function
├── src/
│   ├── main.jsx       ← React entry point
│   └── App.jsx        ← Full app (all 9 pages)
├── index.html
├── vite.config.js
├── vercel.json        ← Deployment config
├── package.json
└── .env.example       ← API key template (safe)
```

## 🔐 API Key Security

- Groq API key stored ONLY in Vercel environment variables.
- Key never appears in any file in this repository.
- Frontend never touches the API key directly.
- All AI requests go through a secure serverless proxy.
- `.env.local` is gitignored — never committed to GitHub.

## 💻 Local Development

Follow these steps to run the project locally:

```bash
git clone https://github.com/jaysonilive/chunav-gyaan.git
cd chunav-gyaan
npm install
cp .env.example .env.local
```
*(Add your `GROQ_API_KEY` to `.env.local`)*

```bash
npm install -g vercel
vercel dev
```
*(Open `http://localhost:3000` in your browser)*

## 🚀 Live Demo

### 👉 **[https://chunav-gyaan.vercel.app](https://chunav-gyaan.vercel.app)**

The site is live, fully functional, and the AI chatbot is active.

## ⚠️ Disclaimer

<small>Chunav Gyaan is an independent civic education project. Not affiliated with the Election Commission of India (ECI) or any political party. All information is for educational purposes only. Verify with official sources at eci.gov.in.</small>

---
Made with ❤️ for India 🇮🇳 | जय हिन्द
