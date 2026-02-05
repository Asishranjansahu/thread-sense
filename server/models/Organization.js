import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tier: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Organization", OrganizationSchema);
