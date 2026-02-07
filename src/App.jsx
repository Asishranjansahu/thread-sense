import { useState, useEffect, useContext } from "react";
import { HashRouter, Routes, Route, Navigate, Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from '@capacitor/app';
import jsPDF from "jspdf";
import { Doughnut, Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import "chart.js/auto";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import InstallGuide from "./pages/InstallGuide";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Organization from "./pages/Organization";
import Admin from "./pages/Admin";
import Pricing from "./pages/Pricing";
import Welcome from "./pages/Welcome";
import TargetSearch from "./pages/TargetSearch";
import { PaymentSuccess, PaymentCancel } from "./pages/PaymentStatus";
import { Youtube, Twitter, MessageSquare, Shield, Zap, Target, Search, Clock, ExternalLink, Users, LayoutDashboard, CreditCard, LogOut, Bell, Menu, ChevronLeft, ChevronRight, Instagram, Facebook, Globe, Loader2 } from "lucide-react";
import { API } from "./config";
import SplashLoader from "./components/SplashLoader";
import ThreadSenseLogo3D from "./components/ThreadSenseLogo3D";

// --- CONSTANTS ---
const MENU_ITEMS = [
  { name: "Terminal", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, color: "text-cyan-400" },
  { name: "Operatives", path: "/target-search", icon: <Target className="w-5 h-5" />, color: "text-red-500" },
  { name: "Archives", path: "/history", icon: <Clock className="w-5 h-5" />, color: "text-purple-400" },
  { name: "Team", path: "/organization", icon: <Users className="w-5 h-5" />, color: "text-zinc-400" },
  { name: "Upgrade", path: "/pricing", icon: <CreditCard className="w-5 h-5" />, color: "text-yellow-500" },
];

// --- SIDEBAR COMPONENT ---
function Sidebar({ isCollapsed, toggleSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="hidden md:flex fixed left-0 top-0 h-screen bg-black/50 backdrop-blur-3xl border-r border-white/5 flex-col items-center py-10 z-50 overflow-hidden"
    >
      <div className="w-full px-4 mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <div className="w-14 h-14 flex items-center justify-center -ml-2">
                <ThreadSenseLogo3D />
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">THREAD SENSE</span>
            </>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-xl border border-white/5 hover:bg-white/5 hover:border-cyan-500/30 text-zinc-500 hover:text-cyan-400 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 w-full px-4 space-y-4">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all group hover:bg-white/5 ${location.pathname === item.path ? 'bg-white/5 border border-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)]' : 'border border-transparent'
              } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className={`transition-all group-hover:scale-110 shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500 group-hover:text-white transition-colors truncate">
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="w-full px-4 mt-auto">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform shrink-0" />
          {!isCollapsed && (
            <span className="text-[10px] uppercase tracking-widest font-black">Terminate</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}

// --- MOBILE COMPONENTS ---
function MobileTopBar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-auto min-h-16 pt-[env(safe-area-inset-top)] bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-4 pb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <ThreadSenseLogo3D />
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">THREAD SENSE</span>
      </div>
      <button
        onClick={logout}
        className="p-2 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}

function MobileNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#030303]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === item.path
              ? 'text-white scale-110'
              : 'text-zinc-600 hover:text-zinc-400'
              }`}
          >
            <div className={`${location.pathname === item.path ? item.color : 'currentColor'}`}>
              {item.icon}
            </div>
            {location.pathname === item.path && (
              <span className="w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_#00f3ff]"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// --- LAYOUT COMPONENT ---
function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      <MobileTopBar />

      <div
        className="flex-1 relative transition-[padding] duration-300 ease-in-out md:pl-[var(--sidebar-width)] pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0"
        style={{
          '--sidebar-width': isCollapsed ? '80px' : '256px',
        }}
      >
        <div className="hidden md:block absolute left-0 top-0 bottom-0 transition-all duration-300 w-[var(--sidebar-width)] pointer-events-none" />

        <div className="scanline opacity-10 pointer-events-none fixed inset-0 z-0"></div>
        <AnimatePresence>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="w-full relative z-10"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      <MobileNav />
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-cyan-500 font-mono animate-pulse">INITIATING SECURE SESSION...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// --- TYPING EFFECT COMPONENT ---
function TypingText({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Simulate variable typing speed like ChatGPT
      const randomDelay = speed + Math.random() * (speed * 2);
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, randomDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="relative inline">
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-2.5 h-6 ml-1 bg-cyan-400 animate-pulse align-middle shadow-[0_0_10px_#00f3ff]"></span>
      )}
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
function Dashboard() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [chat, setChat] = useState("");
  const [score, setScore] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [platform, setPlatform] = useState("reddit");
  const [category, setCategory] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState({ name: "English", code: "en-IN", native: "English" });
  const [isTranslating, setIsTranslating] = useState(false);
  const [breakdown, setBreakdown] = useState({ trust: 0, joy: 0, irony: 0 });

  const IndianLanguages = [
    { name: "English", code: "en-IN", native: "English" },
    { name: "Hindi", code: "hi-IN", native: "हिन्दी" },
    { name: "Bengali", code: "bn-IN", native: "বাংলা" },
    { name: "Telugu", code: "te-IN", native: "తెలుగు" },
    { name: "Marathi", code: "mr-IN", native: "मराठी" },
    { name: "Tamil", code: "ta-IN", native: "தமிழ்" },
    { name: "Gujarati", code: "gu-IN", native: "ગુજરાતી" },
    { name: "Kannada", code: "kn-IN", native: "ಕನ್ನಡ" },
    { name: "Malayalam", code: "ml-IN", native: "മലയാളം" },
    { name: "Punjabi", code: "pa-IN", native: "ਪੰਜਾਬੀ" }
  ];

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      fetch(API + "/api/threads/trends", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => setSentimentHistory(data))
        .catch(e => console.error("Trends error:", e));
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const threadId = params.get("threadId");
    if (threadId && user) {
      const token = localStorage.getItem("token");
      fetch(API + `/api/threads/${threadId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.error) return;
          setUrl(data.url);
          setSummary(data.summary);
          setScore(data.score);
          setKeywords(data.keywords);
          setChatHistory(data.chatHistory || []);
          setCurrentThreadId(data._id);
          // Clear param without reload
          window.history.replaceState({}, '', '/');
        })
        .catch(e => console.error("Load error:", e));
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "ANALYZE_URL" && event.data.url) {
        setUrl(event.data.url);
        summarize(event.data.url);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const speak = (text, langCode = "en-IN") => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;

      // Try to find a voice for the language
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const translateAndSpeak = async () => {
    if (selectedLang.code === "en-IN") {
      speak(summary, "en-IN");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch(API + "/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary, targetLang: selectedLang.name })
      });
      const data = await res.json();
      if (data.translatedText) {
        speak(data.translatedText, selectedLang.code);
      } else {
        throw new Error("Translation failed");
      }
    } catch (err) {
      console.error("Translation fail:", err);
      speak(summary, "en-IN"); // Fallback
    } finally {
      setIsTranslating(false);
    }
  };

  async function requestNotification() {
    if ("serviceWorker" in navigator && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BIsLzR1I-M5W7_X-9H2y1G..." // Use actual VAPID public key here
        });

        const token = localStorage.getItem("token");
        await fetch(API + "/api/notifications/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ subscription })
        });

        new Notification("ThreadSense Active", {
          body: "Push transmissions successfully established.",
          icon: "/pwa-192.png"
        });
      } catch (err) {
        console.error("Subscription failed:", err);
        // Fallback for demo
        new Notification("ThreadSense Demo", { body: "Notifications enabled (Simulation)" });
      }
    }
  }

  async function summarize(overrideUrl) {
    const targetUrl = overrideUrl || url;
    if (!targetUrl) return;

    setLoading(true);
    setSummary("");
    setChatHistory([]);
    setKeywords([]);
    setScore(0);
    setErrorMSG("");
    setCurrentThreadId(null);

    // TIMEOUT WRAPPER FOR FRONTEND FETCH (60s)
    const fetchWithTimeout = (url, options, timeout = 60000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection to Neural Core timed out (Backend Unresponsive).")), timeout))
      ]);
    };

    try {
      const res = await fetchWithTimeout(API + "/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl })
      });

      const text = await res.text();
      let r;
      try {
        r = JSON.parse(text);
      } catch (e) {
        console.error("Backend returned non-JSON:", text.slice(0, 500));
        throw new Error("Neural Core Malfunction: Invalid Response Format. (Backend may have crashed)");
      }

      if (!res.ok) throw new Error(r.error || "Failed to fetch summary");

      setSummary(r.summary);
      setPlatform(r.platform);
      setCategory(r.category);
      setScore(r.score);
      setBreakdown(r.breakdown || { trust: 0, joy: 0, irony: 0 });
      setKeywords(r.words);
      setSentimentHistory(prev => [...prev.slice(-9), r.score]);
      setUrl("");

      if (user) {
        const token = localStorage.getItem("token");
        const saveRes = await fetch(API + "/api/threads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            url: targetUrl,
            summary: r.summary,
            score: r.score,
            keywords: r.words,
            platform: r.platform,
            category: r.category
          })
        });
        const saved = await saveRes.json();
        setCurrentThreadId(saved._id);
      }
    } catch (e) {
      console.error("Summarize Error:", e);
      setErrorMSG(e.message);
    }
    setLoading(false);
  }

  async function ask() {
    if (!chat) return;
    const userMsg = chat;
    setChat("");
    const updatedHistory = [...chatHistory, { role: 'user', content: userMsg }];
    setChatHistory(updatedHistory);

    try {
      const res = await fetch(API + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: summary,
          question: userMsg,
          history: updatedHistory
        })
      });
      const data = await res.json();
      const finalHistory = [...updatedHistory, { role: 'assistant', content: data.answer }];
      setChatHistory(finalHistory);

      // Persist to DB if thread exists
      if (currentThreadId) {
        const token = localStorage.getItem("token");
        fetch(API + `/api/threads/${currentThreadId}/chat`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ chatHistory: finalHistory })
        });
      }
    } catch (err) {
      setErrorMSG("AI connection lost.");
    }
  }

  async function postToReddit() {
    if (!currentThreadId || !summary) return;
    const threadId = url.match(/comments\/([a-z0-9]+)/)?.[1];
    if (!threadId) return setErrorMSG("Could not extract Reddit Thread ID");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API + "/api/bot/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ threadId, summary })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Successfully posted to Reddit!");
    } catch (err) {
      setErrorMSG("Reddit Bot: " + err.message);
    }
  }

  return (
    <div className="min-h-screen py-6 md:py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-12 relative z-10 overflow-hidden">

      <header className="flex flex-col items-center justify-center space-y-8 text-center relative pt-12">
        <div className="flex items-center gap-6 absolute top-0 right-0">
          <button onClick={requestNotification} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all group">
            <Bell className="w-5 h-5 group-hover:animate-bounce" />
          </button>
        </div>

        <div className="relative">
          <h1 className="h1-glow relative z-10 uppercase tracking-tighter">THREAD<span className="text-cyan-500">SENSE</span></h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm w-32"></div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="glass-panel p-2 neon-border-cyan group">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="cyber-input border-none bg-transparent flex-1 text-xl py-6"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && summarize()}
              placeholder="Inject Source frequency (Reddit / YouTube / X)..."
            />
            <button
              onClick={() => summarize()}
              disabled={loading}
              className="btn-primary min-w-[180px]"
            >
              <span>{loading ? "SCANNING..." : "EXTRACT"}</span>
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <MessageSquare className="w-3 h-3" /> Reddit
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <Youtube className="w-3 h-3" /> YouTube
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <Twitter className="w-3 h-3" /> X
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <Instagram className="w-3 h-3" /> Instagram
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <Facebook className="w-3 h-3" /> Facebook
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
            <Globe className="w-3 h-3" /> Any Website
          </div>
        </div>
      </section>

      {errorMSG && (
        <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] font-mono flex items-center gap-4 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
          CORE_CRITICAL: {errorMSG}
        </div>
      )}

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-8 space-y-10">
              <div className="glass-panel p-6 md:p-10 min-h-[600px] border-white/5">
                <div className="flex justify-between items-start mb-12 pb-8 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${platform === 'youtube' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      platform === 'twitter' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                        platform === 'instagram' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' :
                          platform === 'facebook' ? 'bg-blue-600/10 border-blue-600/20 text-blue-600' :
                            platform === 'web' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                              'bg-orange-500/10 border-orange-500/20 text-orange-500'
                      }`}>
                      {platform === 'youtube' && <Youtube className="w-8 h-8" />}
                      {platform === 'twitter' && <Twitter className="w-8 h-8" />}
                      {platform === 'reddit' && <MessageSquare className="w-8 h-8" />}
                      {platform === 'instagram' && <Instagram className="w-8 h-8" />}
                      {platform === 'facebook' && <Facebook className="w-8 h-8" />}
                      {platform === 'web' && <Globe className="w-8 h-8" />}
                    </div>
                    <div>
                      <span className="label-tech text-cyan-400">Memory Matrix / {category || "Scanning..."}</span>
                      <h2 className="text-4xl font-black tracking-tighter uppercase">{platform} FEED</h2>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLang.code}
                        onChange={(e) => setSelectedLang(IndianLanguages.find(l => l.code === e.target.value))}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-cyan-400 outline-none hover:border-cyan-500/50 transition-all cursor-pointer"
                      >
                        {IndianLanguages.map(lang => (
                          <option key={lang.code} value={lang.code} className="bg-zinc-900">{lang.native} ({lang.name})</option>
                        ))}
                      </select>
                      <button
                        onClick={translateAndSpeak}
                        disabled={isTranslating}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${isSpeaking ? 'bg-cyan-500 text-black border-cyan-400 animate-pulse' : 'bg-white/5 border-white/10 hover:border-cyan-500/50 text-cyan-400'} ${isTranslating ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {isTranslating ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        )}
                      </button>
                    </div>
                    <button onClick={postToReddit} className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 tracking-widest uppercase hover:bg-red-500/20 transition-all">
                      Post to Reddit
                    </button>
                    <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                      Verified
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-zinc-300 leading-loose text-xl font-light italic">
                  <TypingText text={summary} />
                </div>

                <div className="mt-20 pt-12 border-t border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <span className="label-tech text-purple-400">Neural Connectives</span>
                    <span className="text-[10px] text-zinc-600 font-mono italic uppercase tracking-widest">Semantic Frequency Index</span>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center justify-start mt-6 min-h-[150px]">
                    <AnimatePresence>
                      {keywords.map((k, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          transition={{
                            delay: i * 0.08,
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                          }}
                          whileHover={{
                            scale: 1.15,
                            color: "#00f3ff",
                            textShadow: "0 0 15px rgba(0, 243, 255, 0.5)"
                          }}
                          className={`px-5 py-2 glass-panel border-cyan-500/10 cursor-pointer transition-colors group relative ${i % 3 === 0 ? 'text-lg font-black py-3' : i % 2 === 0 ? 'text-sm font-bold' : 'text-xs font-medium'
                            }`}
                        >
                          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]"></div>
                          <span className="relative z-10 flex items-center gap-2">
                            <span className="text-cyan-500/30 font-mono">#</span>
                            {k.toUpperCase()}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 space-y-10">
              {/* SENTIMENT TREND CHART */}
              <div className="glass-panel p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="label-tech text-cyan-400">Pulse Monitor</span>
                  <span className="text-[10px] text-zinc-500 font-mono">LIVE</span>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-4">
                  {[
                    { label: "Trust", value: breakdown.trust, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Joy", value: breakdown.joy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    { label: "Irony", value: breakdown.irony, color: "text-purple-400", bg: "bg-purple-500/10" }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-[9px] uppercase font-black tracking-widest mb-2">
                          <span className="text-zinc-500">{stat.label}</span>
                          <span className={stat.color}>{stat.value}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            className={`h-full ${stat.color.replace('text', 'bg')}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 md:p-10 flex flex-col items-center text-center">
                <span className="label-tech text-purple-400">Atmosphere Score</span>
                <div className="relative w-48 h-48 mt-8 group">
                  <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/20 transition-all"></div>
                  <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="4" />
                    <circle
                      cx="50" cy="50" r="44" fill="none" stroke="url(#neon-grad)" strokeWidth="6"
                      strokeDasharray="276.32" strokeDashoffset={276.32 * (1 - score / 100)}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f3ff" />
                        <stop offset="100%" stopColor="#bc13fe" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <motion.span
                      key={score}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                      {score}
                    </motion.span>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-1">INDEX</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 md:p-8 flex flex-col h-[600px] border-cyan-500/5">
                <div className="flex justify-between items-center mb-8">
                  <span className="label-tech text-green-400">Neural Query</span>
                  <button onClick={() => setChatHistory([])} className="p-2 hover:bg-white/5 rounded-lg transition-all">
                    <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto mb-8 space-y-6 pr-2 scrollbar-thin">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`group animate-fade-in ${msg.role === 'user' ? 'pl-8' : 'pr-8'}`}>
                      <div className={`p-5 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-white/[0.03] border border-white/10 ml-auto' : 'bg-cyan-500/[0.03] border border-cyan-500/10'}`}>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-2 opacity-40">{msg.role}</div>
                        <div className="text-white leading-relaxed font-light">
                          {msg.role === 'assistant' && i === chatHistory.length - 1 ? <TypingText text={msg.content} speed={5} /> : msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
                  <input
                    className="cyber-input relative z-10 pr-14 py-5"
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    placeholder="Query frequency..."
                    onKeyDown={(e) => e.key === 'Enter' && ask()}
                  />
                  <button onClick={ask} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-cyan-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



// --- BACK BUTTON HANDLER ---
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async () => {
      // Define routes where back button should exit the app
      const exitRoutes = ['/', '/login', '/signup', '/welcome', '/dashboard'];

      // If we are on an exit route, close the app
      if (exitRoutes.includes(location.pathname)) {
        CapacitorApp.exitApp();
      } else {
        // Otherwise go back in history
        navigate(-1);
      }
    };

    // Add listner
    const listener = CapacitorApp.addListener('backButton', handleBackButton);

    // Cleanup listener on component unmount or location change
    return () => {
      listener.then(handler => handler.remove());
    };
  }, [navigate, location]);

  return null;
}

// --- MAIN APP COMPONENT ---
function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Or a loading spinner

  return (
    <HashRouter>
      <BackButtonHandler />
      <Routes>
        {/* Public Root: Welcome Page if not logged in, otherwise redirect to Dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />

        {/* Core Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/install-guide" element={<InstallGuide />} />

        {/* Sidebar Layout Wrapper */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/organization" element={<ProtectedRoute><Organization /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/target-search" element={<ProtectedRoute><TargetSearch /></ProtectedRoute>} />
        </Route>
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/cancel" element={<PaymentCancel />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashLoader key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <App />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthProvider>
  );
}