import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "public")));

// AI Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });

    if (!apiRes.ok) {
      throw new Error(`OpenAI API error: ${apiRes.status}`);
    }

    const data = await apiRes.json();
    const reply = data.choices[0]?.message?.content || "No reply from AI";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Error connecting to AI" });
  }
});

// Default route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
