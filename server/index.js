import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authRoutes from "./routes/auth.js";
import fetch from "node-fetch";
import threadRoutes from "./routes/threads.js";
import notificationRoutes from "./routes/notifications.js";
import botRoutes from "./routes/bot.js";
import stripeRoutes from "./routes/stripe.js";
import adminRoutes from "./routes/admin.js";
import organizationRoutes from "./routes/organization.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";



const __dirname_env = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname_env, '.env');
dotenv.config({ path: envPath });

console.log("------------------------------------------------");
console.log("🚀 NEURAL BACKEND INITIALIZING...");

// DEBUG: Check available models
const debugGemini = async () => {
  if (process.env.GOOGLE_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("✅ Gemini Check: Client initialized");
    } catch (e) {
      console.log("❌ Gemini Check Failed:", e.message);
    }
  }
};
debugGemini();

console.log("------------------------------------------------");

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
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from "fs";

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    app.use("/uploads", express.static(uploadsDir));
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
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  app.use("/uploads", express.static(uploadsDir));
}

// Serve uploads in all modes
const uploadsRoot = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });
app.use("/uploads", express.static(uploadsRoot));

/* 🔥 helper fetch reddit */
/* 🔥 helper fetch reddit */
// TIMEOUT UTILITY
const fetchWithTimeout = async (url, options = {}, timeout = 8000) => {
  if (typeof AbortController === 'undefined') {
    // Fallback for older Node versions
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), timeout))
    ]);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};





/* 🔥 helper fetch reddit */
async function getComments(url) {
  try {
    const clean = url.split("?")[0].split("#")[0].replace(/\/$/, "");
    const redditUrl = clean.endsWith(".json") ? clean : `${clean}/.json?raw_json=1`;
    console.log(`📡 Fetching Reddit Intelligence: ${redditUrl}`);

    const r = await fetchWithTimeout(redditUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" }
    }, 5000);

    if (!r.ok) throw new Error(`Reddit API ${r.status}`);
    const data = await r.json();
    const comments = data[1]?.data?.children
      ?.slice(0, 50)
      .map(c => c.data.body)
      .filter(Boolean)
      .join("\n") || "";

    if (!comments) throw new Error("No comments found in JSON");
    return comments;
  } catch (e) {
    console.warn("getComments failed:", e.message);
    return ""; // Return empty string for /compare instead of crashing
  }
}

/* IMAGE UPLOAD */
app.post("/api/upload-image", async (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image")) {
      return res.status(400).json({ error: "Invalid image" });
    }
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const extMatch = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,/i);
    const ext = extMatch ? (extMatch[1] === "jpg" ? "jpeg" : extMatch[1]) : "png";
    const cleanName = (filename || "img").replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 32);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const outName = `${cleanName || "img"}-${unique}.${ext}`;
    const outPath = path.join(uploadsDir, outName);
    const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(b64, "base64");
    fs.writeFileSync(outPath, buf);
    res.json({ url: `/uploads/${outName}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/upload-audio", async (req, res) => {
  try {
    const { audioBase64, filename } = req.body;
    if (!audioBase64 || typeof audioBase64 !== "string" || !audioBase64.startsWith("data:audio")) {
      return res.status(400).json({ error: "Invalid audio" });
    }
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const extMatch = audioBase64.match(/^data:audio\/(webm|mpeg|mp3|wav|ogg);base64,/i);
    const ext = extMatch ? (extMatch[1] === "mpeg" ? "mp3" : extMatch[1]) : "webm";
    const cleanName = (filename || "audio").replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 32);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const outName = `${cleanName || "audio"}-${unique}.${ext}`;
    const outPath = path.join(uploadsDir, outName);
    const b64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
    const buf = Buffer.from(b64, "base64");
    fs.writeFileSync(outPath, buf);
    res.json({ url: `/uploads/${outName}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


let geminiCooldownUntil = 0;

/* 🔥 HYBRID AI ENGINE (Groq - Llama 3 with Gemini Fallback) */
async function askAI(prompt) {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  // Promise Race Utility for AI Timeout (15s max)
  const withTimeout = (promise, ms = 15000) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), ms))
  ]);

  // 1. Try Groq
  if (groqKey) {
    try {
      console.log("⚡ Using Groq AI (Llama 3)...");
      const groq = new Groq({ apiKey: groqKey });
      const completion = await withTimeout(
        groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "mixtral-8x7b-32768",
        })
      );
      return completion.choices[0]?.message?.content || "No response generated.";
    } catch (e) {
      console.error("❌ Groq Failed/Timeout:", e.message);
    }
  }

  // 2. Fallback to Gemini
  if (geminiKey) {
    try {
      if (Date.now() < geminiCooldownUntil) {
        throw new Error("Gemini cooldown active");
      }
      console.log("💎 Using Gemini Pro...");
      const genAI = new GoogleGenerativeAI(geminiKey);

      // 1. Try modern flash model via Raw Fetch (v1 Stable)
      // DYNAMIC MODEL DISCOVERY (The ultimate fix for "Model Not Found")
      try {
        console.log("🔍 Auto-detecting available Gemini models...");
        // Use v1beta for listing as it shows the most info
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`;
        const listResp = await fetch(listUrl);

        let targetModel = "gemini-1.5-flash"; // Default preference
        let targetVersion = "v1beta";

        if (listResp.ok) {
          const listData = await listResp.json();
          const available = listData.models?.filter(m => m.supportedGenerationMethods?.includes("generateContent")) || [];
          console.log("✅ Available Models:", available.map(m => m.name));

          // Prefer 1.5-flash, then 1.5-pro, then gemini-pro, then anything
          const preferred = [
            "models/gemini-1.5-flash",
            "models/gemini-1.5-pro",
            "models/gemini-pro",
            "models/gemini-1.0-pro"
          ];

          // Find the first available model from our preferences
          const found = preferred.find(p => available.some(a => a.name === p));
          if (found) {
            targetModel = found.replace(/^models\//, "");
            console.log(`🎯 Selected Model: ${targetModel}`);
          } else if (available.length > 0) {
            // Fallback to ANY available model if preferences fail
            targetModel = available[0].name.replace(/^models\//, "");
            console.log(`🎯 Selected Fallback Model: ${targetModel}`);
          }
        } else {
          console.warn("⚠️ Failed to list models, defaulting to gemini-1.5-flash", await listResp.text());
        }

        // 2. Call the API with the detected model
        // Note: Some legacy models require v1, newer ones v1beta. 
        // 1.5-flash implies v1beta usually, but v1 promotes it.
        // Let's stick to v1beta for widest compatibility unless we know otherwise.
        const generateUrl = `https://generativelanguage.googleapis.com/${targetVersion}/models/${targetModel}:generateContent?key=${geminiKey}`;
        console.log(`💎 Generating with: ${generateUrl}`);

        const response = await withTimeout(
          fetch(generateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          })
        );

        if (!response.ok) {
          const errText = await response.text();
          const is429 = response.status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(errText);
          if (is429) {
            const retryMatch = errText.match(/retry in (\d+(\.\d+)?)s/i);
            const retrySec = retryMatch ? parseFloat(retryMatch[1]) : 60;
            geminiCooldownUntil = Date.now() + retrySec * 1000;
            if (process.env.OPENAI_API_KEY) {
              const openaiRes = await withTimeout(
                fetch("https://api.openai.com/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                  },
                  body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }]
                  })
                }).then(async r => {
                  if (!r.ok) {
                    const t = await r.text();
                    throw new Error(`OpenAI API Error ${r.status}: ${t}`);
                  }
                  return r.json();
                })
              );
              return openaiRes.choices?.[0]?.message?.content || "No response generated.";
            }
          }
          throw new Error(`Gemini API (${targetModel}) ${response.status}: ${errText}`);
        }
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      } catch (dynamicError) {
        console.warn("⚠️ Dynamic discovery failed:", dynamicError.message);
        throw dynamicError; // Bubble up to the fallback JSON handler
      }
    } catch (e) {
      console.error("❌ All Gemini Models Failed:", e.message);
      // GRACEFUL DEGRADATION - FINAL SAFETY NET
      const safeError = e.message ? e.message.replace(/"/g, "'").replace(/\n/g, " ") : "Unknown Error";
      return JSON.stringify({
        summary: `⚠️ AI Analysis Unavailable. Displaying raw data only.\n\n(Error: ${safeError})`,
        category: "Raw_Data", // Frontend triggers fallback UI on this category
        sentiment: { index: 50, trust: 50, joy: 50, irony: 50 },
        keywords: ["raw", "data", "system_error"]
      });
    }
  }

  // 3. Fallback to OpenAI (if key exists)
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log(`🧠 Using OpenAI (Key length: ${process.env.OPENAI_API_KEY.length})...`);
      const completion = await withTimeout(
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
          })
        }).then(async res => {
          if (!res.ok) {
            const err = await res.text();
            throw new Error(`OpenAI API Error ${res.status}: ${err}`);
          }
          return res.json();
        })
      );
      return completion.choices?.[0]?.message?.content || "No response generated.";
    } catch (e) {
      console.error("❌ OpenAI Failed/Timeout:", e.message);
    }
  }

  console.log("⚠️ ALL AI SERVICES FAILED. ENGAGING SIMULATION MODE.");

  // 4. LAST RESORT: Simulation Mode (Mock Response)
  // This ensures the UX never breaks even if all APIs are dead.
  return JSON.stringify({
    summary: "⚠️ Neural Link Unstable. Simulation Mode Active.\n• Connectivity to main AI clusters lost.\n• Displaying cached neural patterns.\n• Please check backend API keys.",
    category: "System_Simulation",
    sentiment: { index: 50, trust: 50, joy: 50, irony: 50 },
    keywords: ["simulation", "offline", "neural", "link", "cached", "pattern", "system", "override", "fallback", "mode"]
  });
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

  console.log(`📡 [${platform.toUpperCase()}] Extraction initialized: ${url}`);

  try {
    // ATTEMPT 1: Platform-Specific Extraction
    try {
      if (platform === "reddit") {
        // Redefined getComments inline to ensure scope correctness and simplicity
        const clean = url.split("?")[0].split("#")[0].replace(/\/$/, "");
        const redditUrl = clean.endsWith(".json") ? clean : `${clean}/.json?raw_json=1`;

        console.log(`Trying Reddit JSON: ${redditUrl}`);
        const r = await fetchWithTimeout(redditUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36" }
        }, 5000); // 5s timeout for Reddit

        if (!r.ok) throw new Error(`Reddit API ${r.status}`);
        const data = await r.json();
        const comments = data[1]?.data?.children
          ?.slice(0, 50)
          .map(c => c.data.body)
          .filter(Boolean)
          .join("\n") || "";

        if (!comments) throw new Error("No comments found in JSON");
        content = comments;

      } else if (platform === "youtube") {
        const ytR = await fetchWithTimeout(url, { headers: { "User-Agent": "Mozilla/5.0" } }, 5000);
        const ytT = await ytR.text();
        const titleMatch = ytT.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "Encrypted Visual Data";
        content = `[VIDEO INTEL]\nTitle: ${title}\nPlatform: YouTube\n\nNeural reconstruction suggests this video focuses on ${title.toLowerCase()}.`;
      } else {
        throw new Error("Use General Scraper");
      }
    } catch (platformErr) {
      console.warn(`⚠️ Platform extraction failed: ${platformErr.message}`);

      // FALLBACK: General Web Scraper
      try {
        console.log("Engaging General Scraper Fallback...");
        const response = await fetchWithTimeout(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "text/html"
          }
        }, 8000);

        const html = await response.text();
        const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "Unknown Node";
        const desc = html.match(/<meta name="description" content="(.*?)"/i)?.[1] || "";

        // Strip tags for body text
        const body = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 5000);

        content = `[WEB INTEL]\nTitle: ${title}\nDesc: ${desc}\n\nContent: ${body}`;
      } catch (fallbackErr) {
        console.error(`❌ Fallback failed: ${fallbackErr.message}`);
        content = `Signal Lost: Unable to extract data from ${url}. The target may be offline or shielded.`;
      }
    }

    // AI Analysis
    const neuralResponse = await askAI(`
      Analyze this ${platform} content (if 'Signal Lost', invent a plausible tech-themed failure reason):
      "${content.slice(0, 8000)}"

      Perform exactly these 4 tasks and return as JSON:
      1. summary: A 3-bullet point high-impact executive summary.
      2. category: ONE word (Technology, Security, Finance, etc).
      3. sentiment: { "index": 0-100, "trust": 0-100, "joy": 0-100, "irony": 0-100 }
      4. keywords: exactly 10 comma-separated keywords.

      Format: {"summary": "...", "category": "...", "sentiment": {"index": 50, "trust": 30, "joy": 10, "irony": 10}, "keywords": ["a", "b"]}
    `);

    let analysis;
    try {
      const jsonStart = neuralResponse.indexOf("{");
      const jsonEnd = neuralResponse.lastIndexOf("}") + 1;
      analysis = JSON.parse(neuralResponse.slice(jsonStart, jsonEnd));
    } catch (e) {
      analysis = {
        summary: neuralResponse || "Analysis Failed. Neural Core could not process the data stream.",
        category: "System_Error",
        sentiment: { index: 0, trust: 0, joy: 0, irony: 0 },
        keywords: ["error", "timeout", "offline"]
      };
    }

    // Data Normalization (Prevent Frontend Crashes)
    let summaryText = analysis.summary;
    if (Array.isArray(summaryText)) {
      summaryText = summaryText.join("\n\n");
    } else if (typeof summaryText !== 'string') {
      summaryText = String(summaryText || "Analysis Complete.");
    }

    let keywordsArray = analysis.keywords;
    if (typeof keywordsArray === 'string') {
      keywordsArray = keywordsArray.split(',').map(k => k.trim());
    } else if (!Array.isArray(keywordsArray)) {
      keywordsArray = ["Neural", "Data", "Analysis"];
    }

    res.json({
      summary: summaryText,
      content,
      platform,
      category: analysis.category || "General",
      score: (analysis.sentiment && analysis.sentiment.index) || 50,
      breakdown: analysis.sentiment || { index: 50, trust: 50, joy: 50, irony: 50 },
      words: keywordsArray
    });

  } catch (error) {
    console.error("🔥 Critical Summarize Error:", error.message);
    // ALWAYS RETURN JSON to frontend
    res.status(200).json({
      summary: `CRITICAL FAILURE: ${error.message}. The system could not complete the request.`,
      category: "Error",
      score: 0,
      words: ["error", "failure"],
      error: error.message
    });
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
