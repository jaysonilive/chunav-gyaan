import React, { useState, useEffect, Suspense, lazy } from 'react';
import { trackEvent } from './firebase.js';
import { COLORS } from './constants/colors.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import FloatingAIChat from './components/FloatingAIChat.jsx';

const HomePage = lazy(() => import('./components/HomePage.jsx'));
const TimelinePage = lazy(() => import('./components/TimelinePage.jsx'));
const HowToVotePage = lazy(() => import('./components/HowToVotePage.jsx'));
const ElectionTypesPage = lazy(() => import('./components/ElectionTypesPage.jsx'));
const RolesPage = lazy(() => import('./components/RolesPage.jsx'));
const ResultsPage = lazy(() => import('./components/ResultsPage.jsx'));
const GlossaryPage = lazy(() => import('./components/GlossaryPage.jsx'));
const QuizPage = lazy(() => import('./components/QuizPage.jsx'));
const AskAIPage = lazy(() => import('./components/AskAIPage.jsx'));

export default function App() {
  const [tab, setTab] = useState("home");

  const tabs = [
    { id: "home", label: "🏠 Home" },
    { id: "timeline", label: "📅 Timeline" },
    { id: "vote", label: "🗳️ How to Vote" },
    { id: "types", label: "🏛️ Election Types" },
    { id: "roles", label: "👤 Officials" },
    { id: "results", label: "📊 Results" },
    { id: "glossary", label: "📖 Glossary" },
    { id: "quiz", label: "🎯 Quiz" },
    { id: "ai", label: "💬 Ask AI" },
  ];

  const currentPageName = tabs.find(t => t.id === tab)?.label.replace(/[^\w\s]/gi, '').trim() || "Home";

  useEffect(() => {
    document.title = `${currentPageName} — Chunav Gyaan`;
    trackEvent('page_view', { page: currentPageName });
  }, [tab, currentPageName]);

  const style = {
    app: { fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.cream, minHeight: "100vh", color: COLORS.text, overflowX: "hidden" },
    header: { background: "#fff", borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
    tricolorBar: { height: "6px", background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, #fff 33.3%, #fff 66.6%, ${COLORS.green} 66.6%)` },
    headerTop: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", maxWidth: "1200px", margin: "0 auto" },
    logo: { display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" },
    logoIcon: { fontSize: "32px", background: `${COLORS.saffron}15`, padding: "8px", borderRadius: "12px" },
    logoText: { fontSize: "22px", fontWeight: "800", margin: 0, color: COLORS.navy, letterSpacing: "-0.5px" },
    logoSub: { fontSize: "12px", color: COLORS.saffron, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", display: "block" },
    nav: { display: "flex", gap: "8px", padding: "0 24px 16px", overflowX: "auto", scrollbarWidth: "none", maxWidth: "1200px", margin: "0 auto" },
    navBtn: (active) => ({
      background: active ? COLORS.saffron : "#f5f3f0",
      color: active ? "#fff" : COLORS.text,
      border: "none",
      padding: "10px 18px",
      borderRadius: "20px",
      cursor: "pointer",
      fontFamily: "inherit",
      fontSize: "14px",
      fontWeight: "600",
      whiteSpace: "nowrap",
      transition: "all 0.2s",
      minHeight: "44px",
      minWidth: "44px"
    }),
    main: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", minHeight: "calc(100vh - 200px)" },
  };

  return (
    <div style={style.app}>
      <a href="#main-content" style={{
        position: "absolute",
        top: "-40px",
        left: 0,
        background: "#FF6B00",
        color: "white",
        padding: "8px 16px",
        zIndex: 999,
        borderRadius: "4px",
        textDecoration: "none",
        transition: "top 0.2s"
      }}
      onFocus={e => e.target.style.top = "0"}
      onBlur={e => e.target.style.top = "-40px"}>
        Skip to main content
      </a>
      
      <header style={style.header} role="banner">
        <div style={style.tricolorBar} />
        <div style={style.headerTop}>
          <div style={style.logo}>
            <span style={style.logoIcon}>🗳️</span>
            <div>
              <span style={style.logoText}>Chunav Gyaan</span>
              <span style={style.logoSub}>India's Complete Election Guide</span>
            </div>
          </div>
          <div style={{ color: COLORS.gold, fontSize: "13px", fontStyle: "italic", display: window.innerWidth > 600 ? "block" : "none" }}>लोकतंत्र की शक्ति</div>
        </div>
        <nav style={style.nav} role="navigation" aria-label="Main navigation">
          {tabs.map(t => (
            <button 
              key={t.id} 
              style={style.navBtn(tab === t.id)} 
              onClick={() => setTab(t.id)}
              aria-label={`Go to ${t.label} page`}
              aria-selected={tab === t.id ? "true" : "false"}
              onFocus={e => { e.target.style.outline = "3px solid #FF6B00"; e.target.style.outlineOffset = "2px"; }}
              onBlur={e => e.target.style.outline = "none"}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main id="main-content" role="main" style={style.main}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{textAlign:"center", padding:"60px"}}>🗳️ Loading...</div>}>
            {tab === "home" && <HomePage setTab={setTab} />}
            {tab === "timeline" && <TimelinePage />}
            {tab === "vote" && <HowToVotePage />}
            {tab === "types" && <ElectionTypesPage />}
            {tab === "roles" && <RolesPage />}
            {tab === "results" && <ResultsPage />}
            {tab === "glossary" && <GlossaryPage />}
            {tab === "quiz" && <QuizPage />}
            {tab === "ai" && <AskAIPage />}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer style={{ background: COLORS.navy, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "20px", fontSize: "12px", marginTop: "40px" }} role="contentinfo">
        <div style={{ height: "3px", background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, #fff 33.3%, #fff 66.6%, ${COLORS.green} 66.6%)`, marginBottom: "16px" }} />
        Chunav Gyaan © 2024 · For civic education only · Not affiliated with ECI · जय हिन्द 🇮🇳
      </footer>
      <FloatingAIChat />
    </div>
  );
}
