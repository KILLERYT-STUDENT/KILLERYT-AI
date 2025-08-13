import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for chat
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

    const data = await apiRes.json();
    res.json({ reply: data.choices[0]?.message?.content || "No reply." });
  } catch (err) {
    res.status(500).json({ reply: "Error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
