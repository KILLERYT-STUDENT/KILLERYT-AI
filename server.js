const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Setup OpenAI with your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your .env has this
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.responses.create({
      model: "gpt-5",
      input: userMessage,
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("Error with OpenAI:", error);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
