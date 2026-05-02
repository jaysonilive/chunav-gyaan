import React, { useState, useMemo, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { timelineData } from '../data/electionData.js';
import { trackTimelineEngagement, trackCivicLearning } from '../firebase.js';

export default function TimelinePage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const phases = { pre: "Pre-Election", campaign: "Campaign", voting: "Polling Day", post: "Post-Election", cert: "Certification" };
  const phaseColors = { pre: COLORS.ashoka, campaign: COLORS.green, voting: COLORS.saffron, post: COLORS.navyLight, cert: COLORS.gold };
  
  const filtered = useMemo(() => {
    return filter === "all" ? timelineData : timelineData.filter(t => t.phase === filter);
  }, [filter]);

  useEffect(() => {
    trackCivicLearning('timeline', filter);
  }, [filter]);

  const toggleExpand = (t) => {
    if (selected?.id === t.id) {
      setSelected(null);
    } else {
      setSelected(t);
      trackTimelineEngagement(t.title, t.phase);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px", fontFamily: COLORS.fonts.heading }}>Indian Election Timeline</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px", fontFamily: COLORS.fonts.body }}>The complete journey of an Indian general election — click any milestone to learn more.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {[["all", "All Phases"], ...Object.entries(phases)].map(([k, v]) => (
          <button 
            key={k} 
            onClick={() => setFilter(k)} 
            aria-label={`Filter by ${v}`}
            aria-pressed={filter === k ? "true" : "false"}
            style={{ minHeight: "44px", minWidth: "44px", padding: "6px 16px", borderRadius: "20px", border: `2px solid ${k === "all" ? COLORS.saffron : phaseColors[k] || COLORS.saffron}`, background: filter === k ? (k === "all" ? COLORS.saffron : phaseColors[k] || COLORS.saffron) : "transparent", color: filter === k ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: COLORS.fonts.body, fontSize: "13px", fontWeight: "600" }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "28px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${COLORS.saffron}, ${COLORS.green})`, borderRadius: "2px" }} />
        {filtered.map(t => (
          <div key={t.id} style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, boxShadow: `0 0 0 4px ${t.color}30`, zIndex: 1 }}>{t.icon}</div>
            <div style={{ flex: 1, background: selected?.id === t.id ? `${t.color}10` : "#fff", border: `1px solid ${selected?.id === t.id ? t.color : COLORS.border}`, borderRadius: "12px", padding: "14px 18px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px" }}>
                <div>
                  <span style={{ display: "inline-block", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", background: (phaseColors[t.phase] || COLORS.saffron) + "15", color: phaseColors[t.phase] || COLORS.saffron, fontFamily: COLORS.fonts.body }}>{phases[t.phase]}</span>
                  <h3 style={{ margin: "6px 0 2px", fontSize: "16px", color: COLORS.navy, fontFamily: COLORS.fonts.heading }}>{t.title}</h3>
                  <div style={{ fontSize: "12px", color: COLORS.textMuted, fontFamily: COLORS.fonts.body }}>{t.date}</div>
                </div>
                <button 
                  onClick={() => toggleExpand(t)}
                  aria-expanded={selected?.id === t.id ? "true" : "false"}
                  aria-label={selected?.id === t.id ? "Collapse details" : "Expand details"}
                  style={{ minHeight: "44px", minWidth: "44px", fontSize: "20px", background: "transparent", border: "none", cursor: "pointer", color: COLORS.text }}
                >
                  {selected?.id === t.id ? "▲" : "▼"}
                </button>
              </div>
              {selected?.id === t.id && (
                <div style={{ marginTop: "14px", borderTop: `1px solid ${COLORS.border}`, paddingTop: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                    {[["📌 What Happens", t.what], ["👥 Who's Involved", t.who], ["❓ Why It Matters", t.why], ["⏱️ Duration", t.duration]].map(([label, val]) => (
                      <div key={label} style={{ background: "#f9f7f4", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: t.color, marginBottom: "4px", fontFamily: COLORS.fonts.body }}>{label}</div>
                        <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5, fontFamily: COLORS.fonts.body }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
