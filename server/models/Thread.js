import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: "Reddit Thread"
    },
    summary: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    keywords: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        default: "Uncategorized"
    },
    platform: {
        type: String,
        enum: ["reddit", "youtube", "twitter", "unknown"],
        default: "reddit"
    },
    chatHistory: [
        {
            role: String,
            content: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Thread", ThreadSchema);
