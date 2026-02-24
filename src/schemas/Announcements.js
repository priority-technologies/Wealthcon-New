import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: [true, 'Message is required'],
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
        sender:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        datetime: {
            type: Date,
            required: [true, 'Date and time is required'],
        },
    },
    {
        timestamps: true,
    }
);

const Announcements = mongoose.models.Announcements || mongoose.model("Announcements", announcementSchema);

export default Announcements;
