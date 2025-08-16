// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

// Try to load dotenv only if available (local dev)
let dotenvLoaded = false;
try {
  const dotenv = await import("dotenv");
  dotenv.config();
  dotenvLoaded = true;
  console.log("✅ dotenv loaded (local dev mode)");
} catch (err) {
  console.log("ℹ️ dotenv not found, using Render env variables");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Serve static files (index.html, style.css, script.js inside "public" folder)
app.use(express.static(path.join(__dirname, "public")));

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-5",
      input: userMessage,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "Error: Something went wrong" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
