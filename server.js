import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Fix dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ✅ Serve the public folder (make sure 'public' is in the same folder as server.js)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Route to serve index.html on root "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      })
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(errText);
    }

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: `Error: ${err.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
