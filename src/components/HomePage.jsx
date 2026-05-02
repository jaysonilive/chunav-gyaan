import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { trackCivicLearning, trackSearch } from '../firebase.js';
import ElectionCharts from './ElectionCharts.jsx';

export default function HomePage({ setTab }) {
  const facts = [
    "India has the world's largest electorate — over 96 crore (960 million) registered voters in 2024.",
    "The 2024 Lok Sabha election was conducted in 7 phases over 44 days — the longest in Indian history.",
    "India has used EVMs since 1982. Over 5.5 million EVMs were deployed in 2024.",
    "There are 10.5 lakh (1.05 million) polling stations across India.",
    "A candidate loses their deposit if they get less than 1/6th of valid votes polled.",
  ];
  const [factIdx, setFactIdx] = useState(0);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [newsCategory, setNewsCategory] = useState('news');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    trackCivicLearning('home', 'viewed');
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFactIdx(i => {
        const next = (i + 1) % facts.length;
        trackCivicLearning('did_you_know', facts[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [facts.length]);

  const fetchNews = (category = 'news', query = '') => {
    setNewsLoading(true);
    let url = `/api/news?category=${category}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then(data => {
        setNews(data.articles || []);
        if (data.isFallback) setNewsError("fallback");
        else setNewsError(null);
        setNewsLoading(false);
        if (query) trackSearch(query, (data.articles || []).length);
      })
      .catch(err => {
        console.error("News error:", err);
        setNewsError(err.message);
        setNewsLoading(false);
      });
  };

  useEffect(() => {
    fetchNews(newsCategory);
  }, [newsCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNews('search', searchQuery);
    }
  };

  const quickNav = [
    { icon: "📅", label: "Election Timeline", tab: "timeline", color: COLORS.saffron },
    { icon: "🗳️", label: "How to Vote", tab: "vote", color: COLORS.green },
    { icon: "🏛️", label: "Types of Elections", tab: "types", color: COLORS.ashoka },
    { icon: "👤", label: "Key Officials", tab: "roles", color: COLORS.gold },
    { icon: "📊", label: "Results Process", tab: "results", color: COLORS.navyLight },
    { icon: "📖", label: "Glossary", tab: "glossary", color: COLORS.saffronDark },
    { icon: "🎯", label: "Take a Quiz", tab: "quiz", color: COLORS.green },
    { icon: "💬", label: "Ask AI", tab: "ai", color: COLORS.navy },
  ];

  const stats = [
    { label: "Registered Voters", value: "96 Crore+", icon: "👥" },
    { label: "Lok Sabha Seats", value: "543", icon: "🏛️" },
    { label: "Polling Stations", value: "10.5 Lakh", icon: "📍" },
    { label: "Election Phases (2024)", value: "7 Phases", icon: "📅" },
  ];

  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
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
    fontFamily: COLORS.fonts.body,
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 100%)`, borderRadius: "16px", padding: "40px 32px", marginBottom: "28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, #fff 33.3%, #fff 66.6%, ${COLORS.green} 66.6%)` }} />
        <div style={{ fontSize: "11px", color: COLORS.gold, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px", fontFamily: COLORS.fonts.body }}>🇮🇳 <span style={{fontFamily: COLORS.fonts.hindi}}>लोकतंत्र का महापर्व</span></div>
        <h1 style={{ color: "#fff", fontSize: "36px", margin: "0 0 12px", lineHeight: 1.2, fontFamily: COLORS.fonts.heading }}>Chunav Gyaan<br /><span style={{ color: COLORS.saffron }}>India's Election Guide</span></h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", maxWidth: "500px", lineHeight: 1.6, marginBottom: "24px", fontFamily: COLORS.fonts.body }}>Understand the complete Indian election process — from voter registration to government formation — in an interactive, easy-to-follow way.</p>
        <button 
          style={btnStyle} 
          onClick={() => setTab("vote")}
          aria-label="Start Your Voting Journey"
        >
          Start Your Voting Journey →
        </button>
      </div>

      {/* Rotating Fact */}
      <div style={{ background: `${COLORS.saffron}15`, border: `1px solid ${COLORS.saffron}40`, borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", gap: "14px", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>💡</span>
        <div>
          <div style={{ fontSize: "11px", color: COLORS.saffron, fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px", fontFamily: COLORS.fonts.body }}>Did You Know?</div>
          <div style={{ fontSize: "14px", color: COLORS.text, lineHeight: 1.5, fontFamily: COLORS.fonts.body }}>{facts[factIdx]}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.saffron, marginBottom: "4px", fontFamily: COLORS.fonts.heading }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: COLORS.textMuted, fontFamily: COLORS.fonts.body }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Latest Election News */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <h2 style={{ fontSize: "24px", color: COLORS.navy, margin: 0, fontFamily: COLORS.fonts.heading }}>📰 Election Updates</h2>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", flex: "1", maxWidth: "400px" }}>
          <input 
            type="text" 
            placeholder="Search election topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, fontSize: "14px", outline: "none" }}
          />
          <button type="submit" style={{ ...btnStyle, padding: "8px 16px", fontSize: "14px" }}>Search</button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
        {['news', 'voter', 'tech'].map(cat => (
          <button
            key={cat}
            onClick={() => { setNewsCategory(cat); setSearchQuery(''); }}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: `1px solid ${newsCategory === cat ? COLORS.saffron : COLORS.border}`,
              background: newsCategory === cat ? COLORS.saffron : "white",
              color: newsCategory === cat ? "white" : COLORS.text,
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: COLORS.fonts.body
            }}
          >
            {cat === 'news' ? 'Latest News' : cat === 'voter' ? 'Voter Info' : 'Technology'}
          </button>
        ))}
      </div>

      <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
        {newsLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ height: "20px", background: "#f0f0f0", borderRadius: "4px", width: "80%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "14px", background: "#f0f0f0", borderRadius: "4px", width: "100%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: "14px", background: "#f0f0f0", borderRadius: "4px", width: "90%", animation: "pulse 1.5s infinite" }} />
            </div>
          ))
        ) : (
          news.slice(0, 4).map((item, i) => (
            <div 
              key={i} 
              style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "8px" }}
              onClick={() => window.open(item.link, '_blank')}
            >
              <div style={{ alignSelf: "flex-start", background: `${COLORS.saffron}15`, color: COLORS.saffronDark, fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "12px", fontFamily: COLORS.fonts.body }}>{item.source}</div>
              <h3 style={{ margin: 0, fontSize: "15px", color: COLORS.navy, lineHeight: 1.4, fontWeight: "bold", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: COLORS.fonts.heading }}>{item.title}</h3>
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: COLORS.textMuted, lineHeight: 1.5, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: COLORS.fonts.body }}>{item.snippet}</p>
              <div style={{ fontSize: "12px", color: COLORS.saffron, fontWeight: "bold", marginTop: "10px", fontFamily: COLORS.fonts.body }}>Read More →</div>
            </div>
          ))
        )}
      </div>
      
      {newsError === "fallback" && (
        <div style={{ fontSize: "12px", color: COLORS.textMuted, textAlign: "center", marginBottom: "16px", fontStyle: "italic", fontFamily: COLORS.fonts.body }}>
          📡 Live updates temporarily unavailable — showing curated election resources
        </div>
      )}
      <div style={{ fontSize: "12px", color: COLORS.textMuted, textAlign: "right", marginBottom: "32px", fontFamily: COLORS.fonts.body }}>
        🔍 Powered by Google Custom Search
      </div>

      {/* Election Charts Section */}
      <ElectionCharts />

      {/* Quick Nav */}
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "20px", marginTop: "48px", fontFamily: COLORS.fonts.heading }}>Explore Topics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {quickNav.map(n => (
          <button 
            key={n.tab} 
            onClick={() => setTab(n.tab)} 
            aria-label={`Go to ${n.label} page`}
            style={{ minHeight: "44px", minWidth: "44px", background: "#fff", border: `1px solid ${n.color}44`, borderRadius: "12px", padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <span style={{ fontSize: "24px", background: n.color + "18", borderRadius: "8px", padding: "8px", display: "block" }}>{n.icon}</span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: COLORS.text, fontFamily: COLORS.fonts.body }}>{n.label}</span>
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "32px 12px", fontSize: "12px", color: COLORS.textMuted, borderTop: `1px solid ${COLORS.border}`, marginTop: "48px", fontFamily: COLORS.fonts.body }}>
        Powered by <strong>Google Charts</strong> · <strong>Google Fonts</strong> · <strong>Google Search</strong> · <strong>Firebase Analytics</strong>
      </div>

      <style>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        @media (max-width: 600px) {
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
