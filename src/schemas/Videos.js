import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    thumbnail: {
      type: String,
      default: "",
    },
    shorts: {
      type: Boolean,
      default: false,
    },
    orientation: {
      type: String,
      enum: ["portrait", "landscape"],
      default: "landscape",
    },
    thumbnailFileName: { type: String, default: "" },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Accept both absolute URLs and relative paths
          return /^(https?:\/\/.+\..+|\/uploads\/.+)/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL for a video!`,
      },
    },
    videoFileName: {
      type: String,
      required: [true, "Video file name is required"],
    },
    videoDuration: { type: Number },
    studentCategory: [
      {
        type: String,
        enum: adminRoles,
        validate: {
          validator: function (v) {
            return v.length > 0;
          },
          message: "At least one category is required",
        },
      },
    ],
    videoCategory: {
      type: String,
      required: [true, "Video category is required"],
      enum: {
        values: ["live", "assignment"],
        message: "{VALUE} is not a valid video category",
      },
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: false,
    },
    isDownloadable: {
      type: Boolean,
      default: false,
    },
    videoCreatedAt: {
      type: Date,
      required: [true, "Video create date is required"],
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    conversionStatus: {
      type: String,
      enum: ['pending', 'converting', 'completed', 'failed'],
      default: 'pending',
    },
    conversionProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    hlsUrl: {
      type: String,
      default: null,
    },
    conversionAttempts: {
      type: Number,
      default: 0,
    },
    conversionError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Videos = mongoose.models.Videos || mongoose.model("Videos", videoSchema);

export default Videos;
