import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants/colors.js';
import { glossaryTerms } from '../data/electionData.js';
import { trackEvent } from '../firebase.js';

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const cats = ["All", "Voting", "Officials", "Legal", "Counting", "Campaign Finance"];
  
  const filtered = useMemo(() => {
    return glossaryTerms.filter(t =>
      (category === "All" || t.category === category) &&
      (t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, category]);

  const handleSearchBlur = () => {
    if (search.trim() !== "") {
      trackEvent("glossary_searched", { term: search });
    }
  };

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
  });

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px" }}>Election Glossary</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px" }}>40+ key Indian election terms explained clearly.</p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          onBlur={handleSearchBlur}
          placeholder="🔍 Search terms..." 
          aria-label="Search glossary terms"
          style={{ flex: 1, minHeight: "44px", minWidth: "200px", padding: "10px 16px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, fontFamily: "inherit", fontSize: "14px", outline: "none" }} 
          onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {cats.map(c => (
            <button 
              key={c} 
              onClick={() => setCategory(c)} 
              aria-label={`Filter glossary by ${c}`}
              aria-pressed={category === c ? "true" : "false"}
              style={{ minHeight: "44px", minWidth: "44px", padding: "8px 14px", borderRadius: "20px", border: `2px solid ${COLORS.saffron}`, background: category === c ? COLORS.saffron : "transparent", color: category === c ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: "inherit", fontSize: "12px", fontWeight: "600" }}
              onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
              onBlur={e => e.target.style.outline = "none"}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
        {filtered.map((t, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: COLORS.navy }}>{t.term}</h3>
              <span style={badgeStyle(COLORS.saffron)}>{t.category}</span>
            </div>
            <p style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.6, margin: "0 0 8px" }}>{t.definition}</p>
            {t.related.length > 0 && <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Related: <span style={{ color: COLORS.saffron }}>{t.related.join(", ")}</span></div>}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: COLORS.textMuted }}>No terms found. Try a different search.</div>}
    </div>
  );
}
