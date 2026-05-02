let cache = null;
let cacheTime = null;

const fallbackNews = [
  {
    title: "Election Commission of India — Official Updates",
    snippet: "Stay updated with the latest announcements, schedules, and guidelines from the Election Commission of India.",
    link: "https://www.eci.gov.in",
    source: "eci.gov.in"
  },
  {
    title: "Voter Registration — How to Register Online",
    snippet: "Register to vote at voters.eci.gov.in. Fill Form 6 online, submit proof of age and residence, and get your Voter ID card.",
    link: "https://voters.eci.gov.in",
    source: "voters.eci.gov.in"
  },
  {
    title: "EVM and VVPAT — Everything You Need to Know",
    snippet: "Electronic Voting Machines have been used in India since 1982. Learn how EVMs and VVPATs work and ensure your vote is counted.",
    link: "https://www.eci.gov.in/evm",
    source: "eci.gov.in"
  },
  {
    title: "Model Code of Conduct — Rules During Elections",
    snippet: "The Model Code of Conduct comes into force immediately upon election schedule announcement and applies to all parties and candidates.",
    link: "https://www.eci.gov.in/mcc",
    source: "eci.gov.in"
  }
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (cache && cacheTime && Date.now() - cacheTime < 3600000) {
    return res.status(200).json({ articles: cache, isFallback: false });
  }

  try {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const query = "India election news ECI 2024";
    
    console.log("API_KEY exists:", !!API_KEY);
    console.log("CX exists:", !!CX);

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=4`;

    const response = await fetch(url);
    console.log("Full API response status:", response.status);
    
    const data = await response.json();
    console.log("Raw API response:", JSON.stringify(data));

    if (!data.items || data.items.length === 0) {
      return res.status(200).json({ articles: fallbackNews, isFallback: true });
    }

    const articles = data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      source: item.displayLink || "news",
    }));

    cache = articles;
    cacheTime = Date.now();

    return res.status(200).json({ articles, isFallback: false });
  } catch (error) {
    console.error("News fetch error:", error);
    return res.status(200).json({ articles: fallbackNews, isFallback: true });
  }
}
