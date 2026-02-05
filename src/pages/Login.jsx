import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock, ArrowRight, Loader, Phone, Mail, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { API } from "../config";

export default function Login() {
    const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const body = loginMethod === "email"
                ? { email: identifier, password }
                : { phone: identifier, password };

            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Server Error: " + text.substring(0, 100));
            }

            if (!res.ok) throw new Error(data.error || "Login failed");

            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-black overflow-hidden relative font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Left Side: Neural Brand Visuals */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative p-12 border-r border-white/5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center"
                >
                    <div className="relative inline-block mb-12">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse"></div>
                        <div className="relative w-64 h-64 rounded-[2rem] border border-white/10 shadow-2xl bg-zinc-900 flex items-center justify-center overflow-hidden">
                            <img
                                src="/logo.png"
                                alt="TS"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<span class="text-cyan-500 text-6xl font-black">TS</span>';
                                }}
                            />
                        </div>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-white mb-4">
                        SEE THE <span className="text-cyan-500">UNSEEN</span>.
                    </h2>
                    <p className="text-zinc-500 text-lg font-light tracking-wide max-w-md mx-auto">
                        Connect with the global neural network and decode the web's deepest signals.
                    </p>

                    {/* Neural Lines Decor */}
                    <div className="absolute bottom-10 left-10 flex gap-2 opacity-20">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1 h-32 bg-gradient-to-t from-cyan-500 to-transparent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Authentication Terminal */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-sm"
                >
                    {/* Brand Identity */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">
                            THREAD<span className="text-cyan-500">SENSE</span>
                        </h1>
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold opacity-60">Authorize Operative</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Method Switcher */}
                            <div className="flex bg-white/[0.03] p-1 rounded-2xl mb-6 border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod("email")}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'email' ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod("phone")}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === 'phone' ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Phone
                                </button>
                            </div>

                            <div className="space-y-1">
                                <div className="relative group">
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'tel'}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                                        placeholder={loginMethod === 'email' ? "Agent ID / Email" : "Neural Terminal Phone"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <input
                                    type="password"
                                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                                    placeholder="Security Key"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? <Loader className="animate-spin w-4 h-4" /> : "Initiate Connection"}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>

                            <div className="text-center pt-2">
                                <Link to="/forgot-password">
                                    <button type="button" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 hover:text-cyan-400 transition-colors">Forgot Security Key?</button>
                                </Link>
                            </div>
                        </form>

                        <div className="relative my-6 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <span className="relative px-4 bg-[#0a0a0a] text-[10px] uppercase tracking-[0.4em] text-zinc-700 font-bold">OR</span>
                        </div>

                        {/* Google Auth Integrated */}
                        <div className="flex flex-col items-center gap-4">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setLoading(true);
                                    try {
                                        const res = await fetch(`${API}/api/auth/google`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ idToken: credentialResponse.credential })
                                        });
                                        const data = await res.json();
                                        if (!res.ok) throw new Error(data.error);
                                        login(data.user, data.token);
                                        navigate("/");
                                    } catch (err) {
                                        setError(err.message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                onError={() => setError("Google Auth Failed")}
                                theme="filled_black"
                                shape="pill"
                                text="continue_with"
                                useOneTap
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-[10px] text-center mt-4 font-bold tracking-widest uppercase">{error}</p>
                        )}
                    </div>

                    <div className="mt-8 text-center bg-white/[0.02] border border-white/5 py-8 rounded-[2rem] backdrop-blur-lg">
                        <p className="text-zinc-500 text-xs font-medium tracking-wide">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-cyan-400 hover:text-white font-black transition-all ml-1 uppercase tracking-widest">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Android App Download */}
                    <a
                        href="#" // REPLACE WITH YOUR APK LINK (e.g., Google Drive link)
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 py-4 px-6 rounded-2xl backdrop-blur-lg hover:border-emerald-500/50 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Download size={16} />
                                </div>
                                <div className="text-left">
                                    <p className="text-emerald-400 text-[10px] uppercase font-black tracking-widest leading-tight">Android System</p>
                                    <p className="text-zinc-500 text-[9px] font-medium tracking-wide">Download Native APK</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-500/50 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </a>

                    <footer className="mt-8 text-center opacity-20 pointer-events-none">
                        <p className="text-[9px] uppercase tracking-[0.6em] text-white">© 2026 Thread Sense Intelligence</p>
                    </footer>
                </motion.div>
            </div >
        </div >
    );
}
