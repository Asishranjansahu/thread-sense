import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Check, Zap, Shield, Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "../config";

export default function Pricing() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API + "/api/stripe/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Stripe Session Error: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Connection to payment gateway failed.");
        }
        setLoading(false);
    };

    const plans = [
        {
            name: "Neural Scout",
            price: "Free",
            description: "Entry-level intelligence gathering.",
            features: ["3 Scans per day", "Standard AI Summaries", "Basic History"],
            button: "Current Plan",
            active: false,
            color: "zinc"
        },
        {
            name: "Thread Master",
            price: "$29",
            period: "/mo",
            description: "Professional grade neural analysis.",
            features: ["Unlimited Transmissions", "Advanced Chat Memory", "Team Organization", "Priority Support", "Neural Pulse Analytics"],
            button: "Infiltrate Now",
            active: true,
            color: "cyan"
        }
    ];

    return (
        <div className="min-h-screen py-20 px-4 md:px-8 space-y-16 relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#030303]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <header className="text-center space-y-6 pt-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black tracking-tighter"
                >
                    UPGRADE <span className="text-cyan-500">CLEARANCE</span>
                </motion.h1>
                <p className="text-zinc-500 max-w-xl mx-auto font-light text-lg italic">
                    Unlock the full potential of the ThreadSense neural network and dominate the information landscape.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-panel p-8 md:p-12 flex flex-col justify-between relative group ${plan.active ? 'border-cyan-500/30' : 'border-white/5'}`}
                    >
                        {plan.active && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                                Recommended Clearance
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                                    <p className="text-zinc-500 text-sm mt-1">{plan.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
                                </div>
                            </div>

                            <div className="space-y-4 mb-12">
                                {plan.features.map((f, j) => (
                                    <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.active ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-zinc-500'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={plan.active ? handleSubscribe : undefined}
                            disabled={loading || !plan.active}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all ${plan.active
                                ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(0,243,255,0.2)] hover:scale-[1.02] active:scale-95'
                                : 'bg-white/5 text-zinc-500 cursor-default'
                                }`}
                        >
                            {loading && plan.active ? "Infiltrating..." : plan.button}
                        </button>
                    </motion.div>
                ))}
            </div>

            <footer className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 border-t border-white/5">
                {[
                    { icon: Zap, label: "Instant Activation" },
                    { icon: Shield, label: "Encrypted Transactions" },
                    { icon: Globe, label: "Global Frequency" },
                    { icon: Check, label: "Cancel Anytime" }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 text-center text-zinc-600">
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </footer>
        </div>
    );
}
