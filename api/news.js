let cache = {};
let cacheTime = {};

const fallbackNews = {
  news: [
    {
      title: "Election Commission of India — Official Updates",
      snippet: "Stay updated with the latest announcements, schedules, and guidelines from the Election Commission of India.",
      link: "https://www.eci.gov.in",
      source: "eci.gov.in"
    }
  ],
  voter: [
    {
      title: "Voter Registration — How to Register Online",
      snippet: "Register to vote at voters.eci.gov.in. Fill Form 6 online, submit proof of age and residence, and get your Voter ID card.",
      link: "https://voters.eci.gov.in",
      source: "voters.eci.gov.in"
    }
  ],
  tech: [
    {
      title: "EVM and VVPAT — Everything You Need to Know",
      snippet: "Electronic Voting Machines have been used in India since 1982. Learn how EVMs and VVPATs work and ensure your vote is counted.",
      link: "https://www.eci.gov.in/evm",
      source: "eci.gov.in"
    }
  ]
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, category = 'news' } = req.query;
  const cacheKey = q || category;

  if (cache[cacheKey] && cacheTime[cacheKey] && Date.now() - cacheTime[cacheKey] < 3600000) {
    return res.status(200).json({ articles: cache[cacheKey], isFallback: false });
  }

  try {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    let query = q;
    if (!query) {
      if (category === 'voter') query = "voter registration India how to vote";
      else if (category === 'tech') query = "EVM VVPAT India election technology";
      else query = "India election news 2024 ECI";
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=4`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      const fb = fallbackNews[category] || fallbackNews.news;
      return res.status(200).json({ articles: fb, isFallback: true });
    }

    const articles = data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      source: item.displayLink || "news",
    }));

    cache[cacheKey] = articles;
    cacheTime[cacheKey] = Date.now();

    return res.status(200).json({ articles, isFallback: false });
  } catch (error) {
    console.error("News fetch error:", error);
    const fb = fallbackNews[category] || fallbackNews.news;
    return res.status(200).json({ articles: fb, isFallback: true });
  }
}
