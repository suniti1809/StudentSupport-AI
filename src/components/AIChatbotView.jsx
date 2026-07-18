import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function AIChatbotView() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful student assistant. Answer not to much compactly. Be brief, friendly, and to the point.' },
    { role: 'assistant', content: "Hello! I'm your AI academic companion. You can ask me to explain topics, structure study plans, solve sample problems, or review code. What are we studying today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const suggestions = [
    "What is data structures and algorithms?",
    "Explain the concept of recursion with an example",
    "Give me 5 practice questions for Python loops",
    "Explain database normalization in simple words"
  ];

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (!textToSend) setInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build history for backend, filtering out system prompt or keep as needed
      // backend routes accept messages in standard openai format: { role: 'user' | 'assistant' | 'system', content: string }
      const historyPayload = updatedMessages.slice(1, updatedMessages.length - 1);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          mode: 'chat',
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! I encountered an issue connecting to the AI brain. Please check that the Flask server is running and GROQ_API_KEY is configured." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(99, 102, 241, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 10px rgba(99,102,241,0.3)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>StudentSupport AI</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Powered by Groq Llama 3.1</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <AlertCircle size={14} style={{ color: 'var(--accent)' }} />
          <span>Real-time responses</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-layout">
        <div className="chat-messages">
          {messages.filter(m => m.role !== 'system').map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'bot'}`} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="chat-loading">
              <span>AI is thinking</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div className="chat-loading-dot"></div>
                <div className="chat-loading-dot"></div>
                <div className="chat-loading-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="chat-suggestions" style={{ marginTop: '12px' }}>
            {suggestions.map((sug, i) => (
              <button 
                key={i} 
                className="chat-suggestion-chip" 
                onClick={() => handleSend(sug)}
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="chat-input-area">
          <textarea
            className="textarea-input"
            rows="1"
            style={{ resize: 'none', height: '44px', padding: '10px 16px', borderRadius: '12px' }}
            placeholder="Ask a study question, explain a topic, code snippet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button 
            className="btn btn-primary" 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{ width: '44px', height: '44px', borderRadius: '12px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
