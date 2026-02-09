import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock, ArrowRight, Loader, Phone, Mail, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { API } from "../config";
import ThreadSenseLogo3D from "../components/ThreadSenseLogo3D";

export default function Login() {
    const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, loginAsGuest } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate("/");
    };

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
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <ThreadSenseLogo3D />
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
            <div className="flex-1 flex items-center justify-center p-[env(safe-area-inset-top)] sm:p-12 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-sm px-6"
                >
                    {/* Brand Identity */}
                    <div className="text-center mb-6 mt-4 sm:mt-0">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase mb-2">
                            THREAD<span className="text-cyan-500">SENSE</span>
                        </h1>
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold opacity-60">Authorize Operative</p>
                    </div>

                    <div className="bg-transparent sm:bg-white/[0.02] border-0 sm:border sm:border-white/5 p-0 sm:p-6 sm:rounded-2xl sm:backdrop-blur-2xl sm:shadow-xl relative overflow-hidden">
                        <div className="hidden sm:block absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        type={loginMethod === 'email' ? 'email' : 'tel'}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-base font-medium"
                                        placeholder={loginMethod === 'email' ? "Agent ID / Email" : "Neural Terminal Phone"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-base font-medium"
                                        placeholder="Security Key"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-2xl bg-cyan-500 text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? <Loader className="animate-spin w-4 h-4" /> : "Initiate Connection"}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>

                            <div className="hidden sm:block text-center pt-2">
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
                        <div className="flex flex-col items-center gap-4 min-h-[40px] justify-center mb-4">
                            {loading ? (
                                <div className="flex items-center gap-3 text-cyan-400 animate-pulse bg-white/5 px-6 py-3 rounded-full border border-cyan-500/30">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Syncing Neural Identity...
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            setLoading(true);
                                            try {
                                                const res = await fetch(`${API}/api/auth/google`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ idToken: credentialResponse.credential })
                                                });
                                                
                                                const text = await res.text();
                                                let data;
                                                try {
                                                    data = JSON.parse(text);
                                                } catch (e) {
                                                    console.error("Non-JSON response:", text);
                                                    throw new Error("Server connection error (received HTML instead of JSON). The API might be sleeping or the URL is incorrect.");
                                                }

                                                if (!res.ok) throw new Error(data.error || "Login failed");
                                                login(data.user, data.token);
                                                navigate("/");
                                            } catch (err) {
                                                setError(err.message);
                                                setLoading(false);
                                            }
                                        }}
                                        onError={() => {
                                            const origin = typeof window !== "undefined" ? window.location.origin : "";
                                            const msg = `Google blocked sign-in. Ensure origin "${origin}" is authorized in Google OAuth and use HTTPS production.`;
                                            console.error(msg);
                                            setError("Google Sign-in Blocked: Origin mismatch.");
                                        }}
                                        theme="filled_black"
                                        shape="pill"
                                        size="large"
                                        width="240"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Guest / Demo Button - ALWAYS VISIBLE */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleGuestLogin}
                                className="w-full max-w-[240px] py-3 rounded-2xl border border-white/10 text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <User className="w-3 h-3" />
                                Continue as Guest
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-[10px] text-center mt-4 font-bold tracking-widest uppercase">{error}</p>
                        )}
                    </div>

                    <div className="mt-8 text-center bg-transparent sm:bg-white/[0.02] border-0 sm:border sm:border-white/5 py-0 sm:py-8 sm:rounded-[2rem] sm:backdrop-blur-lg">
                        <p className="text-zinc-500 text-xs font-medium tracking-wide">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-cyan-400 hover:text-white font-black transition-all ml-1 uppercase tracking-widest">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Android App Download - Hidden on Mobile App Context */}
                    <div className="hidden sm:block">
                      <Link
                          to="/install-guide"
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
                      </Link>
                    </div>

                    <footer className="mt-8 text-center opacity-20 pointer-events-none">
                        <p className="text-[9px] uppercase tracking-[0.6em] text-white">© 2026 Thread Sense Intelligence</p>
                    </footer>
                </motion.div>
            </div >
        </div >
    );
}
