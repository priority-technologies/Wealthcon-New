import mongoose from "mongoose";

const BgImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  imageType: {
    type: String,
    enum: ["Auth Image", "Banner Image"],
    default: "Auth Image",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BgImage || mongoose.model("BgImage", BgImageSchema);
