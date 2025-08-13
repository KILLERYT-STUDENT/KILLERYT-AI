import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // if using Node < 18; remove if Node >= 18

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    const data = await apiRes.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Fallback route (for SPA or index.html)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
