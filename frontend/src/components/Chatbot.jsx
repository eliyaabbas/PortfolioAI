import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/chatbot.css';

const API_URL = '/api/chat';

const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        text: "Hey! 👋 I'm **Eliya's AI Advocate** — ask me anything about his skills, projects, or why you should work with him!",
    },
];

const SUGGESTED_QUESTIONS = [
    "What are Eliya's top skills?",
    "Tell me about his projects",
    "Why should I hire Eliya?",
    "How was this chatbot built?",
];

export default function Chatbot() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showChips, setShowChips] = useState(true);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const el = messagesContainerRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, isTyping]);

    const handleSend = async (overrideMessage) => {
        const trimmed = (overrideMessage || input).trim();
        if (!trimmed || isTyping) return;

        // Hide chips after first user message
        setShowChips(false);

        const userMsg = { id: Date.now(), sender: 'user', text: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed }),
            });

            const data = await res.json();

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: data.success ? data.reply : (data.error || 'Something went wrong.'),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, sender: 'bot', text: 'Unable to reach the server. Please try again later.' },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <section className="chatbot" id="chatbot">
            <div className="chatbot__container">
                <h2 className="section-title">AI Chat</h2>
                <div className="chatbot__window">
                    <div className="chatbot__header">
                        <div className="chatbot__status" />
                        <span>Eliya's AI Advocate</span>
                    </div>
                    <div className="chatbot__messages" ref={messagesContainerRef}>
                        {messages.map((msg) => (
                            <div className={`chatbot__bubble chatbot__bubble--${msg.sender}`} key={msg.id}>
                                {msg.sender === 'bot' ? (
                                    <ReactMarkdown
                                        components={{
                                            p: ({ children }) => <span>{children}</span>,
                                            a: ({ href, children }) => (
                                                <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                                            ),
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}

                        {showChips && (
                            <div className="chatbot__chips">
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        className="chatbot__chip"
                                        onClick={() => handleSend(q)}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isTyping && (
                            <div className="chatbot__bubble chatbot__bubble--bot chatbot__typing">
                                <span /><span /><span />
                            </div>
                        )}

                    </div>
                    <div className="chatbot__input-area">
                        <input
                            className="chatbot__input"
                            type="text"
                            placeholder="Ask about Eliya's skills, projects, experience..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="chatbot__send" onClick={() => handleSend()} aria-label="Send message">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
