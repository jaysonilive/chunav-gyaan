import { useState, useRef, useEffect } from "react";

const COLORS = {
  saffron: "#FF6B00",
  saffronLight: "#FF8C35",
  saffronDark: "#CC5500",
  green: "#138808",
  greenLight: "#1aab0a",
  navy: "#0a0f2e",
  navyMid: "#141b45",
  navyLight: "#1e2a5e",
  white: "#FAFAF8",
  cream: "#FFF8EE",
  gold: "#D4A017",
  ashoka: "#0047AB",
  text: "#1a1a2e",
  textMuted: "#5a5a7a",
  cardBg: "#ffffff",
  border: "#e8e0d5",
};

const style = {
  app: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: COLORS.cream,
    minHeight: "100vh",
    color: COLORS.text,
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 60%, ${COLORS.navyLight} 100%)`,
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderBottom: `2px solid ${COLORS.saffron}`,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: COLORS.white,
  },
  logoIcon: {
    fontSize: "28px",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  logoSub: {
    fontSize: "11px",
    color: COLORS.gold,
    letterSpacing: "2px",
    textTransform: "uppercase",
    display: "block",
  },
  tricolorBar: {
    height: "4px",
    background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, white 33.3%, white 66.6%, ${COLORS.green} 66.6%)`,
  },
  nav: {
    display: "flex",
    overflowX: "auto",
    padding: "0 16px",
    gap: "2px",
    scrollbarWidth: "none",
  },
  navBtn: (active) => ({
    padding: "10px 16px",
    border: "none",
    borderBottom: active ? `3px solid ${COLORS.saffron}` : "3px solid transparent",
    background: "transparent",
    color: active ? COLORS.saffron : "rgba(255,255,255,0.7)",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: active ? "700" : "400",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  }),
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 20px",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: COLORS.navy,
    marginBottom: "6px",
    borderLeft: `5px solid ${COLORS.saffron}`,
    paddingLeft: "14px",
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: "15px",
    marginBottom: "28px",
    paddingLeft: "19px",
    fontStyle: "italic",
  },
  card: {
    background: COLORS.cardBg,
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: `1px solid ${COLORS.border}`,
  },
  badge: (color) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
  }),
  btn: (variant = "primary") => ({
    padding: "10px 22px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "600",
    background: variant === "primary" ? COLORS.saffron : variant === "green" ? COLORS.green : COLORS.navyMid,
    color: "#fff",
    transition: "all 0.2s",
    letterSpacing: "0.3px",
  }),
};

// ─────────────── DATA ───────────────

const timelineData = [
  { id: 1, phase: "pre", date: "~6 months before", title: "ECI Announces Election Schedule", icon: "📢", color: COLORS.ashoka, what: "The Election Commission of India (ECI) announces the election schedule, including polling dates and Model Code of Conduct activation.", who: "Chief Election Commissioner & two Election Commissioners", why: "Ensures orderly preparation and gives all stakeholders advance notice.", duration: "1 day (announcement)" },
  { id: 2, phase: "pre", date: "Announcement Day", title: "Model Code of Conduct Activated", icon: "📜", color: COLORS.saffron, what: "The MCC comes into force immediately upon schedule announcement. No new government schemes, transfers of officials, or use of public resources for campaigns.", who: "All political parties, candidates, and the ruling government", why: "Ensures a level playing field for all parties during elections.", duration: "Until results declared" },
  { id: 3, phase: "pre", date: "~4 weeks before polling", title: "Filing of Nominations", icon: "📝", color: COLORS.navyLight, what: "Candidates file nomination papers with the Returning Officer. Each candidate must submit Form 2B along with security deposit (₹25,000 for general, ₹12,500 for SC/ST).", who: "Candidates, Returning Officers, Proposers", why: "Formally enters a candidate into the electoral race.", duration: "5–7 days window" },
  { id: 4, phase: "pre", date: "~3 weeks before polling", title: "Scrutiny of Nominations", icon: "🔍", color: COLORS.gold, what: "Returning Officer examines all nomination papers for legal validity — citizenship, age (25 for LS), disqualifications, and security deposit.", who: "Returning Officer", why: "Ensures only eligible candidates contest.", duration: "1 day" },
  { id: 5, phase: "pre", date: "~18 days before polling", title: "Withdrawal of Candidatures", icon: "🔙", color: COLORS.textMuted, what: "Candidates may withdraw their nominations on the designated date. After this, the final list of candidates is published.", who: "Candidates, Returning Officers", why: "Allows candidates to make a final decision; reduces ballot crowding.", duration: "1 day" },
  { id: 6, phase: "campaign", date: "18 days → 48 hrs before", title: "Campaign Period", icon: "📣", color: COLORS.green, what: "Active campaigning — rallies, door-to-door, advertisements, social media. Candidates must follow campaign expenditure limits (₹95 lakh for LS seats).", who: "Candidates, political parties, voters", why: "Allows public discourse and voter persuasion.", duration: "~16 days" },
  { id: 7, phase: "campaign", date: "48 hrs before polling", title: "Campaign Silence Period", icon: "🤫", color: COLORS.navyMid, what: "All campaigning must stop 48 hours before poll closure. No public meetings, no advertisements, no social media canvassing.", who: "All candidates and parties", why: "Gives voters time for peaceful reflection before voting.", duration: "48 hours" },
  { id: 8, phase: "voting", date: "Polling Day", title: "Voting (EVM Polling)", icon: "🗳️", color: COLORS.saffron, what: "Voters visit booths, verify identity, receive a ballot slip, and press the candidate button on the EVM. VVPAT prints a paper slip for 7 seconds for verification.", who: "Voters, Presiding Officers, Poll Workers, Polling Agents", why: "The core democratic act — citizens choose their representatives.", duration: "7 AM – 6 PM" },
  { id: 9, phase: "post", date: "Polling Day Evening", title: "EVM Sealing & Strong Room", icon: "🔒", color: COLORS.navyLight, what: "EVMs are sealed in the presence of candidates/agents, packed into steel trunks, and transported to strong rooms under 24/7 security and CCTV.", who: "Returning Officers, CRPF/Police, Candidates' agents", why: "Ensures security and integrity of votes until counting.", duration: "Until counting day" },
  { id: 10, phase: "post", date: "Counting Day (announced)", title: "Counting of Votes", icon: "🔢", color: COLORS.green, what: "EVMs are opened round by round. Results for each round are announced on display boards. Postal ballots are counted first. Candidates' counting agents observe.", who: "Counting Officials, Candidates' Agents, ECI observers", why: "Translates votes into election results.", duration: "6–12 hours" },
  { id: 11, phase: "post", date: "Counting Day", title: "Declaration of Results", icon: "📊", color: COLORS.gold, what: "Once all rounds are completed, the Returning Officer declares the winning candidate and signs Form 20. Results are communicated to ECI and published.", who: "Returning Officer, ECI", why: "Official conclusion of the electoral contest.", duration: "Same day as counting" },
  { id: 12, phase: "cert", date: "After results", title: "Formation of Government", icon: "🏛️", color: COLORS.saffron, what: "The President invites the leader of the majority party/coalition to form the government. The PM and Council of Ministers are sworn in by the President.", who: "President of India, PM-designate, winning party/coalition", why: "Translates electoral mandate into executive governance.", duration: "~1–2 weeks" },
];

const electionTypes = [
  { icon: "🏛️", title: "Lok Sabha Elections", color: COLORS.saffron, freq: "Every 5 years", seats: "543 constituencies", winner: "First Past the Post (FPTP)", body: "Lower house of Parliament (House of the People). The party/coalition winning majority (272+) forms the central government. PM is from the ruling party.", example: "2024 General Elections — BJP-led NDA won 293 seats" },
  { icon: "🔵", title: "Rajya Sabha Elections", color: COLORS.ashoka, freq: "Biennial (1/3rd retire every 2 years)", seats: "245 seats (233 elected + 12 nominated)", winner: "Single Transferable Vote (STV) by state MLAs", body: "Upper house of Parliament (Council of States). Members are elected by State Legislative Assemblies, not directly by public.", example: "April 2024 — 56 seats went to polls across states" },
  { icon: "🏙️", title: "Vidhan Sabha (State Assembly)", color: COLORS.green, freq: "Every 5 years per state", seats: "Varies by state (e.g., UP: 403, Goa: 40)", winner: "First Past the Post (FPTP)", body: "State legislative assembly. Chief Minister of the state is from the winning party/coalition. Most important for state governance.", example: "2024 — Maharashtra, Jharkhand, J&K elections" },
  { icon: "🏘️", title: "Local Body Elections", color: COLORS.gold, freq: "Every 5 years", seats: "Gram Panchayats, Municipal Corporations, Nagar Palikas", winner: "FPTP, some use ward-level systems", body: "Conducted under 73rd & 74th Constitutional Amendments. State Election Commissions (not ECI) oversee these.", example: "Delhi MCD elections, Mumbai BMC elections" },
  { icon: "⚡", title: "By-elections (Upchunav)", color: COLORS.navyLight, freq: "Within 6 months of vacancy", seats: "1 seat per by-election", winner: "FPTP", body: "Held when a sitting MP/MLA vacates their seat due to death, resignation, disqualification, or election void by court.", example: "Wayanad by-election 2024 — Priyanka Gandhi Vadra won" },
  { icon: "📋", title: "Rajya Sabha Biennial + Presidential/VP", color: COLORS.saffronDark, freq: "Every 5 years for President/VP", seats: "1 President, 1 VP", winner: "STV by Electoral College (MPs + MLAs)", body: "Presidential election involves the Electoral College — elected MPs and MLAs. VP is elected only by both Houses of Parliament.", example: "2022 — Droupadi Murmu elected as 15th President" },
];

const roles = [
  { icon: "⚖️", title: "Election Commission of India (ECI)", level: "Apex Body", color: COLORS.saffron, responsibilities: ["Supervises all elections to Parliament and State Assemblies", "Enforces Model Code of Conduct", "Sets election schedule and polling dates", "Announces election results officially"], chosen: "Chief Election Commissioner appointed by President on PM's recommendation; confirmed by Parliamentary committee since 2023", term: "6 years or until age 65", oversight: "Supreme Court of India" },
  { icon: "👤", title: "Chief Election Commissioner", level: "Constitutional Head", color: COLORS.ashoka, responsibilities: ["Leads the 3-member ECI", "Final authority on election conduct", "Cannot be removed except like a Supreme Court judge", "Supervises voter rolls"], chosen: "Appointed by President of India", term: "6 years or age 65", oversight: "Parliament" },
  { icon: "🏢", title: "Returning Officer (RO)", level: "Constituency Level", color: COLORS.green, responsibilities: ["Accepts/rejects nomination papers", "Draws lots to assign ballot symbols", "Declares the elected candidate", "Signs Form 20 (result declaration)"], chosen: "District Magistrate or senior officer designated by ECI", term: "For the duration of election", oversight: "ECI & District Election Officer" },
  { icon: "📊", title: "ECI Observer", level: "Constituency Level", color: COLORS.gold, responsibilities: ["Monitors election conduct in constituency", "Reports MCC violations to ECI", "Can countermand polling in extreme cases", "Independently reports to ECI"], chosen: "IAS/IPS officers deputed by ECI from other states", term: "From schedule to result", oversight: "ECI directly" },
  { icon: "🏛️", title: "Presiding Officer", level: "Booth Level", color: COLORS.navyLight, responsibilities: ["Controls the polling station on poll day", "Verifies voters against electoral roll", "Manages EVM and VVPAT operation", "Issues challenged vote certificates"], chosen: "State/Central govt employee designated by RO", term: "Poll day only", oversight: "Returning Officer" },
  { icon: "🤝", title: "Poll Workers (Polling Staff)", level: "Booth Level", color: COLORS.textMuted, responsibilities: ["Apply indelible ink on voter's finger", "Check EPIC/identity documents", "Issue ballot slips", "Maintain poll records (Form 17A)"], chosen: "State/Central govt employees", term: "Poll day only", oversight: "Presiding Officer" },
];

const glossaryTerms = [
  { term: "ECI", category: "Officials", definition: "Election Commission of India — the constitutional body that conducts free and fair elections to Parliament and State Assemblies.", related: ["CEC", "ECI Observer"] },
  { term: "EVM", category: "Voting", definition: "Electronic Voting Machine — a tamper-proof device used in Indian elections since 1998 to record votes electronically, replacing paper ballots.", related: ["VVPAT", "BU", "CU"] },
  { term: "VVPAT", category: "Voting", definition: "Voter Verifiable Paper Audit Trail — attached to EVMs, it prints a paper slip showing the candidate voted for, visible for 7 seconds before dropping into a sealed box.", related: ["EVM"] },
  { term: "EPIC", category: "Voting", definition: "Elector's Photo Identity Card — the Voter ID card issued by ECI. Required for voting (along with 12 other acceptable photo ID proofs).", related: ["Form 6", "NVSP"] },
  { term: "MCC", category: "Legal", definition: "Model Code of Conduct — guidelines issued by ECI binding all parties and candidates from election announcement until results. Prevents misuse of government machinery.", related: ["ECI", "Returning Officer"] },
  { term: "NOTA", category: "Voting", definition: "None of the Above — an option on EVMs since 2013 allowing voters to reject all candidates. NOTA votes don't affect the winner; the highest-voted candidate still wins.", related: ["EVM", "VVPAT"] },
  { term: "Lok Sabha", category: "Officials", definition: "House of the People — lower house of India's Parliament with 543 elected seats. The government is formed by the party/coalition winning 272+ seats.", related: ["Rajya Sabha", "FPTP"] },
  { term: "Rajya Sabha", category: "Officials", definition: "Council of States — upper house of Parliament with 245 seats. Members are elected by State Legislative Assemblies using Single Transferable Vote.", related: ["Lok Sabha", "STV"] },
  { term: "FPTP", category: "Counting", definition: "First Past the Post — the electoral system used in India. The candidate with the most votes in a constituency wins, even without a majority.", related: ["NOTA", "By-election"] },
  { term: "STV", category: "Counting", definition: "Single Transferable Vote — proportional representation system used in Rajya Sabha and Presidential elections. Voters rank candidates; surplus votes are transferred.", related: ["Rajya Sabha", "Presidential election"] },
  { term: "Affidavit (Form 26)", category: "Legal", definition: "A sworn statement filed by every candidate declaring assets, liabilities, criminal cases (if any), educational qualifications, and PAN details.", related: ["Nomination", "Returning Officer"] },
  { term: "Presiding Officer", category: "Officials", definition: "A government employee appointed to manage a single polling station on election day — in charge of the EVM, voter verification, and poll records.", related: ["Poll Workers", "Returning Officer"] },
  { term: "Indelible Ink", category: "Voting", definition: "A permanent ink applied to a voter's left index finger after voting to prevent double voting. Manufactured by Mysore Paints and Varnish Ltd.", related: ["EPIC", "Polling Station"] },
  { term: "Strong Room", category: "Counting", definition: "A secured room where sealed EVMs are stored between polling day and counting day, under 24-hour police guard and CCTV surveillance.", related: ["EVM", "Counting Agent"] },
  { term: "Form 20", category: "Counting", definition: "The official result sheet signed by the Returning Officer declaring the elected candidate and vote tallies for each candidate in the constituency.", related: ["Returning Officer", "Declaration of Result"] },
  { term: "Postal Ballot", category: "Voting", definition: "A mechanism allowing voters unable to physically vote (armed forces, senior citizens 85+, PwD, essential services) to vote by post before election day.", related: ["EPIC", "Polling Station"] },
  { term: "Anti-Defection Law", category: "Legal", definition: "Under the 10th Schedule of the Constitution, an elected member who voluntarily gives up party membership or votes against party whip loses their seat.", related: ["Lok Sabha", "Rajya Sabha"] },
  { term: "Delimitation", category: "Legal", definition: "The process of redrawing constituency boundaries based on census data, done by a Delimitation Commission. Last done in 2008; next expected post-2026 census.", related: ["Returning Officer", "ECI"] },
  { term: "By-election", category: "Voting", definition: "A mid-term election held to fill a single vacant seat caused by death, resignation, or disqualification of the sitting MP/MLA.", related: ["FPTP", "Lok Sabha"] },
  { term: "Exit Poll", category: "Counting", definition: "Surveys of voters after they have voted, used to predict results. ECI prohibits publishing exit polls until the last phase of voting ends.", related: ["MCC", "ECI"] },
];

const quizQuestions = [
  { q: "How many seats are there in the Lok Sabha?", opts: ["545", "543", "552", "550"], ans: 1, exp: "The Lok Sabha has 543 elected seats (+ 2 Anglo-Indian seats until 2020). Simple majority to form government = 272 seats." },
  { q: "Which body oversees Lok Sabha and State Assembly elections in India?", opts: ["UPSC", "Election Commission of India", "Supreme Court", "Ministry of Home Affairs"], ans: 1, exp: "The Election Commission of India (ECI) is the constitutional body under Article 324 that conducts Parliamentary and State Assembly elections." },
  { q: "What does VVPAT stand for?", opts: ["Voter Verified Paper Audit Trail", "Voter Verifiable Paper Audit Trail", "Verified Voter Paper Audit Trail", "Voter Valid Paper Audit Trail"], ans: 1, exp: "VVPAT — Voter Verifiable Paper Audit Trail. It prints a slip showing your voted candidate for 7 seconds to verify before it drops into a sealed box." },
  { q: "When does the Model Code of Conduct come into effect?", opts: ["On Election Day", "On announcement of election schedule", "7 days before polling", "When nomination filing begins"], ans: 1, exp: "The MCC kicks in the moment ECI announces the election schedule — even before nominations open — and remains until results are declared." },
  { q: "What electoral system is used for Lok Sabha elections?", opts: ["Single Transferable Vote", "Proportional Representation", "First Past the Post", "Two-Round System"], ans: 2, exp: "Lok Sabha uses FPTP — the candidate with the most votes wins, regardless of whether they secured a majority." },
  { q: "What is the security deposit for a general category Lok Sabha candidate?", opts: ["₹10,000", "₹25,000", "₹50,000", "₹1,00,000"], ans: 1, exp: "₹25,000 for general category candidates; ₹12,500 for SC/ST candidates. Deposit is forfeited if the candidate gets less than 1/6th of valid votes." },
  { q: "NOTA was introduced in Indian elections in which year?", opts: ["2009", "2011", "2013", "2019"], ans: 2, exp: "NOTA (None of the Above) was introduced by the Supreme Court order in 2013, first used in 5 state assembly elections that year." },
  { q: "How many hours before polling must campaign silence begin?", opts: ["24 hours", "36 hours", "48 hours", "72 hours"], ans: 2, exp: "Campaigning must stop 48 hours before poll closure. This gives voters a period of peaceful reflection without campaign pressure." },
  { q: "Which election in India uses Single Transferable Vote (STV)?", opts: ["Lok Sabha", "Vidhan Sabha", "Rajya Sabha", "Gram Panchayat"], ans: 2, exp: "Rajya Sabha elections use STV — State MLAs vote for Rajya Sabha candidates and rank them; surplus votes are transferred." },
  { q: "What is Form 20 in Indian elections?", opts: ["Voter registration form", "Nomination form", "Official result declaration form", "Postal ballot form"], ans: 2, exp: "Form 20 is the official result sheet signed by the Returning Officer, declaring the winning candidate and vote counts for all candidates." },
];

const steps = [
  { icon: "✅", title: "Check Your Eligibility", color: COLORS.saffron, content: "You must be: (1) a citizen of India, (2) at least 18 years old on January 1 of the revision year, (3) ordinarily resident in the constituency.", tip: "NRIs can now register as overseas voters under Section 20A of the Representation of the People Act, 1950.", warning: "You cannot vote if you are of unsound mind (declared by court), a non-citizen, or convicted with 2+ years imprisonment." },
  { icon: "📋", title: "Register as a Voter", color: COLORS.ashoka, content: "Fill Form 6 online at voters.eci.gov.in or the Voter Helpline App. Submit proof of age (birth certificate/school cert) and proof of residence (Aadhaar/utility bill).", tip: "Check if you're already enrolled first! Search your name on voters.eci.gov.in or call 1950.", warning: "Registration deadlines vary — typically the final electoral roll is published on January 5. Register well before that." },
  { icon: "🃏", title: "Get Your Voter ID (EPIC)", color: COLORS.green, content: "Your Elector's Photo Identity Card (EPIC) is issued by ECI. Track it online. You can also download e-EPIC (digital Voter ID) from the NVSP portal.", tip: "Even without EPIC, you can vote using 12 other documents: Aadhaar, PAN, Passport, MNREGS card, Driving Licence, etc.", warning: "Your EPIC must match your name on the electoral roll. If there's a mismatch, file Form 8 for correction." },
  { icon: "📍", title: "Find Your Polling Booth", color: COLORS.gold, content: "Visit voters.eci.gov.in or call 1950 to find your polling station. Booth details are printed on the Voter Slip delivered before elections. Each booth serves ~1,200–1,500 voters.", tip: "Download the Voter Helpline App — it shows your booth location on a map and your position on the electoral roll.", warning: "You can only vote at your designated booth. Voting at the wrong booth is not permitted." },
  { icon: "🗳️", title: "Vote on Election Day", color: COLORS.saffron, content: "Arrive at your booth between 7 AM and 6 PM. Show your Voter Slip + ID. The ink is applied to your left index finger. Find your name on the register (Form 17A). Press the candidate button on the EVM and verify the VVPAT slip.", tip: "Senior citizens (85+), PwD voters, and certain essential service workers can apply for Postal Ballot or Home Voting.", warning: "Do NOT bring mobile phones inside the voting compartment. Photography of the EVM screen is illegal." },
  { icon: "🔍", title: "Verify Your Vote Counted", color: COLORS.green, content: "On counting day, watch live results on ECI's website (results.eci.gov.in) or Voter Helpline App. Postal ballots are counted first, followed by EVM rounds.", tip: "Candidates' counting agents have the right to observe every round of counting and demand recounting in specific rounds.", warning: "If you suspect electoral malpractice, you can approach the ECI Observer or file a complaint at 1950." },
];

// ─────────────── COMPONENTS ───────────────

function HomePage({ setTab }) {
  const facts = [
    "India has the world's largest electorate — over 96 crore (960 million) registered voters in 2024.",
    "The 2024 Lok Sabha election was conducted in 7 phases over 44 days — the longest in Indian history.",
    "India has used EVMs since 1982. Over 5.5 million EVMs were deployed in 2024.",
    "There are 10.5 lakh (1.05 million) polling stations across India.",
    "A candidate loses their deposit if they get less than 1/6th of valid votes polled.",
  ];
  const [factIdx, setFactIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFactIdx(i => (i + 1) % facts.length), 4000);
    return () => clearInterval(t);
  }, []);

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

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 100%)`, borderRadius: "16px", padding: "40px 32px", marginBottom: "28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, #fff 33.3%, #fff 66.6%, ${COLORS.green} 66.6%)` }} />
        <div style={{ fontSize: "11px", color: COLORS.gold, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>🇮🇳 Bharat Matki Jai</div>
        <h1 style={{ color: "#fff", fontSize: "36px", margin: "0 0 12px", lineHeight: 1.2 }}>Chunav Gyaan<br /><span style={{ color: COLORS.saffron }}>India's Election Guide</span></h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", maxWidth: "500px", lineHeight: 1.6, marginBottom: "24px" }}>Understand the complete Indian election process — from voter registration to government formation — in an interactive, easy-to-follow way.</p>
        <button style={style.btn("primary")} onClick={() => setTab("vote")}>Start Your Voting Journey →</button>
      </div>

      {/* Rotating Fact */}
      <div style={{ background: `${COLORS.saffron}15`, border: `1px solid ${COLORS.saffron}40`, borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", gap: "14px", alignItems: "center" }}>
        <span style={{ fontSize: "24px" }}>💡</span>
        <div>
          <div style={{ fontSize: "11px", color: COLORS.saffron, fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>Did You Know?</div>
          <div style={{ fontSize: "14px", color: COLORS.text, lineHeight: 1.5 }}>{facts[factIdx]}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...style.card, textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.saffron, marginBottom: "4px" }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: COLORS.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <h2 style={{ ...style.sectionTitle, fontSize: "20px" }}>Explore Topics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {quickNav.map(n => (
          <button key={n.tab} onClick={() => setTab(n.tab)} style={{ background: "#fff", border: `1px solid ${n.color}44`, borderRadius: "12px", padding: "18px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", textAlign: "left", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "24px", background: n.color + "18", borderRadius: "8px", padding: "8px", display: "block" }}>{n.icon}</span>
            <span style={{ fontSize: "14px", fontWeight: "600", color: COLORS.text, fontFamily: "inherit" }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimelinePage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const phases = { pre: "Pre-Election", campaign: "Campaign", voting: "Polling Day", post: "Post-Election", cert: "Certification" };
  const phaseColors = { pre: COLORS.ashoka, campaign: COLORS.green, voting: COLORS.saffron, post: COLORS.navyLight, cert: COLORS.gold };
  const filtered = filter === "all" ? timelineData : timelineData.filter(t => t.phase === filter);

  return (
    <div>
      <h2 style={style.sectionTitle}>Indian Election Timeline</h2>
      <p style={style.sectionSub}>The complete journey of an Indian general election — click any milestone to learn more.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {[["all", "All Phases"], ...Object.entries(phases)].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: "6px 16px", borderRadius: "20px", border: `2px solid ${k === "all" ? COLORS.saffron : phaseColors[k] || COLORS.saffron}`, background: filter === k ? (k === "all" ? COLORS.saffron : phaseColors[k] || COLORS.saffron) : "transparent", color: filter === k ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: "600" }}>{v}</button>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "28px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${COLORS.saffron}, ${COLORS.green})`, borderRadius: "2px" }} />
        {filtered.map(t => (
          <div key={t.id} style={{ display: "flex", gap: "20px", marginBottom: "16px", cursor: "pointer" }} onClick={() => setSelected(selected?.id === t.id ? null : t)}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, boxShadow: `0 0 0 4px ${t.color}30`, zIndex: 1 }}>{t.icon}</div>
            <div style={{ flex: 1, background: selected?.id === t.id ? `${t.color}10` : "#fff", border: `1px solid ${selected?.id === t.id ? t.color : COLORS.border}`, borderRadius: "12px", padding: "14px 18px", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px" }}>
                <div>
                  <span style={style.badge(phaseColors[t.phase] || COLORS.saffron)}>{phases[t.phase]}</span>
                  <h3 style={{ margin: "6px 0 2px", fontSize: "16px", color: COLORS.navy }}>{t.title}</h3>
                  <div style={{ fontSize: "12px", color: COLORS.textMuted }}>{t.date}</div>
                </div>
                <div style={{ fontSize: "20px" }}>{selected?.id === t.id ? "▲" : "▼"}</div>
              </div>
              {selected?.id === t.id && (
                <div style={{ marginTop: "14px", borderTop: `1px solid ${COLORS.border}`, paddingTop: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                    {[["📌 What Happens", t.what], ["👥 Who's Involved", t.who], ["❓ Why It Matters", t.why], ["⏱️ Duration", t.duration]].map(([label, val]) => (
                      <div key={label} style={{ background: "#f9f7f4", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: t.color, marginBottom: "4px" }}>{label}</div>
                        <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{val}</div>
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

function HowToVotePage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([]);
  const toggleDone = (i) => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);
  const s = steps[step];

  return (
    <div>
      <h2 style={style.sectionTitle}>How to Vote in India</h2>
      <p style={style.sectionSub}>A step-by-step guide to exercising your democratic right as an Indian citizen.</p>

      {/* Progress Bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px", alignItems: "center" }}>
        {steps.map((st, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }} onClick={() => setStep(i)}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: i === step ? s.color : done.includes(i) ? COLORS.green : COLORS.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#fff", transition: "all 0.2s", boxShadow: i === step ? `0 0 0 4px ${s.color}30` : "none" }}>{done.includes(i) ? "✓" : st.icon}</div>
            <div style={{ fontSize: "10px", color: i === step ? s.color : COLORS.textMuted, fontWeight: i === step ? "700" : "400", textAlign: "center", display: window.innerWidth > 600 ? "block" : "none" }}>Step {i + 1}</div>
          </div>
        ))}
      </div>

      {/* Step Card */}
      <div style={{ ...style.card, borderTop: `4px solid ${s.color}` }}>
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
          <button style={style.btn("secondary")} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Previous</button>
          <button onClick={() => toggleDone(step)} style={{ ...style.btn(done.includes(step) ? "green" : "secondary"), background: done.includes(step) ? COLORS.green : "#f0f0f0", color: done.includes(step) ? "#fff" : COLORS.text }}>
            {done.includes(step) ? "✓ Marked Done" : "Mark as Done"}
          </button>
          {step < steps.length - 1 && (
            <button style={style.btn("primary")} onClick={() => setStep(step + 1)}>Next Step →</button>
          )}
        </div>
      </div>
      <div style={{ marginTop: "12px", fontSize: "13px", color: COLORS.textMuted }}>Progress: {done.length}/{steps.length} steps completed</div>
      {done.length === steps.length && (
        <div style={{ marginTop: "20px", padding: "16px", background: `${COLORS.green}15`, border: `2px solid ${COLORS.green}`, borderRadius: "12px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎉</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: COLORS.green, marginBottom: "4px" }}>Congratulations!</div>
          <div style={{ fontSize: "14px", color: COLORS.text }}>You've completed all the steps. You are now fully prepared to cast your vote!</div>
        </div>
      )}
    </div>
  );
}

function ElectionTypesPage() {
  const [selected, setSelected] = useState(0);
  const e = electionTypes[selected];

  return (
    <div>
      <h2 style={style.sectionTitle}>Types of Elections in India</h2>
      <p style={style.sectionSub}>India holds multiple types of elections at different levels of governance.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {electionTypes.map((et, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ background: selected === i ? et.color : "#fff", border: `2px solid ${et.color}`, borderRadius: "12px", padding: "16px 12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{et.icon}</div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: selected === i ? "#fff" : COLORS.text, lineHeight: 1.3 }}>{et.title}</div>
          </button>
        ))}
      </div>
      {e && (
        <div style={{ ...style.card, borderLeft: `5px solid ${e.color}` }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "36px" }}>{e.icon}</span>
            <div>
              <h3 style={{ margin: 0, color: COLORS.navy, fontSize: "20px" }}>{e.title}</h3>
              <span style={style.badge(e.color)}>{e.freq}</span>
            </div>
          </div>
          <p style={{ fontSize: "15px", color: COLORS.text, lineHeight: 1.7, marginBottom: "16px" }}>{e.body}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[["🏛️ Total Seats", e.seats], ["🗳️ Voting System", e.winner], ["📌 Real Example", e.example]].map(([l, v]) => (
              <div key={l} style={{ background: "#f9f7f4", borderRadius: "10px", padding: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: e.color, marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RolesPage() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div>
      <h2 style={style.sectionTitle}>Key Electoral Officials & Roles</h2>
      <p style={style.sectionSub}>Who runs India's elections — from the apex ECI to your polling booth's Presiding Officer.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {roles.map((r, i) => (
          <div key={i} style={{ ...style.card, borderTop: `4px solid ${r.color}`, cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "28px", background: r.color + "15", borderRadius: "8px", padding: "8px", lineHeight: 1 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={style.badge(r.color)}>{r.level}</span>
                <h3 style={{ margin: "6px 0 0", fontSize: "15px", color: COLORS.navy }}>{r.title}</h3>
              </div>
              <span style={{ fontSize: "16px", color: COLORS.textMuted }}>{expanded === i ? "▲" : "▼"}</span>
            </div>
            {expanded === i && (
              <div style={{ marginTop: "14px", borderTop: `1px solid ${COLORS.border}`, paddingTop: "14px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: r.color, marginBottom: "6px" }}>📋 Responsibilities</div>
                  <ul style={{ margin: 0, paddingLeft: "18px" }}>
                    {r.responsibilities.map((res, j) => <li key={j} style={{ fontSize: "13px", color: COLORS.text, marginBottom: "4px", lineHeight: 1.5 }}>{res}</li>)}
                  </ul>
                </div>
                {[["🏅 How Chosen", r.chosen], ["⏱️ Term", r.term], ["👁️ Oversight", r.oversight]].map(([l, v]) => (
                  <div key={l} style={{ background: "#f9f7f4", borderRadius: "8px", padding: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: r.color }}>{l}: </span>
                    <span style={{ fontSize: "13px", color: COLORS.text }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPage() {
  const [activeStep, setActiveStep] = useState(0);
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

  return (
    <div>
      <h2 style={style.sectionTitle}>Results & Certification Process</h2>
      <p style={style.sectionSub}>What really happens after the last vote is cast — from EVM sealing to government formation.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {rSteps.map((s, i) => (
          <button key={i} onClick={() => setActiveStep(i)} style={{ padding: "8px 14px", borderRadius: "8px", border: `2px solid ${s.color}`, background: activeStep === i ? s.color : "transparent", color: activeStep === i ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: "inherit", fontSize: "12px", fontWeight: "700", transition: "all 0.2s" }}>{i + 1}. {s.title}</button>
        ))}
      </div>
      <div style={{ ...style.card, borderLeft: `5px solid ${rSteps[activeStep].color}` }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "40px" }}>{rSteps[activeStep].icon}</span>
          <div>
            <div style={{ fontSize: "12px", color: rSteps[activeStep].color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Step {activeStep + 1} of {rSteps.length}</div>
            <h3 style={{ margin: 0, fontSize: "20px", color: COLORS.navy }}>{rSteps[activeStep].title}</h3>
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: COLORS.text, marginBottom: "16px" }}>{rSteps[activeStep].detail}</p>
        <div style={{ background: `${COLORS.green}10`, border: `1px solid ${COLORS.green}30`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.green, marginBottom: "6px" }}>🔍 Myth vs. Fact</div>
          <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{rSteps[activeStep].myth}</div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
          <button style={style.btn("secondary")} onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>← Previous</button>
          {activeStep < rSteps.length - 1 && (
            <button style={style.btn("primary")} onClick={() => setActiveStep(activeStep + 1)}>Next →</button>
          )}
        </div>
      </div>
    </div>
  );
}

function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const cats = ["All", "Voting", "Officials", "Legal", "Counting", "Campaign Finance"];
  const filtered = glossaryTerms.filter(t =>
    (category === "All" || t.category === category) &&
    (t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <h2 style={style.sectionTitle}>Election Glossary</h2>
      <p style={style.sectionSub}>40+ key Indian election terms explained clearly.</p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search terms..." style={{ flex: 1, minWidth: "200px", padding: "10px 16px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, fontFamily: "inherit", fontSize: "14px", outline: "none" }} />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {cats.map(c => <button key={c} onClick={() => setCategory(c)} style={{ padding: "8px 14px", borderRadius: "20px", border: `2px solid ${COLORS.saffron}`, background: category === c ? COLORS.saffron : "transparent", color: category === c ? "#fff" : COLORS.text, cursor: "pointer", fontFamily: "inherit", fontSize: "12px", fontWeight: "600" }}>{c}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
        {filtered.map((t, i) => (
          <div key={i} style={style.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: COLORS.navy }}>{t.term}</h3>
              <span style={style.badge(COLORS.saffron)}>{t.category}</span>
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

function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const q = quizQuestions[current];

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.ans;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { correct, chosen: i, answer: q.ans }]);
  };
  const next = () => { if (current < quizQuestions.length - 1) { setCurrent(c => c + 1); setSelected(null); } else { setDone(true); } };
  const reset = () => { setCurrent(0); setSelected(null); setScore(0); setDone(false); setAnswers([]); };

  if (done) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div>
        <h2 style={style.sectionTitle}>Quiz Results</h2>
        <div style={{ ...style.card, textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}</div>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: pct >= 80 ? COLORS.green : pct >= 60 ? COLORS.saffron : COLORS.navyLight, marginBottom: "8px" }}>{score}/{quizQuestions.length}</div>
          <div style={{ fontSize: "18px", color: COLORS.textMuted, marginBottom: "24px" }}>{pct >= 80 ? "Excellent! You know Indian elections well! 🇮🇳" : pct >= 60 ? "Good effort! Review a few sections." : "Keep learning — explore the sections above!"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "300px", margin: "0 auto 24px" }}>
            <div style={{ background: `${COLORS.green}15`, borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.green }}>{score}</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Correct</div>
            </div>
            <div style={{ background: `${COLORS.saffron}15`, borderRadius: "10px", padding: "14px" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.saffron }}>{quizQuestions.length - score}</div>
              <div style={{ fontSize: "12px", color: COLORS.textMuted }}>Wrong</div>
            </div>
          </div>
          <button style={style.btn("primary")} onClick={reset}>Try Again 🔄</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={style.sectionTitle}>Civic Knowledge Quiz</h2>
      <p style={style.sectionSub}>Test your understanding of the Indian election process.</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "14px", color: COLORS.textMuted }}>Question {current + 1} of {quizQuestions.length}</div>
        <div style={{ fontSize: "14px", color: COLORS.green, fontWeight: "700" }}>Score: {score}</div>
      </div>
      <div style={{ background: "#fff", borderRadius: "4px", height: "6px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: COLORS.saffron, width: `${((current) / quizQuestions.length) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <div style={style.card}>
        <h3 style={{ fontSize: "18px", color: COLORS.navy, marginBottom: "20px", lineHeight: 1.5 }}>{q.q}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {q.opts.map((opt, i) => {
            let bg = "#f9f7f4", border = COLORS.border, color = COLORS.text;
            if (selected !== null) {
              if (i === q.ans) { bg = `${COLORS.green}15`; border = COLORS.green; color = COLORS.green; }
              else if (i === selected && i !== q.ans) { bg = `${COLORS.saffron}15`; border = COLORS.saffron; color = COLORS.saffronDark; }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `2px solid ${border}`, borderRadius: "10px", padding: "14px 18px", cursor: selected !== null ? "default" : "pointer", fontFamily: "inherit", fontSize: "14px", color, textAlign: "left", transition: "all 0.2s", fontWeight: selected !== null && i === q.ans ? "700" : "400" }}>
                <span style={{ fontWeight: "700", marginRight: "8px" }}>{["A", "B", "C", "D"][i]}.</span>{opt}
                {selected !== null && i === q.ans && " ✓"}
                {selected !== null && i === selected && i !== q.ans && " ✗"}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div style={{ background: `${COLORS.ashoka}10`, border: `1px solid ${COLORS.ashoka}30`, borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.ashoka, marginBottom: "4px" }}>📖 Explanation</div>
            <div style={{ fontSize: "13px", color: COLORS.text, lineHeight: 1.5 }}>{q.exp}</div>
          </div>
        )}
        {selected !== null && <button style={style.btn("primary")} onClick={next}>{current < quizQuestions.length - 1 ? "Next Question →" : "See Results 🏆"}</button>}
      </div>
    </div>
  );
}

function AskAIPage() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Jai Hind! 🇮🇳 I'm your Indian Election Guide assistant. Ask me anything about the Indian election process — voter registration, EVMs, ECI, Lok Sabha, Model Code of Conduct, or anything else!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const suggestions = ["How do I register to vote in India?", "What is the Model Code of Conduct?", "How does EVM voting work?", "What is NOTA?", "How is the Prime Minister elected?", "What happens during vote counting?"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemPrompt: "You are an expert, neutral, and friendly guide on the Indian election process. You explain concepts clearly using simple language, Indian context, and real examples. Topics you know deeply: ECI, EVM, VVPAT, Lok Sabha, Rajya Sabha, Vidhan Sabha, Model Code of Conduct, voter registration (Form 6, EPIC), postal ballots, nomination process, counting, result declaration, formation of government, key officials, election types, and Indian electoral law. Always be non-partisan, accurate, and cite relevant constitutional articles or laws when helpful. Respond in 2-4 paragraphs.",
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await resp.json();
      const reply = data.reply || data.error || "I couldn't fetch a response. Please try again.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={style.sectionTitle}>Ask AI — Election Assistant</h2>
      <p style={style.sectionSub}>Powered by Claude — ask any question about the Indian election process.</p>
      <div style={{ background: `${COLORS.saffron}10`, border: `1px solid ${COLORS.saffron}30`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: COLORS.saffronDark }}>⚖️ This assistant provides civic education only — not legal or partisan advice.</div>
      <div style={{ ...style.card, padding: 0, overflow: "hidden" }}>
        <div style={{ height: "420px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "80%", background: m.role === "user" ? COLORS.saffron : "#f5f5f5", color: m.role === "user" ? "#fff" : COLORS.text, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", fontSize: "14px", lineHeight: 1.6 }}>
                {m.role === "assistant" && <span style={{ fontSize: "16px", marginRight: "6px" }}>🇮🇳</span>}
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: "flex", justifyContent: "flex-start" }}><div style={{ background: "#f5f5f5", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: "14px", color: COLORS.textMuted }}>🇮🇳 Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px 16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {suggestions.map((s, i) => <button key={i} onClick={() => send(s)} style={{ padding: "5px 12px", borderRadius: "16px", border: `1px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", color: COLORS.text }}>{s}</button>)}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about Indian elections..." style={{ flex: 1, padding: "10px 16px", borderRadius: "24px", border: `1px solid ${COLORS.border}`, fontFamily: "inherit", fontSize: "14px", outline: "none" }} />
            <button onClick={() => send()} style={{ ...style.btn("primary"), borderRadius: "24px", padding: "10px 20px" }} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Jai Hind! 🇮🇳 I'm your AI Election Guide assistant. How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemPrompt: "You are an expert, neutral, and friendly guide on the Indian election process. You explain concepts clearly using simple language, Indian context, and real examples. Respond in 1-2 short paragraphs.",
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await resp.json();
      const reply = data.reply || data.error || "I couldn't fetch a response. Please try again.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Network error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {isOpen && (
        <div style={{ position: "fixed", bottom: "90px", right: "24px", width: "350px", height: "500px", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 100%)`, color: "#fff", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}><span style={{fontSize:"20px"}}>🤖</span> Ask AI Assistant</div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", background: COLORS.cream }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? COLORS.saffron : "#fff", color: m.role === "user" ? "#fff" : COLORS.text, border: m.role === "user" ? "none" : `1px solid ${COLORS.border}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: "14px", lineHeight: 1.5, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "18px 18px 18px 4px", padding: "10px 14px", fontSize: "14px", color: COLORS.textMuted, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>Thinking...</div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px", background: "#fff", display: "flex", gap: "8px" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask something..." style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: `1px solid ${COLORS.border}`, fontFamily: "inherit", fontSize: "14px", outline: "none" }} />
            <button onClick={send} disabled={loading || !input.trim()} style={{ ...style.btn("primary"), padding: "10px 16px", borderRadius: "20px" }}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} style={{ position: "fixed", bottom: "24px", right: "24px", width: "60px", height: "60px", borderRadius: "30px", background: COLORS.saffron, color: "#fff", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(255,107,0,0.4)", zIndex: 1001, border: "none", transition: "transform 0.2s" }}>
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}

// ─────────────── MAIN APP ───────────────
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

  const pages = { home: <HomePage setTab={setTab} />, timeline: <TimelinePage />, vote: <HowToVotePage />, types: <ElectionTypesPage />, roles: <RolesPage />, results: <ResultsPage />, glossary: <GlossaryPage />, quiz: <QuizPage />, ai: <AskAIPage /> };

  return (
    <div style={style.app}>
      <header style={style.header}>
        <div style={style.tricolorBar} />
        <div style={style.headerTop}>
          <div style={style.logo}>
            <span style={style.logoIcon}>🗳️</span>
            <div>
              <span style={style.logoText}>Chunav Gyaan</span>
              <span style={style.logoSub}>India's Complete Election Guide</span>
            </div>
          </div>
          <div style={{ color: COLORS.gold, fontSize: "13px", fontStyle: "italic" }}>लोकतंत्र की शक्ति</div>
        </div>
        <nav style={style.nav}>
          {tabs.map(t => <button key={t.id} style={style.navBtn(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </nav>
      </header>
      <main style={style.main}>{pages[tab]}</main>
      <footer style={{ background: COLORS.navy, color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "20px", fontSize: "12px", marginTop: "40px" }}>
        <div style={{ height: "3px", background: `linear-gradient(to right, ${COLORS.saffron} 33.3%, #fff 33.3%, #fff 66.6%, ${COLORS.green} 66.6%)`, marginBottom: "16px" }} />
        Chunav Gyaan © 2024 · For civic education only · Not affiliated with ECI · जय हिन्द 🇮🇳
      </footer>
      <FloatingAIChat />
    </div>
  );
}
