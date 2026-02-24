import { roles } from "@/helpers/constant";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: roles,
      default: "lot1",
      required: [true, "Role is required"],
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
      require: true,
      validate: {
        validator: function (v) {
          const sanitizedNumber =
            typeof v === "string" && v.startsWith("+") ? v.slice(1) : v;
          return /^[0-9]{5,15}$/.test(sanitizedNumber);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    savedLater: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    viewVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
    viewNotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes",
      },
    ],
    viewGallaries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallaries",
      },
    ],
    viewMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
      },
    ],
    viewAnnouncements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcements",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "isActive status is required"],
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
