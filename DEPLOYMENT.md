# 🚀 Deployment Guide: ThreadSense

This guide covers two methods to deploy the ThreadSense platform:
1.  **The "All-in-One" Docker Stack** (Recommended for full functionality with AI)
2.  **Cloud Split Deployment** (Vercel + Render/Railway)

---

## 🏗 Option 1: The "All-in-One" Docker Stack (Recommended)
This method runs the Frontend, Backend, Database, and AI (Ollama) on a single server (VPS) or your local machine.

### Prerequisites
*   A machine with Docker and Docker Compose installed.
*   **Recommended Specs**: 8GB+ RAM, 4 CPU Cores (AVX support required for AI). GPU preferred but not required.

### Step 1: Clone & Configure
Transer your code to the server and navigate to the directory:
```bash
git clone <your-repo-url>
cd thread-sense
```

### Step 2: Launch the Stack
We have prepared a `docker-compose.yml` that orchestrates the entire neural network.
Run the initialization command:

```bash
docker-compose up -d --build
```
*   `--build`: Forces a rebuild of the application container.
*   `-d`: Runs in detached mode (background).

### Step 3: Initialize AI Models
Once the stack is running, you need to pull the AI model into the Ollama container:

```bash
# Enter the Ollama container
docker exec -it threadsense-ollama-1 ollama pull phi3
```
*(Note: Replace `phi3` with any model you prefer, e.g., `llama3`, `mistral`).*

### Step 4: Access the Terminal
Your application is now live at:
> **http://<your-server-ip>:5050**

---

## ☁️ Option 2: Cloud Split Deployment
This separates the frontend (CDN) and backend (Serverless/Node).
**⚠️ Warning**: You must solve the AI hosting. Render/Vercel standard tiers **cannot run Ollama**. You will need to switch the backend to use an external API (OpenAI/Anthropic) or host Ollama separately on a GPU cloud.

### Part A: Database (MongoDB Atlas)
1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Create a new Cluster (Shared/Free).
3.  Go to **Database Access** -> Add New Database User (save username/password).
4.  Go to **Network Access** -> Allow Access from Anywhere (`0.0.0.0/0`).
5.  Get Connection String: `Connect` -> `Drivers` -> Copy string (replace `<password>`).

### Part B: Backend (Render/Railway)
1.  Push your code to **GitHub**.
2.  Sign up for [Render.com](https://render.com).
3.  Create **New Web Service**.
4.  Connect GitHub repo.
5.  **Settings**:
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server/index.js`
    *   **Environment Variables**:
        *   `MONGO_URI`: (Paste your Atlas connection string)
        *   `JWT_SECRET`: (Generate a random string)
        *   `NODE_ENV`: `production`
        *   `OPENAI_API_KEY`: (Optional) Add this to enable AI on Render without a GPU.

### Part C: Frontend (Vercel)
1.  Sign up for [Vercel](https://vercel.com).
2.  **Add New Project** -> Import from GitHub.
3.  **Build Settings** (Auto-detected usually):
    *   Framework: Vite
    *   Build Command: `vite build`
    *   Output Directory: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL`: (Your Render backend URL, e.g., `https://thread-sense-api.onrender.com`)
    *   *Note: You may need to update your frontend code to use this env var instead of valid localhost.*

---

## 🔧 Post-Deployment Configuration

### 1. Stripe Webhooks
If using payments, update your Stripe Dashboard webhook URL to:
`https://<your-domain>/api/stripe/webhook`

### 2. Social Auth
If you add Google/Twitter login, update the callback URLs in those developer consoles to match your production domain.

### 3. Custom Domain
Map your custom domain (e.g., `threadsense.ai`) in your Vercel/Render settings to look professional.
