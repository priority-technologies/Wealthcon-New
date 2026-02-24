import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    thumbnailFileName: { type: String, default: "" },
    noteUrl: {
      type: String,
      required: [true, "Note URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL for a video!`,
      },
    },
    noteFileName: {
      type: String,
      required: [true, "Notes file name is required"],
    },
    pageCount: { type: Number },
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
    notesCreatedAt: {
      type: Date,
      required: [true, "Notes create date is required"],
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);

export default Notes;
