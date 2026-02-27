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
    watchedDuration: { type: Number, default: 0 },  // Seconds watched
    videoDuration: { type: Number },                // Total video duration in seconds
    lastWatchedAt: { type: Date, default: Date.now }, // When user last watched
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const watchHistory =
  mongoose.models.watchHistory ||
  mongoose.model("watchHistory", watchHistorySchema);

export default watchHistory;
