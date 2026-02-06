import { Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function PaymentSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303] p-4 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel p-8 md:p-16 max-w-lg w-full space-y-8 border-cyan-500/30"
            >
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                        <ShieldCheck className="w-12 h-12 text-cyan-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Clearance <span className="text-cyan-500">Authorized</span></h1>
                <p className="text-zinc-500 italic">Welcome to the elite tier, operative. Your neural interface has been upgraded to Master Level.</p>
                <Link to="/" className="btn-primary w-full py-5 block">
                    <span>Access Terminal</span>
                </Link>
            </motion.div>
        </div>
    );
}

export function PaymentCancel() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303] p-4 text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel p-8 md:p-16 max-w-lg w-full space-y-8 border-red-500/30"
            >
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Transaction <span className="text-red-500">Terminated</span></h1>
                <p className="text-zinc-500 italic">The payment frequency was interrupted. Your clearance remains unchanged.</p>
                <Link to="/pricing" className="btn-primary w-full py-5 block bg-zinc-900 border-zinc-800">
                    <span className="text-zinc-400">Back to Pricing</span>
                </Link>
            </motion.div>
        </div>
    );
}
