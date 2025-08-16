// server.js (ESM compatible)
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat route (frontend calls this as /api/chat)
app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await client.responses.create({
      model: "gpt-5",
      input: messages,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Always serve index.html for any unknown route (for frontend refreshes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
