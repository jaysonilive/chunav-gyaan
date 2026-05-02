import React, { useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { roles } from '../data/electionData.js';
import { trackCivicLearning } from '../firebase.js';

export default function RolesPage() {
  useEffect(() => {
    roles.forEach(r => trackCivicLearning('official_role', r.title));
  }, []);

  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  };

  const badgeStyle = (bg) => ({
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
    background: bg + "15",
    color: bg,
    fontFamily: COLORS.fonts.body,
  });

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px", fontFamily: COLORS.fonts.heading }}>Key Election Officials</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px", fontFamily: COLORS.fonts.body }}>The massive machinery behind the world's largest democratic exercise.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        {roles.map((r, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ fontSize: "24px" }}>{r.icon}</div>
                <h3 style={{ margin: 0, fontSize: "16px", color: COLORS.navy, fontFamily: COLORS.fonts.heading }}>{r.title}</h3>
              </div>
              <span style={badgeStyle(r.color)}>{r.level}</span>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.textMuted, marginBottom: "6px", fontFamily: COLORS.fonts.body }}>Key Responsibilities:</div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: COLORS.text, lineHeight: 1.6, fontFamily: COLORS.fonts.body }}>
                {r.responsibilities.map((resp, idx) => <li key={idx} style={{ marginBottom: "4px" }}>{resp}</li>)}
              </ul>
            </div>
            <div style={{ background: "#f9f7f4", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontFamily: COLORS.fonts.body }}>
              <div style={{ display: "flex" }}><span style={{ color: COLORS.textMuted, width: "80px", flexShrink: 0 }}>Chosen By:</span> <span style={{ color: COLORS.text, fontWeight: "500" }}>{r.chosen}</span></div>
              <div style={{ display: "flex" }}><span style={{ color: COLORS.textMuted, width: "80px", flexShrink: 0 }}>Term:</span> <span style={{ color: COLORS.text, fontWeight: "500" }}>{r.term}</span></div>
              <div style={{ display: "flex" }}><span style={{ color: COLORS.textMuted, width: "80px", flexShrink: 0 }}>Oversight:</span> <span style={{ color: COLORS.text, fontWeight: "500" }}>{r.oversight}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
