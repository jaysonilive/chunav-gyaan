import React, { useState } from 'react';
import { COLORS } from '../constants/colors.js';
import { steps } from '../data/electionData.js';
import { trackEvent } from '../firebase.js';

export default function HowToVotePage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]);

  const toggleDone = (i) => {
    if (!done.includes(i)) {
      trackEvent('vote_step_completed', { step_number: i });
      setDone(d => [...d, i]);
    } else {
      setDone(d => d.filter(x => x !== i));
    }
  };

  const s = steps[step];

  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  };

  const btnSecondaryStyle = {
    background: "transparent",
    color: COLORS.text,
    border: `2px solid ${COLORS.border}`,
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "44px",
    minWidth: "44px",
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px" }}>How to Vote in India</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px" }}>A step-by-step guide to exercising your democratic right as an Indian citizen.</p>

      {/* Progress Bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px", alignItems: "center" }}>
        {steps.map((st, i) => (
          <button 
            key={i} 
            onClick={() => setStep(i)}
            aria-label={`Go to Step ${i + 1}: ${st.title}`}
            aria-selected={i === step ? "true" : "false"}
            style={{ minHeight: "44px", minWidth: "44px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer", background: "transparent", border: "none" }}
            onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
            onBlur={e => e.target.style.outline = "none"}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: i === step ? s.color : done.includes(i) ? COLORS.green : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#fff", transition: "all 0.2s", boxShadow: i === step ? `0 0 0 4px ${s.color}30` : "none" }}>{done.includes(i) ? "✓" : st.icon}</div>
            <div style={{ fontSize: "10px", color: i === step ? s.color : COLORS.textMuted, fontWeight: i === step ? "700" : "400", textAlign: "center", display: window.innerWidth > 600 ? "block" : "none" }}>Step {i + 1}</div>
          </button>
        ))}
      </div>

      {/* Step Card */}
      <div style={{ ...cardStyle, borderTop: `4px solid ${s.color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{ fontSize: "36px", background: s.color + "15", borderRadius: "12px", padding: "12px", lineHeight: 1 }}>{s.icon}</div>
          <div>
            <div style={{ fontSize: "12px", color: s.color, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Step {step + 1} of {steps.length}</div>
            <h3 style={{ margin: 0, fontSize: "20px", color: COLORS.navy }}>{s.title}</h3>
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: COLORS.text, marginBottom: "16px" }}>{s.content}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}30`, borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.green, marginBottom: "6px" }}>💡 Pro Tip</div>
            <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{s.tip}</div>
          </div>
          <div style={{ background: `${COLORS.saffron}10`, border: `1px solid ${COLORS.saffron}30`, borderRadius: "10px", padding: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.saffronDark, marginBottom: "6px" }}>⚠️ Common Mistake</div>
            <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{s.warning}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button 
            style={{...btnSecondaryStyle, opacity: step === 0 ? 0.5 : 1}} 
            onClick={() => setStep(Math.max(0, step - 1))} 
            disabled={step === 0}
            aria-label="Previous Step"
            onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
            onBlur={e => e.target.style.outline = "none"}
          >
            ← Previous
          </button>
          
          <button 
            onClick={() => toggleDone(step)} 
            style={{ ...btnSecondaryStyle, background: done.includes(step) ? COLORS.green : "#f0f0f0", color: done.includes(step) ? "#fff" : COLORS.text, border: "none" }}
            aria-label={done.includes(step) ? "Unmark as Done" : "Mark as Done"}
            onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
            onBlur={e => e.target.style.outline = "none"}
          >
            {done.includes(step) ? "✓ Marked Done" : "Mark as Done"}
          </button>
          
          {step < steps.length - 1 && (
            <button 
              style={{...btnSecondaryStyle, background: COLORS.saffron, color: "#fff", border: "none"}} 
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              aria-label="Next Step"
              onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
              onBlur={e => e.target.style.outline = "none"}
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
