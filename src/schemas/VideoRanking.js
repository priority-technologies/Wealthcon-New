import mongoose from "mongoose";

const videoRankingSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Videos",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    studentCategory: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const VideoRanking =
  mongoose.models.VideoRanking ||
  mongoose.model("VideoRanking", videoRankingSchema);

export default VideoRanking;
