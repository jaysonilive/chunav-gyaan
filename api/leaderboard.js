export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const SHEET_ID = process.env.GOOGLE_SHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const RANGE = "Sheet1!A:E";
  const BASE = "https://sheets.googleapis.com/v4/spreadsheets";

  if (req.method === "GET") {
    try {
      const url = `${BASE}/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const rows = data.values || [];
      
      // Skip header row, sort by percentage, return top 10
      const scores = rows
        .slice(1)
        .map(row => ({
          name: row[0] || "Anonymous",
          score: row[1] || "0",
          total: row[2] || "10",
          percentage: parseFloat(row[3]) || 0,
          date: row[4] || ""
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10);

      return res.status(200).json({ scores });
    } catch (error) {
      return res.status(500).json({ 
        error: "Could not fetch leaderboard" 
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, score, total, percentage } = req.body;
      
      if (!name || !score || !total || !percentage) {
        return res.status(400).json({ 
          error: "Missing required fields" 
        });
      }

      const date = new Date().toLocaleDateString("en-IN");
      const values = [[name, score, total, percentage, date]];

      const url = `${BASE}/${SHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      return res.status(200).json({ 
        success: true, 
        message: "Score saved!" 
      });
    } catch (error) {
      return res.status(500).json({ 
        error: "Could not save score" 
      });
    }
  }
}
