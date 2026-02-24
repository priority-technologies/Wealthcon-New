import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

const gallarySchema = new mongoose.Schema(
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
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL for a video!`,
      },
    },
    imageFileName: {
      type: String,
      required: [true, "Image file name is required"],
    },
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
    isDownloadable: {
      type: Boolean,
      default: false,
    },
    imageCreatedAt: {
      type: Date,
      required: [true, "Image create date is required"],
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Gallary =
  mongoose.models.Gallary || mongoose.model("Gallary", gallarySchema);

export default Gallary;
