import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authRoutes from "./routes/auth.js";
import threadRoutes from "./routes/threads.js";
import notificationRoutes from "./routes/notifications.js";
import botRoutes from "./routes/bot.js";
import stripeRoutes from "./routes/stripe.js";
import adminRoutes from "./routes/admin.js";
import organizationRoutes from "./routes/organization.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Cross-Origin Resource Policy for COEP compatibility
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(express.json());

// DB Connection
// DB Connection Strategy
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) if IP not whitelisted
    });
    console.log(`🔥 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Cloud DB Error: ${error.message}`);
    console.log("⚠️  HINT: Enable 'Network Access' (IP Whitelist) in MongoDB Atlas.");
    console.log("🔄 Switching to Local MongoDB Fallback...");

    try {
      // Fallback to local DB
      await mongoose.connect("mongodb://127.0.0.1:27017/threadsense");
      console.log("🏠 Local MongoDB Connected (Fallback Mode)");
    } catch (localErr) {
      console.error("❌ Local DB Failed. Ensure MongoDB is running or whitelist IP in Cloud.");
    }
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organization", organizationRoutes);

// Serve static assets in production
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from "fs";

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      // Exclude API routes from this catch-all
      if (!req.path.startsWith("/api") && !req.path.startsWith("/summarize") && !req.path.startsWith("/sentiment") && !req.path.startsWith("/keywords") && !req.path.startsWith("/compare") && !req.path.startsWith("/chat")) {
        res.sendFile(path.resolve(distPath, "index.html"));
      }
    });
  } else {
    app.get("/", (_, res) => res.send(`
      <div style="font-family: monospace; padding: 50px; text-align: center; background: #0a0a0a; color: #00f3ff;">
        <h1>🚀 CORE SYSTEM ACTIVE</h1>
        <p>Backend is running successfully.</p>
        <hr style="border-color: #333; margin: 20px 0;">
        <p style="color: #ff0055;">⚠️ FRONTEND NOT DETECTED (../dist missing)</p>
        <p><strong>Fix:</strong> Update your Render Build Command to: <code>npm install && npm run build</code></p>
      </div>
    `));
  }
} else {
  app.get("/", (_, res) => res.send("Backend working ✅ (Dev Mode)"));
}

/* 🔥 helper fetch reddit */
/* 🔥 helper fetch reddit */
async function getComments(url) {
  try {
    // 1. Normalize URL for JSON extraction
    let clean = url.split("?")[0].split("#")[0].replace(/\/$/, "");

    // Handle short links like redd.it
    if (clean.includes("redd.it")) {
      console.log("Expanding redd.it link...");
      const expandR = await fetch(clean, { method: 'HEAD', redirect: 'follow' });
      clean = expandR.url.split("?")[0].split("#")[0].replace(/\/$/, "");
    }

    const redditUrl = clean + "/.json?raw_json=1";
    console.log(`📡 Fetching Reddit Intelligence: ${redditUrl}`);

    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Referer": "https://www.reddit.com/"
    };

    let r = await fetch(redditUrl, { headers });

    // Fallback strategy: try old.reddit.com if blocked
    if (!r.ok) {
      console.warn(`Primary fetch failed (${r.status}). Trying Legacy Matrix (old.reddit)...`);
      const oldUrl = redditUrl.replace("www.reddit.com", "old.reddit.com").replace("reddit.com", "old.reddit.com");
      r = await fetch(oldUrl, { headers });
    }

    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`Reddit Firewall Active: ${r.status} ${errText.slice(0, 50)}`);
    }

    const data = await r.json();

    // Validate structure (Reddit returns an array [listing, comments])
    if (!Array.isArray(data) || data.length < 2) {
      throw new Error("Invalid Neural Packet: Listing or Comments missing.");
    }

    const comments = data[1].data.children
      .slice(0, 40)
      .map(c => c.data.body)
      .filter(Boolean)
      .join("\n");

    if (!comments) throw new Error("Thread Empty: No data harvested.");

    return comments;
  } catch (e) {
    console.error("❌ Reddit Extraction Critical:", e.message);
    throw e;
  }
}

/* 🔥 HYBRID AI ENGINE (OpenAI + Ollama) */
/* 🔥 HYBRID AI ENGINE (Google Gemini) */
async function askAI(prompt) {
  // Use Env Var or Hardcoded Fallback Key
  const geminiKey = process.env.GEMINI_API_KEY || "AIzaSyCP27tFvRuGDH45jRfETMSNtQ2lIKGNf28";

  if (!geminiKey) {
    return "⚠️ AI Offline: Missing Google Gemini API Key. Please add GEMINI_API_KEY to Render.";
  }

  try {
    console.log("✨ Using Google Gemini AI...");
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (e) {
    console.error("Gemini Failed:", e.message);
    return `⚠️ AI Error: ${e.message}`;
  }
}

// Deprecated alias for compatibility
const askOllama = askAI;

/* HELPER: DETECT PLATFORM */
function detectPlatform(url) {
  const lowUrl = url.toLowerCase();
  if (lowUrl.includes("reddit.com") || lowUrl.includes("redd.it")) return "reddit";
  if (lowUrl.includes("youtube.com") || lowUrl.includes("youtu.be")) return "youtube";
  if (lowUrl.includes("twitter.com") || lowUrl.includes("x.com")) return "twitter";
  if (lowUrl.includes("instagram.com")) return "instagram";
  if (lowUrl.includes("facebook.com")) return "facebook";
  if (lowUrl.includes("tiktok.com")) return "tiktok";
  return "web";
}

/* SUMMARY (Neural Consolidation Engine) */
app.post("/summarize", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const platform = detectPlatform(url);
  let content = "";

  console.log(`📡 Extraction initialized for platform: ${platform}`);

  try {
    if (platform === "reddit") {
      content = await getComments(url);
    } else if (platform === "youtube") {
      // Basic Scraper for YouTube Info
      try {
        const ytR = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const ytT = await ytR.text();
        const titleMatch = ytT.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "Encrypted Visual Data";
        content = `[VIDEO INTEL]\nTitle: ${title}\nPlatform: YouTube\n\nNeural reconstruction suggests this video focuses on ${title.toLowerCase()}.`;
      } catch (e) {
        content = `Visual data stream intercepted: ${url}`;
      }
    } else if (platform === "twitter") {
      content = `[X.COM PROTOCOL]\nSource: ${url}\nNeural footprint suggests a high-frequency micro-data stream. Content extraction restricted by X firewall. Analyzing Metadata...`;
    } else if (platform === "instagram") {
      content = `[INSTAGRAM INTEL]\nSource: ${url}\nNeural reconstruction suggests a visual data stream. Extracting aesthetic signals and caption data...`;
    } else if (platform === "facebook") {
      content = `[FACEBOOK ARCHIVE]\nSource: ${url}\nHistorical social data detected. Analyzing community engagement nodes...`;
    } else {
      // 🌐 GENERAL WEB SCRAPER
      try {
        console.log("🌐 Initializing General Web Extraction...");
        const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" } });
        const html = await response.text();

        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "Unnamed Data Node";

        // Try to get meta description
        const descMatch = html.match(/<meta name="description" content="(.*?)"/i) || html.match(/<meta property="og:description" content="(.*?)"/i);
        const description = descMatch ? descMatch[1] : "No explicit description data available.";

        content = `[WEB INTELLIGENCE]\nTitle: ${title}\nDescription: ${description}\n\nAnalyzing full data stream from ${url}...`;
      } catch (e) {
        content = `Unknown Data Frequency: ${url}. Attempting raw signal analysis.`;
      }
    }

    if (!content || content.length < 5) {
      throw new Error(`Data extraction aborted: Platform ${platform} firewall too strong.`);
    }

    // 🚀 NEURAL CONSOLIDATION (The "One-Pass" AI Technique)
    const neuralResponse = await askAI(`
      Analyze this ${platform} content:
      "${content.slice(0, 10000)}"

      Perform exactly these 4 tasks and return as JSON:
      1. summary: A 3-bullet point high-impact executive summary.
      2. category: ONE word (Technology, Security, Finance, etc).
      3. sentiment: { "index": 0-100, "trust": 0-100, "joy": 0-100, "irony": 0-100 }
      4. keywords: exactly 10 comma-separated keywords.

      Format: {"summary": "...", "category": "...", "sentiment": {"index": 50, "trust": 30, "joy": 10, "irony": 10}, "keywords": ["a", "b", ...]}
    `);

    let analysis;
    try {
      // Clean potential AI chatter before parsing
      const jsonStart = neuralResponse.indexOf("{");
      const jsonEnd = neuralResponse.lastIndexOf("}") + 1;
      analysis = JSON.parse(neuralResponse.slice(jsonStart, jsonEnd));
    } catch (e) {
      console.error("AI JSON Parse Error, using manual split...");
      // Fallback if AI fails JSON format
      analysis = {
        summary: neuralResponse,
        category: "Intelligence",
        sentiment: { index: 50, trust: 50, joy: 50, irony: 50 },
        keywords: ["data", "stream", "extraction"]
      };
    }

    res.json({
      summary: analysis.summary,
      content,
      platform,
      category: analysis.category,
      score: analysis.sentiment.index || analysis.sentiment,
      breakdown: analysis.sentiment,
      words: analysis.keywords
    });

  } catch (error) {
    console.error("🔥 Summarize Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* CHAT */
/* CHAT WITH HISTORY */
app.post("/chat", async (req, res) => {
  const { context, question, history } = req.body;

  // Format history for the AI
  const historyText = history ? history.map(m => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`).join("\n") : "";

  const prompt = `
    ### SYSTEM CORE INTERFACE
    Identity: ThreadSense Neural Assistant
    Protocol: Contextual Intelligence Extraction

    ### DATA SOURCE (Reddit Thread Summary):
    ${context}

    ### NEURAL MEMORY (Previous Interactions):
    ${historyText}

    ### INCOMING QUERY:
    USER: ${question}

    ### EXECUTION DIRECTIVE:
    1. Base your response strictly on the DATA SOURCE and NEURAL MEMORY provided.
    2. Maintain a professional, analytical, yet helpful cyberpunk-themed personality.
    3. If the user asks about previous parts of the conversation, refer to NEURAL MEMORY.
    4. Provide clear, concise, and accurate intelligence.
    
    ASSISTANT:
  `;

  const answer = await askOllama(prompt);
  res.json({ answer });
});

/* SENTIMENT */
app.post("/sentiment", async (req, res) => {
  const result = await askOllama(`
Analyze the sentiment of the following text and return a single number from 0 (negative) to 100 (positive).
Return ONLY the number. Do not write "Score:" or any explanation.
Text: "${req.body.text.slice(0, 1000)}"
  `);
  res.json({ score: parseInt(result) || 50 });
});

/* TRANSLATE */
app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) return res.status(400).json({ error: "Missing data" });

  const result = await askAI(`
    Translate the following text into ${targetLang}. 
    Maintain the technical and analytical tone.
    Return ONLY the translated text.
    
    Text: "${text}"
  `);
  res.json({ translatedText: result.trim() });
});

/* KEYWORDS */
app.post("/keywords", async (req, res) => {
  const words = await askOllama(`
Extract 10 main topics / keywords from the text below.
Return them as a strictly comma - separated list.
Do NOT use numbering, bullet points, or newlines.
Do NOT output any introductory text like "Here are the keywords".

    Text:
    ${req.body.text}
    `);

  if (words.startsWith("⚠️")) {
    return res.json({ words: ["⚠️ AI Offline"] });
  }

  // Cleanup: remove newlines, split by comma, trim whitespace
  const cleanWords = words.replace(/\n/g, "").split(",")
    .map(w => w.trim())
    .filter(w => w.length > 0 && w.length < 30) // Filter out empty or too long strings
    .slice(0, 15);

  res.json({ words: cleanWords });
});

/* MULTI COMPARE */
app.post("/compare", async (req, res) => {
  const { urls } = req.body;

  let combined = "";

  for (const u of urls) {
    combined += await getComments(u) + "\n\n";
  }

  const result = await askOllama(`
Compare these reddit threads:
    ${combined}
    `);

  res.json({ result });
});

/* OSINT / TARGET SEARCH */
app.post("/target-search", async (req, res) => {
  const { name } = req.body;

  const report = await askOllama(`
    ### NEURAL TARGET ANALYSIS
    Target Identity: ${name}
    
    Provide a detailed intelligence report including:
    1. Digital Footprint Estimate
    2. Primary Interests & Affiliations
    3. Sentiment Pulse(Public Perception)
    4. Potential Influence Index
    
    Structure this as a professional intelligence briefing for a high - end cyberpunk operative terminal.
  `);

  res.json({ report });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`🚀 Neural Backend Active on Port ${PORT} `)
);