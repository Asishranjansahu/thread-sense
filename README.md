# ThreadSense Neural Interface 🚀

**ThreadSense** is an enterprise-grade Reddit intelligence platform built with a high-end **Neon Cyberpunk UI**. It leverages advanced AI (Ollama/Phi-3) to extract summaries, sentiment analysis, and keyword clouds from complex Reddit discussions in real-time.

![Neural Dashboard](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80)

## ✨ Core & Expansion Features

-   **Multi-Platform Extraction**: Real-time AI summarization of **Reddit**, **YouTube**, and **Twitter/X**.
-   **Neural Voice Protocol**: High-impact Text-to-Speech synthesis for your intelligence reports.
-   **AI Auto-Tagging**: Neural classification of reports into categories (Technology, Security, etc.).
-   **Atmosphere Index**: Advanced sentiment analysis with live pulse monitor.
-   **Neural Memory**: ChatGPT-like conversational persistence. Resume any past analysis.
-   **Desktop Terminal (Electron)**: Native desktop application version for specialized operatives.
-   **Discord Bot Intel**: Summarize frequencies directly from your Discord server.
-   **Chrome Extension**: One-click analysis directly from Reddit.
-   **Mobile App**: React Native bridge for intelligence on the go.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Chart.js.
-   **Backend**: Node.js, Express, Mongoose (MongoDB).
-   **AI Engine**: Ollama (Phi-3 / Llama-3).
-   **Mobile**: React Native.
-   **Payments**: Stripe API.
-   **Notifications**: Web Push (VAPID).

## 📂 Project Structure

```text
thread-sense/
├── server/             # Express.js Backend
│   ├── models/         # MongoDB Schemas (Thread, User, Subscription)
│   ├── routes/         # API Endpoints (Auth, Threads, Admin, Stripe, Bot)
│   ├── middleware/     # Auth & Role-based Access Control
│   └── index.js        # Main entry point (Port 5050)
├── src/                # React Frontend
│   ├── components/     # UI Building Blocks (TypingText, protected routes)
│   ├── pages/          # Full Page Views (Dashboard, Admin, Pricing, History)
│   ├── context/        # Auth & State Management
│   └── index.css       # Core Neon Design System
├── extension/          # Chrome Extension (V3)
│   ├── manifest.json   # Extension Config
│   └── content.js      # Reddit Injection Logic
└── mobile/             # React Native Mobile Application
    └── App.js          # Mobile UI & API Bridge
```

## 🚀 Rapid Deployment

### 1. Prerequisites
-   [Ollama](https://ollama.com/) installed and running locally.
-   [MongoDB](https://www.mongodb.com/) instance.

### 2. Backend Setup
```bash
cd server
npm install
# Create .env with:
# MONGO_URI=...
# JWT_SECRET=...
# STRIPE_SECRET_KEY=...
# VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
node index.js
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

### 4. Chrome Extension
-   Open `chrome://extensions`.
-   Enable **Developer Mode**.
-   Click **Load Unpacked** and select the `extension` folder.

## 💳 Stripe Setup Walkthrough

1.  **Get API Keys**: Create a Stripe account and copy your `Secret Key` and `Publishable Key` from the [Dashboard](https://dashboard.stripe.com/test/apikeys).
2.  **Server Config**: Add your `STRIPE_SECRET_KEY` to `server/.env`.
3.  **Local Redirects**: The current implementation points to `http://localhost:5173/success` and `/cancel`. Ensure these match your frontend routes.
4.  **Webhook (Optional)**: In production, set up a webhook listener to handle `checkout.session.completed` for automated account upgrades.

## 📜 License
Internal Clearance Only. Unauthorized distribution of ThreadSense tech is strictly prohibited.

---
*Maintained by the Neural Intelligence Agency.*
