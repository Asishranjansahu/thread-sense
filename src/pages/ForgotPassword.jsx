import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, ArrowRight, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API } from "../config";

export default function ForgotPassword() {
    const [step, setStep] = useState(0); // 0: Request OTP, 1: Verify & Reset
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`${API}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess("Recovery protocol initiated. Check your frequency.");
            setStep(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${API}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, otp, newPassword })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess("Security key successfully re-encrypted.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative font-sans p-6">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 rounded-full blur-[150px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Abort Recovery
                    </Link>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>

                    <div className="text-center mb-8">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                            Recovery <span className="text-red-500">Protocol</span>
                        </h1>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                            {step === 0 ? "Identify Operative" : "Verify & Re-encrypt"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl mb-6">
                            <p className="text-red-500 text-[10px] text-center font-bold tracking-widest uppercase">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 p-3 rounded-xl mb-6">
                            <p className="text-green-500 text-[10px] text-center font-bold tracking-widest uppercase">{success}</p>
                        </div>
                    )}

                    {step === 0 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email or Phone</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 transition-all text-sm font-medium"
                                    placeholder="Enter identifier..."
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group mt-4"
                            >
                                {loading ? <Loader className="animate-spin w-4 h-4" /> : "Transmit Recovery Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Recovery Code</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white text-center tracking-[0.5em] font-black text-lg focus:outline-none focus:border-red-500/50 transition-all"
                                    placeholder="000000"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold ml-1">New Security Key</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 transition-all text-sm font-medium"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group mt-4"
                            >
                                {loading ? <Loader className="animate-spin w-4 h-4" /> : "Establish New Protocol"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
