// server.js
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Serve static files (index.html, style.css, script.js inside "public" folder)
app.use(express.static(path.join(__dirname, "public")));

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Render will provide this
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-5", // change to "gpt-4o-mini" if gpt-5 fails
      input: userMessage,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ reply: "⚠️ Something went wrong on the server." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

