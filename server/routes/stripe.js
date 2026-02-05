import express from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...");
const SECRET = process.env.JWT_SECRET || "threadsense_secret_key_123";

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access Denied" });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) { res.status(400).json({ error: "Invalid Token" }); }
};

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", verifyToken, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "ThreadSense Pro Plan",
                            description: "Full AI features, history, and team access",
                        },
                        unit_amount: 2900, // $29.00
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/success`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/cancel`,
            client_reference_id: req.user.id,
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
