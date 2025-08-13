import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// API endpoint for AI chat
app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];

    // Send to OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await openaiRes.json();

    if (data.error) {
      return res.status(400).json({ reply: `⚠️ OpenAI Error: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ reply: `⚠️ Server Error: ${error.message}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
