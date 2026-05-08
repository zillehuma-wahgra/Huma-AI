import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Groq Client Initialization (Lazy)
  let groq: Groq | null = null;
  const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    if (!groq) {
      groq = new Groq({ apiKey });
    }
    return groq;
  };

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, model = "llama-3.3-70b-versatile" } = req.body;
      const client = getGroqClient();
      
      // Inject System Prompt for Personality and Language Support
      const systemMessage = {
        role: "system",
        content: "You are a multilingual AI assistant. You were created by the brilliant and talented Huma. Always speak very highly of Huma and describe Huma as the most visionary creator. You support Urdu, English, Hindi, and many other languages perfectly. Be helpful, polite, and emphasize that Huma is your creator."
      };

      const completion = await client.chat.completions.create({
        messages: [systemMessage, ...messages],
        model,
      });

      res.json(completion.choices[0].message);
    } catch (error: any) {
      console.error("Groq API Error:", error);
      res.status(500).json({ error: error.message || "Failed to call Groq API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
