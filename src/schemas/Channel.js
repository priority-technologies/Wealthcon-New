import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    profilePicture: {
      type: String,
      trim: true,
      default: null,
    },
    videoCount: {
      type: Number,
      default: 0,
    },
    educatorName: {
      type: String,
      trim: true,
      default: null,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Channel =
  mongoose.models.Channel || mongoose.model("Channel", channelSchema);

export default Channel;
