import mongoose from "mongoose";

const BgImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BgImage || mongoose.model("BgImage", BgImageSchema);
