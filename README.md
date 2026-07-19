# 🎓 StudentSupport AI

> **A Generative AI-Powered Student Academic Assistant** built with **React, Flask, Python, SQLite, and Groq Llama 3.1**. StudentSupport AI leverages Large Language Models (LLMs) to deliver intelligent academic assistance, personalized learning support, and productivity tools through natural language conversations.

🌐 **Live Demo:** https://studentsupport-ai-1.onrender.com/

![Generative AI](https://img.shields.io/badge/Generative-AI-purple?style=for-the-badge)
![LLM](https://img.shields.io/badge/LLM-Llama_3.1-blueviolet?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-F54E27?style=for-the-badge)
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

StudentSupport AI is a **Full-Stack Generative AI web application** designed to provide students with intelligent academic support through AI-powered conversations and productivity tools.

The application integrates the **Groq API** with the **Llama 3.1 Large Language Model (LLM)** to generate context-aware, real-time responses for academic queries. Instead of relying on predefined answers, the AI understands user prompts and generates personalized responses instantly.

This project demonstrates practical implementation of:

- 🤖 Generative AI
- 🧠 Large Language Models (LLMs)
- ✍️ Prompt Engineering
- 🔗 REST API Integration
- 🌐 Full-Stack Web Development

---

# 🤖 Generative AI Features

- 🧠 AI-powered academic chatbot using **Groq Llama 3.1**
- 💬 Real-time conversational AI
- 📖 AI-generated concept explanations
- 📝 Personalized study guidance
- 💻 Programming assistance
- 📚 Assignment and exam preparation support
- 🎯 Career guidance
- ⚡ Fast inference using Groq API
- 🔄 Context-aware conversations

---

# ✨ Application Features

| Module | Description |
|---------|-------------|
| 🤖 AI Chatbot | Ask academic and programming questions and receive AI-generated responses |
| 📅 Study Planner | Organize study schedules and daily learning tasks |
| 🎓 CGPA Calculator | Calculate SGPA and overall CGPA |
| ⏱️ Pomodoro Timer | Improve productivity with focused study sessions |
| 💼 Career Guidance | Resume tips, interview preparation, and internship guidance |

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- JavaScript
- HTML5
- CSS3

## Backend

- Flask
- Python
- SQLite Database

## Generative AI

- Groq API
- Llama 3.1 Large Language Model
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

The repository includes a pre-configured **studentsupport.db** database with sample data for demonstration purposes.

---

# 🧠 How Generative AI Works

1. User enters an academic question.
2. React sends the request to the Flask backend.
3. Flask forwards the prompt to the Groq API.
4. Llama 3.1 processes the request.
5. AI generates a context-aware response.
6. The response is displayed instantly in the chatbot.

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
 SQLite Database         Groq Llama 3.1 API
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

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
```

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
http://localhost:8000
```

---

# 🌐 Live Demo

https://studentsupport-ai-1.onrender.com/

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
- 💬 Chat history
- 🌍 Multi-language support
- 🎯 Personalized learning recommendations

---

# 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
Built with ❤️ using <strong>React</strong>, <strong>Flask</strong>, <strong>Python</strong>, <strong>SQLite</strong>, and <strong>Groq Llama 3.1</strong>.
</p>
