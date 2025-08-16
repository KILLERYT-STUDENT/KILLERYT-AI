// server.js (ESM compatible)

import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Home route
app.get("/", (req, res) => {
  res.send("🚀 AI Server is running on Render!");
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-5",
      input: userMessage,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
