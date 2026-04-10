const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/api/health", (req, res) => {
  res.json({ status: "MindLab backend running 🚀" });
});

app.post("/api/ai/generate", async (req, res) => {
  const { userInput, systemPrompt } = req.body;
  if (!userInput) return res.status(400).json({ error: "userInput required" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt || "You are a helpful AI assistant." },
        { role: "user", content: userInput }
      ],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));