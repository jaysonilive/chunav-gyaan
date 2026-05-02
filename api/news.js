let cache = null;
let cacheTime = null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Cache for 1 hour
  if (cache && cacheTime && Date.now() - cacheTime < 3600000) {
    return res.status(200).json({ articles: cache });
  }

  try {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_SEARCH_ENGINE_ID;
    const query = "India election news ECI 2024";
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=4&sort=date`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res.status(200).json({ articles: [] });
    }

    const articles = data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      source: item.displayLink,
    }));

    cache = articles;
    cacheTime = Date.now();

    return res.status(200).json({ articles });
  } catch (error) {
    return res.status(500).json({ 
      error: "Could not fetch news" 
    });
  }
}
