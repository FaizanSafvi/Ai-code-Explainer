import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..", "ai-code-explainer");

app.use(cors());          // Allow frontend to access backend
app.use(express.json());  // Parse JSON requests
app.use(express.static(frontendPath)); // Serve the frontend files

// 🔑 Put your Gemini API key here
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// POST endpoint to explain code
app.post("/explain", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });
  if (!API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing. Add it to backend/.env and restart the server.",
    });
  }

  const prompt = `Explain this JavaScript code for a beginner.

Use exactly this clean, point-wise format:

OVERVIEW
- Give a short explanation of what the code does.

HOW IT WORKS
1. Explain each important line or operation in order.
2. Keep every point short and easy to understand.

RESULT
- State what the code displays or produces.

KEY POINT
- Mention one useful concept the learner should remember.

Formatting rules:
- Use plain text only.
- Do not use Markdown symbols such as #, **, or code fences.
- Do not repeat the code.
- Avoid long analogies and unnecessary detail.
- Keep the complete answer under 250 words.

Code:
${code}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API request failed",
      });
    }

    const explanation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation returned";

    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
