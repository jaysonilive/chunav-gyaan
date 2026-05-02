import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { trackAIChat } from '../firebase.js';

export default function AskAIPage() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Jai Hind! 🇮🇳 I'm your Indian Election Guide assistant. Ask me anything about the Indian election process — voter registration, EVMs, ECI, Lok Sabha, Model Code of Conduct, or anything else!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const suggestions = ["How do I register to vote in India?", "What is the Model Code of Conduct?", "How does EVM voting work?", "What is NOTA?", "How is the Prime Minister elected?", "What happens during vote counting?"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
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
          systemPrompt: "You are an expert, neutral, and friendly guide on the Indian election process. You explain concepts clearly using simple language, Indian context, and real examples. Topics you know deeply: ECI, EVM, VVPAT, Lok Sabha, Rajya Sabha, Vidhan Sabha, Model Code of Conduct, voter registration (Form 6, EPIC), postal ballots, nomination process, counting, result declaration, formation of government, key officials, election types, and Indian electoral law. Always be non-partisan, accurate, and cite relevant constitutional articles or laws when helpful. Respond in 2-4 paragraphs.",
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

  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  };

  const btnStyle = {
    background: COLORS.saffron,
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "44px",
    minWidth: "44px",
    fontFamily: COLORS.fonts.body,
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px", fontFamily: COLORS.fonts.heading }}>Ask AI — Election Assistant</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "16px", fontFamily: COLORS.fonts.body }}>Powered by Groq Llama-3 — ask any question about the Indian election process.</p>
      <div style={{ background: `${COLORS.saffron}10`, border: `1px solid ${COLORS.saffron}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: COLORS.saffronDark, fontFamily: COLORS.fonts.body }}>⚖️ This assistant provides civic education only — not legal or partisan advice.</div>
      
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        <div style={{ height: "420px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }} aria-live="polite" aria-label="AI response">
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", background: m.role === "user" ? COLORS.saffron : "#f5f5f5", color: m.role === "user" ? "#fff" : COLORS.text, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", fontSize: "14px", lineHeight: 1.6, fontFamily: COLORS.fonts.body }}>
                {m.role === "assistant" && <span style={{ fontSize: "16px", marginRight: "6px" }}>🇮🇳</span>}
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: "#f5f5f5", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: "14px", color: COLORS.textMuted, fontFamily: COLORS.fonts.body }}>🇮🇳 Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
        
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => send(s)} 
                aria-label={`Ask: ${s}`}
                style={{ minHeight: "44px", padding: "8px 16px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontFamily: COLORS.fonts.body, fontSize: "12px", color: COLORS.text, transition: "all 0.2s" }}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && send()} 
              placeholder="Ask about Indian elections..." 
              aria-label="Type your question for AI"
              style={{ minHeight: "44px", flex: 1, padding: "10px 16px", borderRadius: "24px", border: `1px solid ${COLORS.border}`, fontFamily: COLORS.fonts.body, fontSize: "14px", outline: "none" }} 
            />
            <button 
              onClick={() => send()} 
              style={btnStyle} 
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
