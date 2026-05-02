import React, { useState, useEffect, Suspense, lazy } from 'react';
import { trackPageView } from './firebase.js';
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
const ElectionCharts = lazy(() => import('./components/ElectionCharts.jsx'));

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
    { id: "stats", label: "📊 Statistics" },
    { id: "ai", label: "💬 Ask AI" },
  ];

  const currentPageName = tabs.find(t => t.id === tab)?.label.replace(/[^\w\s]/gi, '').trim() || "Home";

  useEffect(() => {
    document.title = `${currentPageName} — Chunav Gyaan`;
    trackPageView(currentPageName);
  }, [tab, currentPageName]);

  const style = {
    app: { 
      fontFamily: COLORS.fonts.body, 
      background: COLORS.cream, 
      minHeight: "100vh", 
      color: COLORS.text, 
      overflowX: "hidden" 
    },
    header: { 
      position: "sticky", 
      top: 0, 
      zIndex: 100, 
      boxShadow: "0 2px 20px rgba(0,0,0,0.3)", 
      background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 60%, ${COLORS.navyLight} 100%)` 
    },
    tricolorBar: { 
      height: "4px", 
      background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, white 33.3%, white 66.6%, ${COLORS.green} 66.6%)`, 
      width: "100%" 
    },
    headerTop: { 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "12px 24px", 
      borderBottom: `2px solid ${COLORS.saffron}` 
    },
    logo: { 
      display: "flex", 
      alignItems: "center", 
      gap: "12px", 
      textDecoration: "none" 
    },
    logoIcon: { 
      fontSize: "28px" 
    },
    logoText: { 
      fontSize: "22px", 
      fontWeight: "bold", 
      margin: 0, 
      color: "white",
      fontFamily: COLORS.fonts.heading
    },
    logoSub: { 
      fontSize: "11px", 
      color: COLORS.gold, 
      letterSpacing: "3px", 
      textTransform: "uppercase", 
      display: "block",
      fontFamily: COLORS.fonts.body
    },
    nav: { 
      display: "flex", 
      gap: "2px", 
      padding: "0 16px", 
      overflowX: "auto", 
      scrollbarWidth: "none" 
    },
    navBtn: (active) => ({
      background: "transparent",
      color: active ? COLORS.saffron : "rgba(255,255,255,0.7)",
      border: "none",
      borderBottom: active ? `3px solid ${COLORS.saffron}` : "3px solid transparent",
      padding: "10px 16px",
      cursor: "pointer",
      fontFamily: COLORS.fonts.body,
      fontSize: "13px",
      fontWeight: active ? 700 : 500,
      whiteSpace: "nowrap",
      transition: "all 0.2s",
      minHeight: "44px"
    }),
    main: { 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "32px 24px", 
      minHeight: "calc(100vh - 200px)" 
    },
    hindiText: {
      fontFamily: COLORS.fonts.hindi
    }
  };

  return (
    <div style={style.app}>
      <style>
        {`
          h1, h2, h3, h4, h5, h6, .sectionTitle, .card-title {
            font-family: ${COLORS.fonts.heading};
          }
        `}
      </style>
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
          <div style={{ color: COLORS.gold, fontSize: "13px", fontStyle: "italic", display: window.innerWidth > 600 ? "block" : "none", fontFamily: COLORS.fonts.hindi }}>लोकतंत्र की शक्ति</div>
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
            {tab === "stats" && <ElectionCharts />}
            {tab === "ai" && <AskAIPage />}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer style={{ background: COLORS.navy, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "20px", fontSize: "12px", marginTop: "40px" }} role="contentinfo">
        <div style={style.tricolorBar} />

      </footer>
      <FloatingAIChat />
    </div>
  );
}
