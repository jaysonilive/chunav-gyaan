import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { quizQuestions } from '../data/electionData.js';
import { trackEvent } from '../firebase.js';

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardSource, setLeaderboardSource] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const q = quizQuestions[current];

  useEffect(() => {
    trackEvent("quiz_started");
  }, []);

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeaderboard(data.scores || []);
      setLeaderboardSource("google_sheets");
    } catch (err) {
      console.log("Using local storage fallback for leaderboard");
      const local = JSON.parse(localStorage.getItem("chunav_scores") || "[]");
      setLeaderboard(local);
      setLeaderboardSource("local");
    }
    setLeaderboardLoading(false);
  };

  useEffect(() => {
    if (done) {
      fetchLeaderboard();
    }
  }, [done]);

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.ans;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { correct, chosen: i, answer: q.ans }]);
  };

  const next = () => { 
    if (current < quizQuestions.length - 1) { 
      setCurrent(c => c + 1); 
      setSelected(null); 
    } else { 
      const pct = Math.round((score / quizQuestions.length) * 100);
      trackEvent("quiz_completed", { score, percentage: pct });
      setDone(true); 
    } 
  };

  const reset = () => { 
    setCurrent(0); 
    setSelected(null); 
    setScore(0); 
    setDone(false); 
    setAnswers([]); 
    setSubmitted(false); 
    setPlayerName(""); 
    trackEvent("quiz_started");
  };

  const submitScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || submitted) return;
    
    const pct = Math.round((score / quizQuestions.length) * 100);
    const scoreData = {
      name: playerName,
      score,
      total: quizQuestions.length,
      percentage: pct,
      date: new Date().toLocaleDateString("en-IN")
    };

    setSubmitted(true);

    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData)
      });
      if (!res.ok) throw new Error("Failed to save");
      // Fetch fresh leaderboard after saving
      fetchLeaderboard();
    } catch (err) {
      console.log("Fallback: Saving to localStorage");
      const local = JSON.parse(localStorage.getItem("chunav_scores") || "[]");
      local.push(scoreData);
      local.sort((a, b) => b.percentage - a.percentage);
      const top10 = local.slice(0, 10);
      localStorage.setItem("chunav_scores", JSON.stringify(top10));
      setLeaderboard(top10);
      setLeaderboardSource("local");
    }
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
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    minHeight: "44px",
    minWidth: "44px",
  };

  if (done) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div>
        <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "24px" }}>Quiz Results</h2>
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}</div>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: pct >= 80 ? COLORS.green : pct >= 60 ? COLORS.saffron : COLORS.navyLight, marginBottom: "8px" }}>{score}/{quizQuestions.length}</div>
          <div style={{ fontSize: "18px", color: COLORS.textMuted, marginBottom: "24px" }}>{pct >= 80 ? "Excellent! You know Indian elections well! 🇮🇳" : pct >= 60 ? "Good effort! Review a few sections." : "Keep learning — explore the sections above!"}</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "300px", margin: "0 auto 32px" }}>
            <div style={{ background: `${COLORS.green}15`, borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.green }}>{score}</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Correct</div>
            </div>
            <div style={{ background: `${COLORS.saffron}15`, borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.saffron }}>{quizQuestions.length - score}</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Wrong</div>
            </div>
          </div>

          {/* Submit Score Form */}
          <div style={{ maxWidth: "400px", margin: "0 auto 32px", textAlign: "left", background: "#f9f7f4", padding: "20px", borderRadius: "12px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "16px", color: COLORS.navy }}>Join the Leaderboard</h3>
            {!submitted ? (
              <form onSubmit={submitScore} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input 
                  value={playerName} 
                  onChange={e => setPlayerName(e.target.value)} 
                  placeholder="Enter your name for leaderboard" 
                  required 
                  aria-label="Enter your name for leaderboard"
                  style={{ minHeight: "44px", padding: "10px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, fontFamily: "inherit", fontSize: "14px", outline: "none" }} 
                  onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
                  onBlur={e => e.target.style.outline = "none"}
                />
                <button 
                  type="submit" 
                  style={btnStyle}
                  onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
                  onBlur={e => e.target.style.outline = "none"}
                >
                  Save Score 🏆
                </button>
              </form>
            ) : (
              <div style={{ background: `${COLORS.green}15`, color: COLORS.green, padding: "12px", borderRadius: "8px", fontWeight: "bold", textAlign: "center" }}>✅ Score Saved!</div>
            )}
          </div>

          {/* Leaderboard */}
          <div style={{ textAlign: "left", maxWidth: "500px", margin: "0 auto 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${COLORS.saffron}`, paddingBottom: "8px", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: COLORS.navy }}>🏆 Top 10 Leaderboard</h3>
              {leaderboardSource === "local" && <span style={{ fontSize: "11px", color: COLORS.saffron, fontWeight: "bold" }}>Local Leaderboard (offline mode)</span>}
            </div>
            
            {leaderboardLoading ? (
              <div style={{ textAlign: "center", padding: "20px", color: COLORS.textMuted }}>Loading leaderboard...</div>
            ) : leaderboard.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", padding: "4px 14px", fontSize: "12px", color: COLORS.textMuted, fontWeight: "bold" }}>
                  <div style={{ width: "40px" }}>Rank</div>
                  <div style={{ flex: 1 }}>Name</div>
                  <div style={{ width: "60px", textAlign: "right" }}>Score</div>
                  <div style={{ width: "50px", textAlign: "right" }}>%</div>
                </div>
                {leaderboard.map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", background: l.name === playerName ? `${COLORS.saffron}15` : "#f9f7f4", padding: "10px 14px", borderRadius: "8px", fontSize: "14px" }}>
                    <div style={{ width: "40px", fontSize: "16px" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </div>
                    <div style={{ flex: 1, fontWeight: "bold", color: COLORS.navy }}>
                      {l.name} <span style={{ fontSize: "11px", color: COLORS.textMuted, fontWeight: "normal", marginLeft: "6px" }}>{l.date}</span>
                    </div>
                    <div style={{ width: "60px", textAlign: "right", color: COLORS.text }}>{l.score}/{l.total}</div>
                    <div style={{ width: "50px", textAlign: "right", fontWeight: "bold", color: COLORS.green }}>{l.percentage}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: "14px", textAlign: "center", padding: "20px" }}>No scores yet. Be the first!</div>
            )}
          </div>

          <button 
            style={{...btnStyle, background: COLORS.navyLight}} 
            onClick={reset}
            onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
            onBlur={e => e.target.style.outline = "none"}
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px" }}>Civic Knowledge Quiz</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px" }}>Test your understanding of the Indian election process.</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "14px", color: COLORS.textMuted }} aria-live="polite">Question {current + 1} of {quizQuestions.length}</div>
        <div style={{ fontSize: "14px", color: COLORS.green, fontWeight: "700" }}>Score: {score}</div>
      </div>
      <div style={{ background: "#fff", borderRadius: "4px", height: "6px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: COLORS.saffron, width: `${((current) / quizQuestions.length) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <div style={{...cardStyle, padding: "32px"}}>
        <h3 style={{ fontSize: "18px", color: COLORS.navy, marginBottom: "24px", lineHeight: 1.5 }}>{q.q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }} role="radiogroup" aria-label="Quiz options">
          {q.opts.map((opt, i) => {
            let bg = "#f9f7f4", border = COLORS.border, color = COLORS.text;
            if (selected !== null) {
              if (i === q.ans) { bg = `${COLORS.green}15`; border = COLORS.green; color = COLORS.green; }
              else if (i === selected && i !== q.ans) { bg = `${COLORS.saffron}15`; border = COLORS.saffron; color = COLORS.saffronDark; }
            }
            return (
              <button 
                key={i} 
                onClick={() => handleSelect(i)} 
                role="radio"
                aria-checked={selected === i ? "true" : "false"}
                aria-label={`Option ${["A", "B", "C", "D"][i]}: ${opt}`}
                style={{ minHeight: "44px", background: bg, border: `2px solid ${border}`, borderRadius: "10px", padding: "14px 18px", cursor: selected !== null ? "default" : "pointer", fontFamily: "inherit", fontSize: "15px", color, textAlign: "left", transition: "all 0.2s", fontWeight: selected !== null && i === q.ans ? "700" : "400" }}
                onFocus={e => { if(selected === null) { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; } }}
                onBlur={e => e.target.style.outline = "none"}
              >
                <span style={{ fontWeight: "700", marginRight: "12px" }}>{["A", "B", "C", "D"][i]}.</span>{opt}
                {selected !== null && i === q.ans && " ✓"}
                {selected !== null && i === selected && i !== q.ans && " ✗"}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div style={{ background: `${COLORS.ashoka}10`, border: `1px solid ${COLORS.ashoka}30`, borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.ashoka, marginBottom: "6px" }}>📖 Explanation</div>
            <div style={{ fontSize: "14px", color: COLORS.text, lineHeight: 1.6 }}>{q.exp}</div>
          </div>
        )}
        {selected !== null && (
          <button 
            style={{...btnStyle, width: "100%"}} 
            onClick={next}
            onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
            onBlur={e => e.target.style.outline = "none"}
          >
            {current < quizQuestions.length - 1 ? "Next Question →" : "See Results 🏆"}
          </button>
        )}
      </div>
    </div>
  );
}
