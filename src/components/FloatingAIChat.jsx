import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { trackAIChat } from '../firebase.js';

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Jai Hind! 🇮🇳 I'm your AI Election Guide assistant. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "You are an expert, neutral, and friendly guide on the Indian election process. You explain concepts clearly using simple language, Indian context, and real examples. Respond in 1-2 short paragraphs.",
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await resp.json();
      const reply = data.reply || data.error || "I couldn't fetch a response. Please try again.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
      trackAIChat(msg, reply);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    }
    setLoading(false);
  };

  const btnStyle = {
    background: COLORS.saffron,
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "44px",
    minWidth: "44px",
    fontFamily: COLORS.fonts.body,
  };

  return (
    <>
      {isOpen && (
        <div style={{ position: "fixed", bottom: "90px", right: "24px", width: "350px", height: "500px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 100%)`, color: "#fff", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", fontFamily: COLORS.fonts.heading }}><span style={{fontSize:"20px"}}>🤖</span> Ask AI Assistant</div>
            <button 
              onClick={() => setIsOpen(false)} 
              aria-label="Close AI Chat"
              style={{ minHeight: "44px", minWidth: "44px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}
            >✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: COLORS.cream }} aria-live="polite" aria-label="AI response">
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? COLORS.saffron : "#fff", color: m.role === "user" ? "#fff" : COLORS.text, border: m.role === "user" ? "none" : `1px solid ${COLORS.border}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: "14px", lineHeight: 1.5, boxShadow: "0 2px 5px rgba(0,0,0,0.05)", fontFamily: COLORS.fonts.body }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: "14px", color: COLORS.textMuted, boxShadow: "0 2px 5px rgba(0,0,0,0.05)", fontFamily: COLORS.fonts.body }}>Thinking...</div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px", background: "#fff", display: "flex", gap: "8px" }}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && send()} 
              placeholder="Ask something..." 
              aria-label="Type message for floating AI chat"
              style={{ minHeight: "44px", flex: 1, padding: "10px 14px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, fontFamily: COLORS.fonts.body, fontSize: "14px", outline: "none" }} 
            />
            <button 
              onClick={send} 
              disabled={loading || !input.trim()} 
              style={btnStyle}
              aria-label="Send message"
            >Send</button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
        aria-expanded={isOpen ? "true" : "false"}
        style={{ position: "fixed", bottom: "24px", right: "24px", width: "60px", height: "60px", borderRadius: "30px", background: COLORS.saffron, color: "#fff", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,107,0,0.4)", zIndex: 1001, border: "none", transition: "transform 0.2s" }}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}
