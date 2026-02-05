import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Subscription", SubscriptionSchema);
