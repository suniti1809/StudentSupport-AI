import os
import sqlite3
import httpx
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from typing import Optional, List, Dict

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

DATABASE = os.path.abspath("./campusassist.db")

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)  # Enable CORS for local dev

# ---------------------------------------------------------------------
# Database initialization & helper functions
# ---------------------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    # Notes table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Planner table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS planner (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            due_date DATE,
            completed INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Quiz results table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            score INTEGER,
            total INTEGER,
            taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Assignments table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            course TEXT,
            due_date DATE,
            status TEXT DEFAULT 'Pending',
            priority TEXT DEFAULT 'Medium',
            grade TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Reminders table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            remind_at TIMESTAMP,
            completed INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Mood logs table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mood TEXT NOT NULL,
            note TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Timer sessions table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS timer_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_title TEXT,
            duration_seconds INTEGER NOT NULL,
            category TEXT DEFAULT 'General',
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Counselling appointments table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS counselling_appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            counselor TEXT NOT NULL,
            appointment_time TIMESTAMP NOT NULL,
            status TEXT DEFAULT 'Scheduled',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    # Internship applications table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS internship_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            status TEXT DEFAULT 'Applied',
            url TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()

# Initialize Database
init_db()

# ---------------------------------------------------------------------
# Serve Static Frontend Files at Root
# ---------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

# ---------------------------------------------------------------------
# Chat Endpoint (Groq API)
# ---------------------------------------------------------------------
@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    data = request.json or {}
    message = data.get("message", "").strip()
    mode = data.get("mode", "chat").strip()
    history = data.get("history", [])
    
    if not message:
        return jsonify({"error": "Message is required"}), 400

    if not GROQ_API_KEY:
        return jsonify({"reply": "Error: GROQ_API_KEY not configured on backend."}), 500

    if mode == "mock_interview":
        role_type = data.get("role", "Software Engineer")
        system_content = (
            f"You are an expert technical interviewer conducting a mock interview for a {role_type} role. "
            "Your task is to ask the user ONE question at a time (mix of technical, coding, or behavioral questions). "
            "When the user answers, give a brief, highly constructive 1-2 sentence critique of their response, "
            "and then ask your next interview question. Do not output long explanations. Keep it professional."
        )
    elif mode == "career_guidance":
        system_content = (
            "You are a professional student academic advisor and career coach. "
            "Based on the user's inquiry (skills, interests, major, grades), provide "
            "a structured, brief career path advice. Include: 1) recommended roles, "
            "2) top 3 skills to learn, and 3) immediate action steps. Keep it highly practical, motivating, and brief."
        )
    else:
        system_content = "You are a helpful student assistant. Answer not to much compactly. Be brief, friendly, and to the point."

    messages = [{"role": "system", "content": system_content}]
    for msg in history:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    messages.append({"role": "user", "content": message})

    try:
        with httpx.Client() as client:
            response = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": messages,
                    "temperature": 0.3 if mode != "chat" else 0.15,
                    "max_tokens": 400 if mode == "career_guidance" else 250,
                },
                timeout=30,
            )
        response.raise_for_status()
        res_data = response.json()
        reply = res_data["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": f"Error communicating with AI model: {str(e)}"}), 500

# ---------------------------------------------------------------------
# Notes Endpoints
# ---------------------------------------------------------------------
@app.route("/api/notes", methods=["GET", "POST"])
def notes_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM notes ORDER BY created_at DESC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])

    elif request.method == "POST":
        data = request.json or {}
        title = data.get("title", "").strip()
        content = data.get("content", "").strip()
        if not title or not content:
            return jsonify({"error": "Title and Content are required"}), 400

        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO notes (title, content) VALUES (?, ?)", (title, content))
        conn.commit()
        nid = cur.lastrowid
        row = conn.execute("SELECT * FROM notes WHERE id = ?", (nid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = get_db()
    conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ---------------------------------------------------------------------
# Planner Endpoints
# ---------------------------------------------------------------------
@app.route("/api/planner", methods=["GET", "POST"])
def planner_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM planner ORDER BY completed ASC, due_date ASC").fetchall()
        conn.close()
        items = []
        for r in rows:
            d = dict(r)
            d["completed"] = bool(d["completed"])
            items.append(d)
        return jsonify(items)

    elif request.method == "POST":
        data = request.json or {}
        title = data.get("title", "").strip()
        due_date = data.get("due_date")
        if not title:
            return jsonify({"error": "Title is required"}), 400

        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO planner (title, due_date) VALUES (?, ?)", (title, due_date))
        conn.commit()
        pid = cur.lastrowid
        row = conn.execute("SELECT * FROM planner WHERE id = ?", (pid,)).fetchone()
        conn.close()
        d = dict(row)
        d["completed"] = bool(d["completed"])
        return jsonify(d), 201

@app.route("/api/planner/<int:item_id>/complete", methods=["POST"])
def complete_planner_item(item_id):
    conn = get_db()
    conn.execute("UPDATE planner SET completed = 1 WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

@app.route("/api/planner/<int:item_id>", methods=["DELETE"])
def delete_planner_item(item_id):
    conn = get_db()
    conn.execute("DELETE FROM planner WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ---------------------------------------------------------------------
# Assignments Endpoints
# ---------------------------------------------------------------------
@app.route("/api/assignments", methods=["GET", "POST"])
def assignments_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM assignments ORDER BY due_date ASC, priority DESC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        title = data.get("title", "").strip()
        course = data.get("course", "").strip()
        due_date = data.get("due_date", "")
        status = data.get("status", "Pending").strip()
        priority = data.get("priority", "Medium").strip()
        grade = data.get("grade", "").strip()
        
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO assignments (title, course, due_date, status, priority, grade) VALUES (?, ?, ?, ?, ?, ?)",
            (title, course, due_date, status, priority, grade)
        )
        conn.commit()
        aid = cur.lastrowid
        row = conn.execute("SELECT * FROM assignments WHERE id = ?", (aid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

@app.route("/api/assignments/<int:assignment_id>", methods=["PUT", "DELETE"])
def assignment_detail(assignment_id):
    if request.method == "DELETE":
        conn = get_db()
        conn.execute("DELETE FROM assignments WHERE id = ?", (assignment_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    elif request.method == "PUT":
        data = request.json or {}
        conn = get_db()
        conn.execute(
            "UPDATE assignments SET title = ?, course = ?, due_date = ?, status = ?, priority = ?, grade = ? WHERE id = ?",
            (data.get("title", ""), data.get("course", ""), data.get("due_date", ""), data.get("status", "Pending"), data.get("priority", "Medium"), data.get("grade", ""), assignment_id)
        )
        conn.commit()
        row = conn.execute("SELECT * FROM assignments WHERE id = ?", (assignment_id,)).fetchone()
        conn.close()
        return jsonify(dict(row))

# ---------------------------------------------------------------------
# Reminders Endpoints
# ---------------------------------------------------------------------
@app.route("/api/reminders", methods=["GET", "POST"])
def reminders_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM reminders ORDER BY remind_at ASC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        message = data.get("message", "").strip()
        remind_at = data.get("remind_at", "")
        if not message:
            return jsonify({"error": "Message is required"}), 400
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO reminders (message, remind_at) VALUES (?, ?)", (message, remind_at))
        conn.commit()
        rid = cur.lastrowid
        row = conn.execute("SELECT * FROM reminders WHERE id = ?", (rid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

@app.route("/api/reminders/<int:reminder_id>", methods=["PUT", "DELETE"])
def reminder_detail(reminder_id):
    if request.method == "DELETE":
        conn = get_db()
        conn.execute("DELETE FROM reminders WHERE id = ?", (reminder_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    elif request.method == "PUT":
        data = request.json or {}
        completed = int(data.get("completed", 0))
        conn = get_db()
        conn.execute("UPDATE reminders SET completed = ? WHERE id = ?", (completed, reminder_id))
        conn.commit()
        row = conn.execute("SELECT * FROM reminders WHERE id = ?", (reminder_id,)).fetchone()
        conn.close()
        return jsonify(dict(row))

# ---------------------------------------------------------------------
# Mood Endpoints
# ---------------------------------------------------------------------
@app.route("/api/moods", methods=["GET", "POST"])
def moods_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM mood_logs ORDER BY logged_at DESC LIMIT 30").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        mood = data.get("mood", "").strip()
        note = data.get("note", "").strip()
        if not mood:
            return jsonify({"error": "Mood is required"}), 400
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO mood_logs (mood, note) VALUES (?, ?)", (mood, note))
        conn.commit()
        mid = cur.lastrowid
        row = conn.execute("SELECT * FROM mood_logs WHERE id = ?", (mid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

# ---------------------------------------------------------------------
# Timer Session Endpoints
# ---------------------------------------------------------------------
@app.route("/api/timer/sessions", methods=["GET", "POST"])
def timer_sessions_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM timer_sessions ORDER BY logged_at DESC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        task_title = data.get("task_title", "").strip()
        duration_seconds = int(data.get("duration_seconds", 0))
        category = data.get("category", "General").strip()
        if duration_seconds <= 0:
            return jsonify({"error": "Duration must be positive"}), 400
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO timer_sessions (task_title, duration_seconds, category) VALUES (?, ?, ?)",
                    (task_title, duration_seconds, category))
        conn.commit()
        tid = cur.lastrowid
        row = conn.execute("SELECT * FROM timer_sessions WHERE id = ?", (tid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

# ---------------------------------------------------------------------
# Appointments Endpoints
# ---------------------------------------------------------------------
@app.route("/api/appointments", methods=["GET", "POST"])
def appointments_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM counselling_appointments ORDER BY appointment_time ASC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        counselor = data.get("counselor", "").strip()
        appointment_time = data.get("appointment_time", "").strip()
        notes = data.get("notes", "").strip()
        if not counselor or not appointment_time:
            return jsonify({"error": "Counselor and time are required"}), 400
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO counselling_appointments (counselor, appointment_time, status, notes) VALUES (?, ?, 'Scheduled', ?)",
                    (counselor, appointment_time, notes))
        conn.commit()
        aid = cur.lastrowid
        row = conn.execute("SELECT * FROM counselling_appointments WHERE id = ?", (aid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

@app.route("/api/appointments/<int:appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id):
    conn = get_db()
    conn.execute("DELETE FROM counselling_appointments WHERE id = ?", (appointment_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ---------------------------------------------------------------------
# Internship Applications Endpoints
# ---------------------------------------------------------------------
@app.route("/api/internships", methods=["GET", "POST"])
def internships_endpoint():
    if request.method == "GET":
        conn = get_db()
        rows = conn.execute("SELECT * FROM internship_applications ORDER BY created_at DESC").fetchall()
        conn.close()
        return jsonify([dict(row) for row in rows])
    elif request.method == "POST":
        data = request.json or {}
        title = data.get("title", "").strip()
        company = data.get("company", "").strip()
        status = data.get("status", "Applied").strip()
        url = data.get("url", "").strip()
        notes = data.get("notes", "").strip()
        if not title or not company:
            return jsonify({"error": "Title and Company are required"}), 400
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO internship_applications (title, company, status, url, notes) VALUES (?, ?, ?, ?, ?)",
                    (title, company, status, url, notes))
        conn.commit()
        iid = cur.lastrowid
        row = conn.execute("SELECT * FROM internship_applications WHERE id = ?", (iid,)).fetchone()
        conn.close()
        return jsonify(dict(row)), 201

@app.route("/api/internships/<int:internship_id>", methods=["PUT", "DELETE"])
def internship_detail(internship_id):
    if request.method == "DELETE":
        conn = get_db()
        conn.execute("DELETE FROM internship_applications WHERE id = ?", (internship_id,))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    elif request.method == "PUT":
        data = request.json or {}
        status = data.get("status", "Applied").strip()
        notes = data.get("notes", "").strip()
        conn = get_db()
        conn.execute("UPDATE internship_applications SET status = ?, notes = ? WHERE id = ?", (status, notes, internship_id))
        conn.commit()
        row = conn.execute("SELECT * FROM internship_applications WHERE id = ?", (internship_id,)).fetchone()
        conn.close()
        return jsonify(dict(row))

# ---------------------------------------------------------------------
# CGPA Endpoints
# ---------------------------------------------------------------------
@app.route("/api/cgpa", methods=["POST"])
def calculate_cgpa():
    data = request.json or {}
    semesters = data.get("semesters", [])
    if not semesters:
        return jsonify({"cgpa": 0.0})

    total_weighted = 0.0
    total_credits = 0
    for sem in semesters:
        gpa = float(sem.get("gpa", 0))
        credits = int(sem.get("credits", 0))
        total_weighted += gpa * credits
        total_credits += credits

    if total_credits == 0:
        return jsonify({"cgpa": 0.0})

    cgpa = total_weighted / total_credits
    return jsonify({"cgpa": round(cgpa, 2)})

# ---------------------------------------------------------------------
# Study Timer Endpoint
# ---------------------------------------------------------------------
@app.route("/api/timer", methods=["POST"])
def start_timer():
    data = request.json or {}
    minutes = int(data.get("minutes", 0))
    if minutes <= 0:
        return jsonify({"error": "Minutes must be positive"}), 400
    return jsonify({"seconds": minutes * 60})

# ---------------------------------------------------------------------
# Run application
# ---------------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
