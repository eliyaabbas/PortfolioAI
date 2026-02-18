import os
import random
import uvicorn
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from pyngrok import ngrok
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
OLLAMA_BASE_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
MODEL_ID = "gemma3:4b"
NGROK_TOKEN = os.getenv("NGROK_TOKEN", "39lbbc8dbuKIztIKs5Nb6NudE7U_5GhZAHYx6AmhZWtjbWHsy")

# --- APP SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage
session_memory = defaultdict(list)

# --- PERSONA DEFINITION ---
SYSTEM_PROMPT = """
You are Eliya's AI Advocate — a confident, enthusiastic, and knowledgeable personal assistant built exclusively for Eliya Abbas Sayyed's Software Engineering Portfolio.

YOUR CORE MISSION: Make every visitor impressed by Eliya's capabilities. You are Eliya's personal advocate.

CRITICAL RULES:
1. Eliya is MALE. Always use he/him/his pronouns. NEVER say "she" or "her".
2. ONLY state facts from the CONTEXT below. Do NOT invent certifications, degrees, or achievements that are not listed.
3. Keep responses to 2-3 sentences MAX. Be specific — cite project names and tools.
4. When answering technical questions, tie it back to Eliya's real projects.
5. End with a short hook encouraging the visitor to explore more.
6. STOP after answering. Do NOT repeat yourself or add filler.
7. Do NOT write code, tutorials, or answer general programming questions. You are a portfolio assistant, NOT a coding tutor.
8. NEVER answer general knowledge questions (history, science, geography, current events, etc.). If someone asks ANYTHING not related to Eliya's portfolio, skills, or projects, say something like: "That's outside my scope! I'm here to talk about Eliya's work. Want to hear about his projects or skills?"
"""

PROJECT_CONTEXT = """
=== ABOUT ELIYA ===
Name: Eliya Abbas Sayyed
Age: 26 years old
Gender: Male
Location: Mumbai, India
Title: Python Developer | Data Analyst | ML Engineer | Full Stack Builder
Tagline: "Building intelligent solutions with Python, Data & AI — turning raw data into real impact."
Experience: 1+ years in software engineering and data analysis
Education:
- B.E. in Computer Science & Engineering (AI & Machine Learning) — 7.75 CGPA, M.H. Saboo Siddik College of Engineering, Mumbai University (2024)
- Polytechnic Diploma — 7.24 CGPA, Sri Satya Sai College of Medical Science and Technology, Sehore, Bhopal, Madhya Pradesh (2019)
Currently Learning: AWS Cloud Services, advanced Large Language Models

=== KEY PROJECTS ===

1. **QR Digital Menu Platform**
   - Full-stack web app for restaurants to create and manage digital menus
   - Tech: React, Node.js, MongoDB, Express.js
   - Features: QR code generation, admin dashboard, custom templates, JWT authentication, order management
   - Impact: End-to-end production-ready system with authentication and real-time management

2. **Wallet Risk Scoring System**
   - ML-based credit scoring system for DeFi wallets operating on a 0–1000 scale
   - Tech: Python, Scikit-learn, Pandas, Feature Engineering
   - Features: Unsupervised ML for transaction pattern analysis, risk score assignment
   - Impact: Novel approach to assessing blockchain wallet risk using data science

3. **AI Interviewer Concept**
   - LLM-powered technical interview simulator
   - Tech: Python, LLMs, Prompt Engineering, NLP
   - Features: Generates questions, evaluates candidate responses, delivers detailed feedback
   - Impact: Simulates a real interview experience — showcases advanced prompt engineering

4. **Portfolio AI Chatbot** (THIS PROJECT)
   - A biased AI assistant for Eliya's portfolio site
   - Tech: React 19, Vite, Node.js/Express, FastAPI, Gemma 3 4B via Ollama
   - Architecture: 3-tier (React frontend → Express API gateway → FastAPI + Ollama)
   - Features: Session memory, smart guardrails, biased persona
   - Impact: Demonstrates end-to-end ML deployment, prompt engineering, and full-stack integration

=== SKILLS (with proficiency) ===
- Python: 95% — primary language for everything from automation to ML
- SQL: 88% — strong database querying and analytics
- Data Analysis: 90% — Pandas, data wrangling, insights extraction
- Machine Learning: 82% — Scikit-learn, feature engineering, model building
- React: 80% — modern frontend development
- Tableau: 78% — data visualization and dashboarding
- Node.js: 75% — backend APIs and server-side logic
- MongoDB: 72% — NoSQL database design
- LLMs & Prompt Engineering: 70% — Gemma, Mistral, Llama, prompt design
- AWS: 45% — currently expanding cloud expertise

=== SKILL CATEGORIES ===
- Frontend: React, JavaScript, HTML5, CSS3
- Backend: Node.js, MongoDB, REST APIs, Express.js
- Data & Analytics: Python, SQL, Tableau, Pandas
- Machine Learning: Scikit-learn, Feature Engineering, LLMs, Prompt Engineering

=== WHY HIRE ELIYA? ===
- Rare combo of full-stack development AND data science/ML skills
- 1+ years of hands-on experience building real products
- Proven ability to deploy ML models to production (this chatbot is proof!)
- Strong foundation in CS with AI/ML specialization
- Currently expanding into cloud (AWS) — always growing
"""

# --- OFF-TOPIC REDIRECT RESPONSES ---
OFF_TOPIC_REDIRECTS = [
    "That's an interesting topic! But I'm specialized in showcasing Eliya's work. Did you know he built a **Wallet Risk Scoring System** using Python and Scikit-learn? Ask me about it!",
    "Great question, but I'm Eliya's dedicated AI assistant! I'd love to tell you about his **QR Digital Menu Platform** — a full-stack React/Node.js app. Want to hear more?",
    "I appreciate the curiosity! I'm designed to talk about Eliya's portfolio though. Fun fact: he built me using **Gemma 3** and a 3-tier architecture. Ask me how!",
    "Interesting thought! My expertise is all about Eliya's skills and projects. He's got **1+ years of experience** across Python, ML, and full-stack dev. What would you like to know?",
]

# --- SMART GUARDRAILS ---
BLOCKED_TOPICS = ['stock', 'invest', 'crypto', 'forex', 'finance market', 'trading']
OFF_TOPIC_KEYWORDS = [
    'weather forecast', 'politics today', 'religion debate', 'sports score', 'recipe for', 'cooking tips',
    'celebrity news', 'gossip about', 'movie review', 'song lyrics', 'tell me a joke',
    'write me a poem', 'tell me a story', 'who is the president',
    'meaning of life', 'horoscope', 'astrology',
    'capital of india', 'capital of usa', 'population of',
    'who invented the', 'who discovered the', 'who won the',
    'world war', 'translate this', 'tallest building',
    'richest person', 'election results', 'latest news',
    'play a game', 'anime recommendation', 'manga recommendation',
]

CODING_REQUEST_KEYWORDS = [
    'write me a', 'write a code', 'write code', 'code for', 'how to code',
    'write a program', 'write a script', 'write a function', 'give me code',
    'show me code', 'code example', 'hello world', 'implement a', 'create a function',
    'solve this', 'fix this code', 'debug this', 'explain this code',
]

CODING_REDIRECTS = [
    "I'm Eliya's portfolio assistant, not a coding tutor! But speaking of coding — Eliya's **Python proficiency is at 95%** and he uses it across all his projects. Want to know about his work?",
    "I don't write code, but Eliya sure does! He's built everything from **ML models** to **full-stack web apps**. Ask me about his projects instead! 🚀",
    "That's a great coding question, but I'm here to showcase Eliya's portfolio! Fun fact: he built a **Wallet Risk Scoring System** entirely in Python. Want to hear more?",
]

QUICK_REPLIES = {
    'hi': "Hey there! 👋 I'm Eliya's AI assistant. I can tell you about his **projects**, **skills**, or **why you should work with him**. What interests you?",
    'hello': "Hello! 👋 I'm Eliya's AI assistant. I can tell you about his **projects**, **skills**, or **why you should work with him**. What interests you?",
    'hey': "Hey! 👋 Welcome to Eliya's portfolio. Ask me about his **projects**, **tech stack**, or **experience** — I know it all!",
    'yo': "Yo! 👋 I'm Eliya's personal AI. Fire away — ask me about his **skills**, **projects**, or anything about his work!",
    'thanks': "You're welcome! Feel free to reach out to Eliya through the **Contact** section if you'd like to connect. 🚀",
    'thank you': "Happy to help! If you're impressed (you should be 😄), Eliya would love to hear from you — check the **Contact** section!",
    'bye': "Goodbye! Thanks for exploring Eliya's portfolio. Don't forget to check out his projects and reach out if you'd like to collaborate! 🚀",
    'who are you': "I'm Eliya's AI Advocate — an intelligent assistant built with **Gemma 3**, **FastAPI**, and **React**. I'm here to showcase everything Eliya can do. What would you like to know?",
    'what can you do': "I can tell you all about Eliya's **projects** (like his ML-powered Wallet Risk Scorer), his **skills** (Python at 95%!), his **education**, and why he'd be a great fit for your team. What interests you?",
}



async def call_ollama(messages):
    """Call Ollama's chat API."""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": MODEL_ID,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "top_p": 0.9,
                    "num_predict": 250,
                    "repeat_penalty": 1.2,
                }
            }
        )
        response.raise_for_status()
        data = response.json()
        return data["message"]["content"]


def _save_to_memory(session_id, user_input, reply):
    """Save both user message and bot reply to session memory."""
    memory = session_memory[session_id]
    memory.append({"role": "user", "content": user_input})
    memory.append({"role": "assistant", "content": reply})
    session_memory[session_id] = memory[-10:]


def generate_response(user_input, session_id="default"):
    """Synchronous wrapper — the actual LLM call is async."""
    import asyncio
    return asyncio.run(_generate_response(user_input, session_id))


async def _generate_response(user_input, session_id="default"):
    try:
        user_input = user_input.strip()
        
        # --- 1. Fast Guardrails ---
        if not user_input:
             return {"reply": "...", "success": True}
        
        lower_input = user_input.lower()

        # Quick replies for common messages
        for key, reply in QUICK_REPLIES.items():
            if lower_input == key or lower_input == key + '!':
                _save_to_memory(session_id, user_input, reply)
                return {"reply": reply, "success": True}

        # Block financial topics
        if any(w in lower_input for w in BLOCKED_TOPICS):
            reply = "I'm specialized in Eliya's software portfolio, not financial advice! But speaking of impressive work — Eliya built a **Wallet Risk Scoring System** using ML. Want to know more about that instead?"
            _save_to_memory(session_id, user_input, reply)
            return {"reply": reply, "success": True}

        # Redirect off-topic questions
        if any(w in lower_input for w in OFF_TOPIC_KEYWORDS):
            reply = random.choice(OFF_TOPIC_REDIRECTS)
            _save_to_memory(session_id, user_input, reply)
            return {"reply": reply, "success": True}

        # Redirect coding/tutorial requests
        if any(w in lower_input for w in CODING_REQUEST_KEYWORDS):
            reply = random.choice(CODING_REDIRECTS)
            _save_to_memory(session_id, user_input, reply)
            return {"reply": reply, "success": True}

        # --- 2. Build Conversation Context ---
        memory = session_memory[session_id]
        memory.append({"role": "user", "content": user_input})
        
        # Keep last 10 messages (5 full turns)
        recent_history = memory[-10:]
        
        # Enforce alternation (must start with user)
        if recent_history and recent_history[0]['role'] == 'assistant':
            recent_history = recent_history[1:]

        # Construct full message list for LLM
        messages = [
            {"role": "user", "content": f"[SYSTEM INSTRUCTIONS]\n{SYSTEM_PROMPT}\n\n[ELIYA'S PORTFOLIO CONTEXT]\n{PROJECT_CONTEXT}"},
            {"role": "assistant", "content": "Understood! I'll only use the facts provided about Eliya, keep responses concise (2-3 sentences), use he/him pronouns, and never invent information. How can I help you learn about Eliya?"},
        ] + recent_history

        # --- 3. Generate via Ollama ---
        reply = await call_ollama(messages)
        reply = reply.strip()

        if not reply:
            reply = "I'd love to tell you more about Eliya! Try asking about his projects, skills, or experience."
             
        # Update memory
        memory.append({"role": "assistant", "content": reply})
        session_memory[session_id] = memory[-10:]
        
        return {"reply": reply, "success": True}

    except httpx.ConnectError:
        return {"reply": "Ollama is not running. Please start it with `ollama serve`.", "success": False}
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        if session_memory[session_id] and session_memory[session_id][-1]['role'] == 'user':
            session_memory[session_id].pop()
            
        return {"reply": "I encountered a temporary error. Please try asking again.", "success": False, "error": str(e)}

# --- FEEDBACK SYSTEM (lightweight reinforcement) ---
import json
from datetime import datetime

FEEDBACK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "feedback_log.json")

def save_feedback(entry):
    data = []
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, "r") as f:
            data = json.load(f)
    data.append(entry)
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.post("/chat")
async def chat_endpoint(data: dict):
    msg = data.get("message", "")
    sid = data.get("session_id", "default")
    return await _generate_response(msg, sid)

@app.post("/feedback")
async def feedback_endpoint(data: dict):
    """Log user feedback (thumbs up/down) for reinforcement."""
    entry = {
        "timestamp": datetime.now().isoformat(),
        "session_id": data.get("session_id", "default"),
        "user_message": data.get("user_message", ""),
        "bot_reply": data.get("bot_reply", ""),
        "rating": data.get("rating", ""),
    }
    save_feedback(entry)
    return {"status": "feedback saved", "success": True}

@app.get("/history/{session_id}")
async def get_history(session_id: str):
    """Debug: view conversation history for a session."""
    return {"session_id": session_id, "history": session_memory.get(session_id, [])}

@app.get("/")
def root():
    return {"status": "running", "model": MODEL_ID}

if __name__ == "__main__":
    print(f"🚀 Starting Server with {MODEL_ID} via Ollama...")
    print(f"📡 Ollama URL: {OLLAMA_BASE_URL}")

    # Connect Ngrok for public access
    if NGROK_TOKEN:
        ngrok.set_auth_token(NGROK_TOKEN)
        try:
            public_url = ngrok.connect(8000).public_url
            print(f"\n🔗 PUBLIC URL: {public_url}")
            print(f"🔗 CHAT ENDPOINT: {public_url}/chat\n")
        except Exception as e:
            print(f"⚠️  Ngrok connection failed: {e}")
            print("Running locally on http://localhost:8000")
    else:
        print("⚠️  No NGROK_TOKEN found. Running locally only on http://localhost:8000")
        print("Set NGROK_TOKEN in .env to expose publicly.")

    uvicorn.run(app, host="0.0.0.0", port=8000)
