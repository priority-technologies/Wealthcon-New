import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
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
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", messageSchema);

export default Messages;
