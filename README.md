# Portfolio AI Chatbot 🚀

A modern, responsive personal portfolio website for **Eliya Abbas Sayyed**, featuring an integrated AI-powered chatbot. This project showcases professional experience in Software Engineering and Data Analysis while providing an interactive AI assistant powered by **Mistral 7B Instruct v0.3**.

## ✨ Features

- **Dynamic Hero Section**: Engaging introduction to Eliya's professional background.
- **AI Chatbot (Eliya's AI Agent)**: Real-time assistant powered by Mistral 7B, trained to answer queries specifically about Eliya's technical expertise and projects.
- **Project Showcase**: Highlights key works like the **QR-based Digital Menu** and **Wallet Risk Scoring**.
- **Skills & About**: Detailed breakdown of technical stack including Python, SQL, Machine Learning, and LLMs.
- **Responsive Design**: Optimized for seamless viewing across all devices.
- **Strict Domain Boundary**: AI is configured to stay focused on technical topics and professional queries.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI library for building interactive components.
- **Vite**: Ultra-fast build tool and development server.
- **Vanilla CSS**: Custom-crafted styles for maximum flexibility and performance.

### Backend
- **Node.js & Express**: API gateway for handling chat requests.
- **Mistral 7B Instruct v0.3**: Heavy-lifting LLM service.
- **FastAPI (via Ngrok)**: Used for serving the LLM model in development environments.

---

## 📁 Project Structure

```text
Portfolio/
├── frontend/           # React application (Vite)
│   ├── src/
│   │   ├── components/ # UI Components (About, Chatbot, Project, etc.)
│   │   ├── styles/     # CSS Modules and global styles
│   │   └── App.jsx     # Main application entry
├── backend/            # Express.js API
│   ├── src/
│   │   ├── controllers/# Chat logic and guardrails
│   │   ├── services/   # LLM service integration
│   │   └── config/     # Environment configurations
│   └── server.js       # Entry point for backend
└── AICHATPortfolio.ipynb # Jupyter notebook for model serving and testing
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.10+ (for running the LLM notebook)
- Ngrok account (optional, for public LLM access)

### 1. Model Setup (Optional)
The chatbot relies on a running instance of the LLM. You can use the provided `AICHATPortfolio.ipynb` to host the Mistral 7B model on a GPU-enabled environment (like Google Colab).
1. Run the cells in `AICHATPortfolio.ipynb`.
2. Obtain the public Ngrok URL.

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
LLM_API_URL=your_ngrok_url/chat
NODE_ENV=development
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```
Run the frontend development server:
```bash
npm run dev
```

---

## 🎨 Author
**Eliya Abbas Sayyed** - [GitHub](https://github.com/SpiderEL)
*Python Developer & Data Analyst*

## 📄 License
This project is licensed under the MIT License.
