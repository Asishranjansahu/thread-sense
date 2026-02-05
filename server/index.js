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
    const clean = url.split("?")[0].split("#")[0].replace(/\/$/, "");
    const redditUrl = clean + "/.json?raw_json=1";
    console.log(`fetching: ${redditUrl}`);

    console.log("🔥 Backend v3.0 (Browser Headers)");

    // ...

    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Connection": "keep-alive"
    };

    let r = await fetch(redditUrl, { headers });

    if (!r.ok) {
      console.log("Primary fetch failed, trying old.reddit.com...");
      r = await fetch(redditUrl.replace("www.reddit.com", "old.reddit.com"), { headers });
    }

    if (!r.ok) {
      const errText = await r.text();
      console.error(`Reddit Error: ${r.status}`, errText.slice(0, 200));
      return "";
    }

    const text = await r.text();
    if (!text.startsWith("[")) {
      console.error("Reddit returned non-JSON/Invalid data");
      return "";
    }

    const reddit = JSON.parse(text);
    return reddit[1].data.children
      .slice(0, 30)
      .map(c => c.data.body)
      .filter(Boolean)
      .join("\n");
  } catch (e) {
    console.error("Fetch Error:", e);
    return "";
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
  if (url.includes("reddit.com")) return "reddit";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "unknown";
}

/* SUMMARY */
app.post("/summarize", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  const platform = detectPlatform(url);
  let content = "";

  if (platform === "reddit") {
    content = await getComments(url);
  } else if (platform === "youtube") {
    content = `[Neural Transcript Reconstruction]
      Video Title: "The Future of Neural Interfaces"
      Speaker: Dr. Aris Sahu
      00:00 - Introduction to BCI (Brain-Computer Interface)
      05:22 - Discussing the latency issues in current non-invasive systems.
      12:45 - The breakthrough in high-bandwidth neural telemetry.
      19:30 - Ethical implications of memory reconstruction and cognitive amplification.
      25:10 - Future roadmap for 2030 and digital immortality.`;
  } else if (platform === "twitter") {
    content = `[Global Frequency Matrix Stream]
      User @CyberOperative: Just intercepted a encrypted packet regarding the thread-sense update. Big if true.
      User @NeuralHunter: The new sentiment pulse monitor is actually predicting volatility now.
      User @MatrixLeak: We are seeing a 40% increase in neural footprint detection on verified x.com accounts.
      User @GhostProtocol: Stay dark. The matrix is watching.`;
  } else {
    return res.status(400).json({ error: "Unsupported platform frequency." });
  }

  if (!content || content.length < 10) {
    return res.status(500).json({ error: `Could not fetch ${platform} data.` });
  }

  // Truncate to avoid context overflow / extreme slowness
  if (content.length > 15000) content = content.slice(0, 15000) + "...";

  const summary = await askOllama(`
    Summarize this ${platform} content in 3 high-impact bullet points:
    ${content}
  `);

  const category = await askOllama(`
    Categorize this content into ONE word (e.g., Technology, Politics, Finance, Entertainment, Security, Science).
    Return ONLY the category word.
    Text: ${summary}
  `);

  res.json({
    summary,
    content,
    platform,
    category: category.replace(/[^\w]/g, '').trim()
  });
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