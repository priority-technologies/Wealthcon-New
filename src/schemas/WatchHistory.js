import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videos",
      required: true,
    },
    watchedDuration: { type: Number, default: 0 }, 
    videoDuration: { type: Number },
    lastWatchedAt: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const watchHistory =
  mongoose.models.watchHistory ||
  mongoose.model("watchHistory", watchHistorySchema);

export default watchHistory;
