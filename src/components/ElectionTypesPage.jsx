import React, { useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { electionTypes } from '../data/electionData.js';
import { trackCivicLearning } from '../firebase.js';

export default function ElectionTypesPage() {
  useEffect(() => {
    electionTypes.forEach(e => trackCivicLearning('election_type', e.title));
  }, []);

  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px", fontFamily: COLORS.fonts.heading }}>Types of Elections</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px", fontFamily: COLORS.fonts.body }}>India has a federal structure with multiple levels of government and elections.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        {electionTypes.map((e, i) => (
          <div key={i} style={{ ...cardStyle, borderTop: `4px solid ${e.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ fontSize: "28px", background: e.color + "15", borderRadius: "8px", padding: "8px", lineHeight: 1 }}>{e.icon}</div>
              <h3 style={{ margin: 0, fontSize: "18px", color: COLORS.navy, fontFamily: COLORS.fonts.heading }}>{e.title}</h3>
            </div>
            <p style={{ fontSize: "14px", color: COLORS.text, lineHeight: 1.6, marginBottom: "16px", fontFamily: COLORS.fonts.body }}>{e.body}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", fontFamily: COLORS.fonts.body }}>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: COLORS.textMuted, width: "70px" }}>Frequency:</span> <span style={{ fontWeight: "600", color: COLORS.text }}>{e.freq}</span></div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: COLORS.textMuted, width: "70px" }}>Seats:</span> <span style={{ fontWeight: "600", color: COLORS.text }}>{e.seats}</span></div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: COLORS.textMuted, width: "70px" }}>System:</span> <span style={{ fontWeight: "600", color: COLORS.text }}>{e.winner}</span></div>
            </div>
            <div style={{ marginTop: "16px", background: "#f9f7f4", padding: "10px", borderRadius: "6px", fontSize: "12px", color: COLORS.textMuted, fontStyle: "italic", fontFamily: COLORS.fonts.body }}>
              <span style={{ fontWeight: "bold", color: COLORS.text, fontStyle: "normal" }}>Example: </span>{e.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
