import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Lock, Mail, ArrowRight, Loader, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { API } from "../config";
import ThreadSenseLogo3D from "../components/ThreadSenseLogo3D";

export default function Signup() {
    const [signupMethod, setSignupMethod] = useState("email"); // 'email' or 'phone'
    const [username, setUsername] = useState("");
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(0); // 0: Register, 1: Verify OTP
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (step === 0) {
                const body = signupMethod === "email"
                    ? { username, email: identifier, password }
                    : { username, phone: identifier, password };

                const res = await fetch(`${API}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Registration failed");

                console.log("Registration Success. Transitioning to Step 1. UserID:", data.userId);
                setUserId(data.userId);
                setStep(1);
            } else {
                const res = await fetch(`${API}/api/auth/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, otp })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Verification failed");

                login(data.user, data.token);
                navigate("/");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert("New neural sync code transmitted. Check console.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-black overflow-hidden relative font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

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
                    <h2 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase">
                        Join the <span className="text-purple-500">Evolution</span>.
                    </h2>
                    <p className="text-zinc-500 text-lg font-light tracking-wide max-w-md mx-auto">
                        Initialize your identity and access the global intelligence layer.
                    </p>

                    {/* Neural Lines Decor */}
                    <div className="absolute top-10 right-10 flex gap-2 opacity-20">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1 h-32 bg-gradient-to-b from-purple-500 to-transparent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
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
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-bold opacity-60">Initialize Identity</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-4">
                                    <p className="text-red-500 text-[10px] text-center font-bold tracking-widest uppercase">{error}</p>
                                </div>
                            )}

                            {step === 0 ? (
                                <div className="space-y-4">
                                    <div className="flex bg-white/[0.03] p-1 rounded-2xl mb-6 border border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setSignupMethod("email")}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signupMethod === 'email' ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSignupMethod("phone")}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${signupMethod === 'phone' ? 'bg-white/10 text-cyan-400 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            Phone
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                                        placeholder="Operative Alias (Username)"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />

                                    <input
                                        type={signupMethod === 'email' ? 'email' : 'tel'}
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                                        placeholder={signupMethod === 'email' ? "Agent ID / Email" : "Neural Terminal Phone"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />

                                    <input
                                        type="password"
                                        className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all text-sm font-medium"
                                        placeholder="Security Key (Password)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center mb-6">
                                        <ShieldCheck className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-pulse relative z-10" />
                                        <h3 className="text-white font-black uppercase text-sm tracking-widest">Neural Link Required</h3>
                                        <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">Identity verification transmitted to your frequency. Enter the 6-digit sync code.</p>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        className="w-full bg-white/[0.03] border border-cyan-500/30 p-5 rounded-2xl text-white text-center text-2xl font-black tracking-[0.5em] placeholder:text-zinc-800 focus:outline-none focus:border-cyan-500 transition-all"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStep(0)}
                                        className="w-full text-[9px] text-zinc-600 hover:text-cyan-400 font-black uppercase tracking-[0.3em] transition-colors mb-2"
                                    >
                                        Reset Transmission
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resendOTP}
                                        className="w-full text-[8px] text-zinc-700 hover:text-white font-bold uppercase tracking-widest transition-colors"
                                    >
                                        Resend Synchronizer
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? <Loader className="animate-spin w-4 h-4" /> : step === 0 ? "Establish Identity" : "Activate Identity"}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
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
                                text="signup_with"
                                useOneTap
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-[10px] text-center mt-4 font-bold tracking-widest uppercase">{error}</p>
                        )}
                    </div>

                    <div className="mt-8 text-center bg-white/[0.02] border border-white/5 py-8 rounded-[2rem] backdrop-blur-lg">
                        <p className="text-zinc-500 text-xs font-medium tracking-wide">
                            Already Authorized?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-white font-black transition-all ml-1 uppercase tracking-widest">
                                Login Here
                            </Link>
                        </p>
                    </div>

                    <footer className="mt-8 text-center opacity-20 pointer-events-none">
                        <p className="text-[9px] uppercase tracking-[0.6em] text-white">© 2026 Thread Sense Intelligence</p>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
}
