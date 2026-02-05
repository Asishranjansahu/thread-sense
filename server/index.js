import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import threadRoutes from "./routes/threads.js";
import notificationRoutes from "./routes/notifications.js";
import botRoutes from "./routes/bot.js";
import stripeRoutes from "./routes/stripe.js";
import adminRoutes from "./routes/admin.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/threadsense")
  .then(() => console.log("🔥 MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/admin", adminRoutes);

// Serve static assets in production
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    // Exclude API routes from this catch-all
    if (!req.path.startsWith("/api") && !req.path.startsWith("/summarize") && !req.path.startsWith("/sentiment") && !req.path.startsWith("/keywords") && !req.path.startsWith("/compare") && !req.path.startsWith("/chat")) {
      res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
    }
  });
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
async function askAI(prompt) {
  // 1. Try OpenAI if Key Exists (Cloud Deployment)
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("☁️ Using OpenAI (Cloud Mode)...");
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Cost-effective & fast
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      const data = await r.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error("OpenAI response missing choices.");
      }
    } catch (e) {
      console.error("OpenAI Failed, falling back to local...", e.message);
    }
  }

  // 2. Fallback to Local Ollama (Local Development)
  try {
    console.log("🤖 Using Ollama (Local Mode)...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const r = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3",
        prompt,
        stream: false,
        options: { num_ctx: 4096 }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!r.ok) throw new Error("Ollama API returned " + r.status);

    const data = await r.json();
    return data.response;
  } catch (e) {
    console.error("❌ AI Engine Failed:", e.message);
    return "AI Unavailable. Ensure OPENAI_API_KEY is set or Ollama is running.";
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
  return "unknown";
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
        const ytR = await fetch(url, { headers: { "User-Agent": "Bot" } });
        const ytT = await ytR.text();
        const titleMatch = ytT.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(" - YouTube", "") : "Encrypted Visual Data";
        content = `[VIDEO INTEL]\nTitle: ${title}\nPlatform: YouTube\n\nNeural reconstruction suggests this video focuses on ${title.toLowerCase()}.`;
      } catch (e) {
        content = `Visual data stream intercepted: ${url}`;
      }
    } else if (platform === "twitter") {
      content = `[X.COM PROTOCOL]\nSource: ${url}\nNeural footprint suggests a high-frequency micro-data stream.`;
    } else {
      return res.status(400).json({ error: "Unsupported platform frequency." });
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
      3. sentiment: A single number score 0-100.
      4. keywords: exactly 10 comma-separated keywords.

      Format: {"summary": "...", "category": "...", "sentiment": 50, "keywords": ["a", "b", ...]}
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
        sentiment: 50,
        keywords: ["data", "stream", "extraction"]
      };
    }

    res.json({
      summary: analysis.summary,
      content,
      platform,
      category: analysis.category,
      score: analysis.sentiment,
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

Text:
${req.body.text}
`);

  // Handle error case
  if (result.startsWith("⚠️")) {
    return res.json({ score: 0, error: result });
  }

  // Extract the first number found in the response for robustness
  const match = result.match(/\d+/);
  const score = match ? parseInt(match[0], 10) : 50;

  res.json({ score: Math.min(100, Math.max(0, score)) });
});

/* KEYWORDS */
app.post("/keywords", async (req, res) => {
  const words = await askOllama(`
Extract 10 main topics/keywords from the text below.
Return them as a strictly comma-separated list.
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
    3. Sentiment Pulse (Public Perception)
    4. Potential Influence Index
    
    Structure this as a professional intelligence briefing for a high-end cyberpunk operative terminal.
  `);

  res.json({ report });
});

app.listen(5050, () =>
  console.log("🚀 Backend → http://localhost:5050")
);