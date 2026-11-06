# 🎓 StudentSupport AI

> **A Generative AI-Powered Student Academic Assistant** built with **React, Flask, Python, SQLite, and Groq API**. StudentSupport AI leverages Large Language Models (LLMs) to deliver intelligent academic assistance, personalized learning support, and productivity tools through natural language conversations.

🌐 **Live Demo:** https://studentsupport-ai-1.onrender.com/

![Generative AI](https://img.shields.io/badge/Generative-AI-purple?style=for-the-badge)
![LLM](https://img.shields.io/badge/LLM-GPT--OSS_120B-blueviolet?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-GPT--OSS-F54E27?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

---

# 📑 Table of Contents

- [Overview](#-overview)
- [Generative AI Features](#-generative-ai-features)
- [Application Features](#-application-features)
- [Tech Stack](#️-tech-stack)
- [Database](#️-database)
- [How Generative AI Works](#-how-generative-ai-works)
- [System Architecture](#️-system-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Live Demo](#-live-demo)
- [Skills Demonstrated](#-skills-demonstrated)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

# 🚀 Overview

StudentSupport AI is a **Generative AI web application** designed to provide students with intelligent academic support through AI-powered conversations and productivity tools.

The application integrates the **Groq API** with the **OpenAI GPT-OSS 120B Large Language Model (LLM)** to generate context-aware responses for academic queries. Instead of relying on predefined answers, the AI understands user prompts and generates personalized responses.

The application also supports fallback models to improve availability when the primary model cannot process a request.

This project demonstrates practical implementation of:

- 🤖 Generative AI
- 🧠 Large Language Models (LLMs)
- ✍️ Prompt Engineering
- 🔗 REST API Integration
- 🌐 Full-Stack Web Development

---

# 🤖 Generative AI Features

- 🧠 AI-powered academic chatbot using **GPT-OSS 120B**
- 💬 Real-time conversational AI
- 📖 AI-generated concept explanations
- 📝 Personalized study guidance
- 💻 Programming assistance
- 📚 Assignment and exam preparation support
- 🎯 Career guidance
- 🎤 AI-powered mock interview practice
- ⚡ Fast inference using Groq API
- 🔄 Context-aware conversations
- 🔁 Multiple model fallback support

---

# ✨ Application Features

| Module | Description |
|---|---|
| 🤖 AI Chatbot | Ask academic and programming questions and receive AI-generated responses |
| 📅 Study Planner | Organize study schedules and daily learning tasks |
| 🎓 CGPA Calculator | Calculate SGPA and overall CGPA |
| ⏱️ Pomodoro Timer | Improve productivity with focused study sessions |
| 💼 Career Guidance | Resume tips, interview preparation, and internship guidance |
| 🎤 Mock Interview | Practice technical and behavioral interview questions |

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- JavaScript
- HTML5
- CSS3
- Axios

## Backend

- Flask
- Python
- SQLite Database
- REST APIs
- HTTPX

## Generative AI

- Groq API
- OpenAI GPT-OSS 120B (Primary Model)
- OpenAI GPT-OSS 20B (Fallback Model)
- Llama 3.1 8B Instant (Additional Fallback)
- Large Language Models (LLMs)
- Prompt Engineering

## Deployment

- Render

---

# 🗄️ Database

StudentSupport AI uses **SQLite** as a lightweight relational database for storing application data.

### Database Modules

- 📝 Notes
- 📅 Study Planner
- 📚 Assignments
- ⏰ Reminders
- 💼 Internship Applications
- 🎓 Counselling Appointments
- ⏱️ Pomodoro Timer Sessions
- 📊 Quiz Results

The application initializes its database tables automatically when the backend starts.

---

# 🧠 How Generative AI Works

1. User enters an academic question in the chatbot.
2. React sends the request to the Flask backend.
3. Flask processes the request and prepares the conversation context.
4. Flask forwards the prompt to the Groq API.
5. **GPT-OSS 120B** processes the request through Groq API.
6. If the primary model fails, the backend attempts the configured fallback models.
7. The AI-generated response is returned to the Flask backend.
8. The response is displayed in the React chatbot interface.

---

# 🏗️ System Architecture

```text
                    User
                     │
                     ▼
          React Frontend (Vite)
                     │
                Axios API
                     │
                     ▼
              Flask Backend
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
  SQLite Database            Groq API
         │                       │
         │                ┌──────┴──────┐
         │                │             │
         │                ▼             ▼
         │          GPT-OSS 120B   Fallback Models
         │                │             │
         │                └──────┬──────┘
         │                       │
         └───────────┬───────────┘
                     ▼
          AI Generated Response
                     │
                     ▼
              React Interface
```

---

# 📁 Project Structure

```text
studentsupport-ai/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── database/
│   │   └── studentsupport.db
│   └── static/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatbotView.jsx
│   │   │   ├── ProductivityView.jsx
│   │   │   ├── CareerServicesView.jsx
│   │   │   ├── StudyTimerView.jsx
│   │   │   └── CGPAView.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/suniti1809/StudentSupport-AI.git

cd StudentSupport-AI
```

## Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_groq_api_key
```

Get your API key from:

https://console.groq.com/keys

## Frontend Setup

```bash
cd ../frontend

npm install

npm run build
```

## Run the Application

```bash
cd ../backend

python main.py
```

Open your browser and visit:

```text
http://localhost:10000
```

---

# 🌐 Live Demo

Experience StudentSupport AI:

https://studentsupport-ai-1.onrender.com/

**GitHub Repository:**

https://github.com/suniti1809/StudentSupport-AI

---

# 🎯 Skills Demonstrated

- 🤖 Generative AI
- 🧠 Large Language Models (LLMs)
- ✍️ Prompt Engineering
- 🔗 AI API Integration
- ⚛️ React.js
- 🐍 Python
- 🌶️ Flask
- 🗄️ SQLite Database
- 🌐 REST API Development
- 💻 Full-Stack Web Development
- 📱 Responsive UI Design
- ☁️ Deployment on Render

---

# 🔮 Future Enhancements

- 🤖 AI-generated quizzes
- 📄 AI-powered PDF summarization
- 🎙️ Voice-enabled AI assistant
- 💬 Persistent chat history
- 🌍 Multi-language support
- 🎯 Personalized learning recommendations

---

# 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
Built with ❤️ using <strong>React</strong>, <strong>Flask</strong>, <strong>Python</strong>, <strong>SQLite</strong>, and <strong>Groq GPT-OSS 120B</strong>.
</p>
