import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants/colors.js';
import { trackCivicLearning } from '../firebase.js';

export default function ResultsPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    trackCivicLearning('results_step', rSteps[activeStep].title);
  }, [activeStep]);

  const rSteps = [
    { icon: "🔒", title: "Polls Close", color: COLORS.navyLight, detail: "Polling ends at 6 PM. EVMs are switched off and sealed in the presence of candidates' polling agents. A mock poll result is generated and signed by all agents. EVMs are packed in numbered steel containers.", myth: "Myth: EVMs can be tampered after polling. Fact: EVMs are standalone devices with no wireless/internet connectivity." },
    { icon: "🚚", title: "EVMs Transported to Strong Room", color: COLORS.navyMid, detail: "Sealed EVMs are transported under police escort to designated strong rooms. 24-hour CCTV and armed guards ensure security. Candidates may station their own guards outside.", myth: "Myth: Votes can be changed in strong rooms. Fact: EVMs are hardware-sealed; they cannot be reprogrammed without visibly breaking seals." },
    { icon: "📬", title: "Postal Ballots Counted First", color: COLORS.ashoka, detail: "On counting day, postal ballots (from armed forces, senior citizens 85+, PwD) are counted first. This is standard procedure under Rule 54 of the Conduct of Elections Rules.", myth: "Myth: Postal ballots are often rejected. Fact: ECI has strict protocols to ensure valid postal ballots are counted." },
    { icon: "🔢", title: "EVM Round-by-Round Counting", color: COLORS.saffron, detail: "Each EVM's BU (Ballot Unit) is taken round by round. The tally from each round is entered on Form 17C. Results of each round are displayed on the counting hall display board and announced by Counting Supervisors.", myth: "Myth: Counting agents can't see the process. Fact: Counting agents for every candidate sit across the table and observe each EVM's result." },
    { icon: "📊", title: "Tallying and Verification", color: COLORS.gold, detail: "After all rounds, total votes for each candidate are tallied from all Form 17C entries. VVPAT paper slip verification is done for 5 randomly selected EVMs per assembly segment (mandated by Supreme Court).", myth: "Myth: VVPAT counts are never checked. Fact: SC mandated 5 EVMs per AC segment are VVPAT-verified; expanded scope being debated." },
    { icon: "🔄", title: "Recount (if requested)", color: COLORS.saffronDark, detail: "A candidate may request recount of one or more rounds to the Returning Officer. If satisfied with grounds, RO can order a recount. Demanded only before Form 20 is signed.", myth: "Myth: Recounts always happen automatically if margin is small. Fact: Recounts are only on specific request and with valid grounds." },
    { icon: "📜", title: "Returning Officer Declares Result", color: COLORS.green, detail: "RO announces the winner. Form 20 (result declaration) is signed by the RO and copies given to all candidates. Results are simultaneously communicated to ECI via the Results Portal.", myth: "Myth: Media projections are official results. Fact: Only Form 20 signed by the RO is the official result. Media 'calls' are projections." },
    { icon: "🤝", title: "Formation of Government", color: COLORS.saffron, detail: "In a Lok Sabha election, after all 543 results are declared, ECI communicates the full picture to the President. The President invites the leader of the majority party/coalition. PM is sworn in, then the Cabinet.", myth: "Myth: The President always invites the single largest party. Fact: The President invites whoever can prove majority support — could be a coalition leader." },
  ];

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
    fontFamily: COLORS.fonts.body,
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
    fontFamily: COLORS.fonts.body,
  };

  return (
    <div>
      <h2 style={{ fontSize: "24px", color: COLORS.navy, marginBottom: "8px", fontFamily: COLORS.fonts.heading }}>Results & Certification Process</h2>
      <p style={{ fontSize: "16px", color: COLORS.textMuted, marginBottom: "24px", fontFamily: COLORS.fonts.body }}>What really happens after the last vote is cast — from EVM sealing to government formation.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {rSteps.map((s, i) => (
          <button 
            key={i} 
            onClick={() => setActiveStep(i)} 
            aria-label={`Go to step: ${s.title}`}
            aria-selected={activeStep === i ? "true" : "false"}
            style={{ minHeight: "44px", minWidth: "44px", padding: "8px 14px", borderRadius: "8px", border: `2px solid ${s.color}`, background: activeStep === i ? s.color : "transparent", color: activeStep === i ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: COLORS.fonts.body, fontSize: "12px", fontWeight: "700", transition: "all 0.2s" }}
          >
            {i + 1}. {s.title}
          </button>
        ))}
      </div>
      <div style={{ ...cardStyle, borderLeft: `5px solid ${rSteps[activeStep].color}` }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "40px" }}>{rSteps[activeStep].icon}</span>
          <div>
            <div style={{ fontSize: "12px", color: rSteps[activeStep].color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontFamily: COLORS.fonts.body }}>Step {activeStep + 1} of {rSteps.length}</div>
            <h3 style={{ margin: 0, fontSize: "20px", color: COLORS.navy, fontFamily: COLORS.fonts.heading }}>{rSteps[activeStep].title}</h3>
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: COLORS.text, marginBottom: "16px", fontFamily: COLORS.fonts.body }}>{rSteps[activeStep].detail}</p>
        <div style={{ background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}30`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.green, marginBottom: "6px", fontFamily: COLORS.fonts.body }}>🔍 Myth vs. Fact</div>
          <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5, fontFamily: COLORS.fonts.body }}>{rSteps[activeStep].myth}</div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
          <button 
            style={{...btnSecondaryStyle, opacity: activeStep === 0 ? 0.5 : 1}} 
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))} 
            disabled={activeStep === 0}
            aria-label="Previous Step"
          >
            ← Previous
          </button>
          {activeStep < rSteps.length - 1 && (
            <button 
              style={btnStyle} 
              onClick={() => setActiveStep(activeStep + 1)}
              aria-label="Next Step"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
